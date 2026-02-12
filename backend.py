from __future__ import annotations

import csv
import json
import sqlite3
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import StringIO
from pathlib import Path
from urllib.parse import parse_qs, urlparse

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "training_followup.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS reflections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            tag TEXT NOT NULL,
            retention_score INTEGER NOT NULL,
            practice_count INTEGER NOT NULL,
            manager_comment INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    count = conn.execute("SELECT COUNT(*) AS c FROM reflections").fetchone()["c"]
    if count == 0:
        conn.executemany(
            """
            INSERT INTO reflections
            (created_at, title, content, tag, retention_score, practice_count, manager_comment)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [
                ("2024-02-01", "事前準備の質", "事前準備に10分使うことで会話の深さが増した。", "ヒアリング", 71, 2, 1),
                ("2024-02-05", "不安ポイントの確認", "不安ポイントを先に確認してから提案すると合意が取りやすかった。", "クロージング", 74, 1, 0),
                ("2024-02-08", "提案構成を改善", "提案資料の冒頭で顧客現状を具体化したことで反応が良かった。", "提案", 79, 2, 1),
                ("2024-02-10", "課題の言語化", "顧客課題を先に言語化してから提案する流れに変えたら会話がスムーズになった。", "ヒアリング", 84, 3, 1),
            ],
        )
    conn.commit()
    conn.close()


class AppHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _send_text(self, text, content_type="text/plain; charset=utf-8", status=200):
        payload = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _serve_file(self, path: Path):
        if not path.exists() or not path.is_file():
            self._send_text("Not Found", status=404)
            return
        suffix_map = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
        }
        self._send_text(path.read_text(encoding="utf-8"), suffix_map.get(path.suffix, "text/plain; charset=utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            return self._serve_file(BASE_DIR / "index.html")
        if path == "/reflections.html":
            return self._serve_file(BASE_DIR / "reflections.html")
        if path == "/styles.css":
            return self._serve_file(BASE_DIR / "styles.css")
        if path == "/script.js":
            return self._serve_file(BASE_DIR / "script.js")

        if path == "/api/reflections":
            query = parse_qs(parsed.query)
            limit = int(query.get("limit", ["30"])[0])
            tag = query.get("tag", [None])[0]
            conn = get_conn()
            sql = "SELECT * FROM reflections"
            params = []
            if tag and tag != "すべて":
                sql += " WHERE tag = ?"
                params.append(tag)
            sql += " ORDER BY created_at DESC, id DESC LIMIT ?"
            params.append(limit)
            rows = conn.execute(sql, params).fetchall()
            conn.close()
            return self._send_json([
                {
                    "id": r["id"],
                    "created_at": r["created_at"],
                    "title": r["title"],
                    "content": r["content"],
                    "tag": r["tag"],
                    "retention_score": r["retention_score"],
                    "practice_count": r["practice_count"],
                    "manager_comment": bool(r["manager_comment"]),
                }
                for r in rows
            ])

        if path == "/api/dashboard-summary":
            conn = get_conn()
            row = conn.execute(
                """
                SELECT
                  COUNT(*) AS total_posts,
                  ROUND(AVG(retention_score), 1) AS avg_retention,
                  SUM(practice_count) AS total_practice,
                  ROUND(AVG(manager_comment) * 100, 1) AS comment_rate
                FROM reflections
                """
            ).fetchone()
            conn.close()
            return self._send_json(
                {
                    "total_posts": row["total_posts"] or 0,
                    "avg_retention": row["avg_retention"] or 0,
                    "total_practice": row["total_practice"] or 0,
                    "comment_rate": row["comment_rate"] or 0,
                }
            )

        if path == "/api/export.csv":
            conn = get_conn()
            rows = conn.execute(
                "SELECT created_at, title, tag, retention_score, practice_count, manager_comment FROM reflections ORDER BY created_at DESC"
            ).fetchall()
            conn.close()

            buf = StringIO()
            writer = csv.writer(buf)
            writer.writerow(["日付", "タイトル", "タグ", "定着スコア", "実践回数", "上司コメント"])
            for r in rows:
                writer.writerow([
                    r["created_at"], r["title"], r["tag"], r["retention_score"], r["practice_count"], "あり" if r["manager_comment"] else "なし"
                ])
            data = buf.getvalue().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", "attachment; filename=training-followup.csv")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        self._send_text("Not Found", status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/reflections":
            return self._send_text("Not Found", status=404)

        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8")
        data = json.loads(body or "{}")

        conn = get_conn()
        conn.execute(
            """
            INSERT INTO reflections (created_at, title, content, tag, retention_score, practice_count, manager_comment)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datetime.now().strftime("%Y-%m-%d"),
                data.get("title", "日次チェックイン"),
                data.get("content", ""),
                data.get("tag", "ヒアリング"),
                int(data.get("retention_score", 70)),
                int(data.get("practice_count", 1)),
                0,
            ),
        )
        conn.commit()
        conn.close()
        self._send_json({"ok": True}, status=201)


def run_server():
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", 8000), AppHandler)
    print("Serving on http://0.0.0.0:8000")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
