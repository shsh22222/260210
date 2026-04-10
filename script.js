/* =========================================================
   両利きの魔導書 (Ambidextrous Grimoire) — Learning RPG
   ========================================================= */

const STORAGE_KEY = "grimoire_state_v1";

/* ---------- Stat definitions ---------- */
const STAT_DEFS = [
  { key: "purpose",    label: "目的定義力",   rpg: "目的の術式" },
  { key: "design",     label: "設計力",       rpg: "設計の術式" },
  { key: "ai_hi",      label: "AI/HI判断力", rpg: "二刀流魔法陣" },
  { key: "reflection", label: "振り返り力",   rpg: "内省の魔法陣" },
];

/* ---------- Diagnosis questions (7) ---------- */
const QUESTIONS = [
  { stat: "purpose",    text: "新しい仕事に取りかかる前、「なぜそれをやるのか」を自分の言葉で語れる。" },
  { stat: "purpose",    text: "目的を確認せずに、言われたまま動いてしまうことがある。", reverse: true },
  { stat: "design",     text: "作業の範囲や完了条件を、事前に相手とすり合わせている。" },
  { stat: "design",     text: "「だいたいこんな感じ」で始めて、後で手戻りが発生することが多い。", reverse: true },
  { stat: "ai_hi",      text: "AIに任せる部分と、自分で判断する部分を意識的に分けている。" },
  { stat: "ai_hi",      text: "AIの答えをそのまま採用してしまい、後から違和感に気づく。", reverse: true },
  { stat: "reflection", text: "行動の後、うまくいった点・改善点を振り返る習慣がある。" },
];

/* ---------- Cases (術式修行) ---------- */
const CASES = {
  case_purpose: {
    id: "case_purpose",
    stat: "purpose",
    title: "『問われぬ目的の代償』",
    tag: "第一の術式 · 目的",
    summary: "目的を問わずに動いた若き魔法使いの物語。",
    intro: [
      "この修行の物語は、とある若き魔法使いの話じゃ。",
      "彼は師より「市場の声を集めてまいれ」と命じられ、意気揚々と三日三晩の旅に出た。",
      "だが戻ってみれば、師の欲しかったものは「次の祭りで売る薬草の需要」——彼が集めたのは『民の流行り歌』じゃった。",
    ],
    questions: [
      { q: "旅人よ、この若者はどこで術を誤ったと思うかの？" },
      { q: "もしそなたなら、旅立ちの前にどんな問いを師に投げかけるかの？" },
      { q: "「目的を確認する」ために、そなたが明日から変えられる小さな行いは何じゃろう？" },
    ],
    feedbacks: [
      "ふむ、鋭い眼差しじゃ。目的の解像度が低いまま動けば、成果もまた霧の中。",
      "よき問いじゃ！問いを立てる力こそ、最も強き呪文よ。",
      "素晴らしい覚醒の兆しじゃ。小さき一歩が、大いなる術式となる。",
    ],
  },
  case_design: {
    id: "case_design",
    stat: "design",
    title: "『終わりなき結界』",
    tag: "第二の術式 · 設計",
    summary: "完了条件を決めずに結界を張り続けた魔法使いの物語。",
    intro: [
      "これは、とある宮廷魔法使いが、王より「結界を張れ」と命じられた話じゃ。",
      "彼は夜通し結界を張り続けた——しかし「どこまで」「いつまで」を問わなんだ。",
      "朝、王は別の結界を求め、彼の一夜の努力は無に帰した。",
    ],
    questions: [
      { q: "この魔法使いに欠けていた『設計の術式』とは何じゃろうか？" },
      { q: "そなたが仕事を始める時、どんな条件をすり合わせておくべきじゃろう？" },
      { q: "相手の期待値を確かめるため、明日試せる一言は何じゃ？" },
    ],
    feedbacks: [
      "ふむ、核心を突いておる。範囲と完了条件なき術は、ただの浪費じゃ。",
      "見事な洞察よ。期待値のすり合わせこそ、最大の時短魔法じゃ。",
      "その一言が、そなたを『術師』へと押し上げるじゃろう。",
    ],
  },
  case_ai_hi: {
    id: "case_ai_hi",
    stat: "ai_hi",
    title: "『魔法陣に呑まれし者』",
    tag: "第三の術式 · 二刀流",
    summary: "AI魔法陣に頼り切った魔法使いの物語。",
    intro: [
      "これは、AIの魔法陣（自動詠唱の巻物）に頼り切った若き魔法使いの話じゃ。",
      "彼は巻物の出した答えをそのまま王に献上した——だが王は言った。「これは隣国の答えではないか」と。",
      "巻物は万能ではない。人間の意志（HI）で磨かねば、魔法陣はただの鏡となる。",
    ],
    questions: [
      { q: "魔法陣の答えを『そのまま』使うと、なぜ危ういのじゃろう？" },
      { q: "AI（魔法陣）に任せてよい仕事、人間が判断すべき仕事——どう線を引くかの？" },
      { q: "明日、AIの出力に加えるそなたなりの『一筆』とは何じゃ？" },
    ],
    feedbacks: [
      "うむ。答えの早さに惹かれ、問いの質を忘れると痛手となる。",
      "素晴らしい。二刀流とは、両方を疑い、両方を活かすことじゃ。",
      "その『一筆』がそなたの意志の証——AIには描けぬ線じゃ。",
    ],
  },
  case_reflection: {
    id: "case_reflection",
    stat: "reflection",
    title: "『振り返らぬ旅人』",
    tag: "第四の術式 · 内省",
    summary: "走り続け、内省を忘れた旅人の物語。",
    intro: [
      "とある旅人は、日々新たな術を覚えることに夢中であった。",
      "だが一年経ち、彼は同じ失敗を三度繰り返しておる自分に気づく。",
      "師は言った——『経験は内省という魔法陣を通してのみ、力となる』と。",
    ],
    questions: [
      { q: "なぜ同じ失敗が繰り返されるのじゃろう？" },
      { q: "『内省の魔法陣』を日々回すには、どんな仕組みが要るかの？" },
      { q: "今日あった出来事を一つ、旅人よ——ここで小さく振り返ってみぬか？" },
    ],
    feedbacks: [
      "ふむ、気づきこそ覚醒の第一歩じゃ。",
      "よき仕組みよ。仕組み化されぬ誓いは、風に散る呪文となる。",
      "見事な内省じゃ。その一つひとつが、そなたの魔導書を厚くしていく。",
    ],
  },
};

/* ---------- Ranks ---------- */
const RANKS = [
  { min: 0,  name: "見習い魔法使い" },
  { min: 20, name: "術師" },
  { min: 28, name: "大魔法使い" },
  { min: 34, name: "賢者" },
  { min: 38, name: "魔導師" },
];

function rankOf(stats) {
  const total = STAT_DEFS.reduce((s, d) => s + (stats[d.key] || 0), 0);
  let current = RANKS[0];
  for (const r of RANKS) if (total >= r.min) current = r;
  return current.name;
}

function starsFor(score) {
  const full = Math.max(0, Math.min(5, Math.round(score / 2)));
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/* ---------- State management ---------- */
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (_) {
    return {};
  }
}
function saveState(patch) {
  const s = { ...loadState(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
}
function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ---------- Navigation ---------- */
const screens = document.querySelectorAll(".screen");
const backBtn = document.getElementById("btnBack");
const navStack = ["screen-title"];

function showScreen(id, push = true) {
  screens.forEach((s) => s.classList.toggle("active", s.id === id));
  if (push && navStack[navStack.length - 1] !== id) navStack.push(id);
  backBtn.hidden = navStack.length <= 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "screen-title") renderTitle();
  if (id === "screen-case-select") renderCaseList();
  if (id === "screen-levelup") renderLevelUp();
}

backBtn.addEventListener("click", () => {
  if (navStack.length > 1) {
    navStack.pop();
    const prev = navStack[navStack.length - 1];
    showScreen(prev, false);
  }
});

document.getElementById("btnReset").addEventListener("click", () => {
  if (confirm("旅人よ、本当にそなたの魔導書を初めから綴り直すかの？")) {
    resetState();
    navStack.length = 0;
    navStack.push("screen-title");
    showScreen("screen-title", false);
  }
});

document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => showScreen(el.dataset.go));
});

/* ---------- Title screen rendering ---------- */
function renderTitle() {
  const state = loadState();
  const stats = state.latestStats;
  const rankEl = document.getElementById("rankName");
  const miniEl = document.getElementById("miniStats");
  if (stats) {
    rankEl.textContent = rankOf(stats);
    miniEl.innerHTML = STAT_DEFS.map(
      (d) => `<div class="ms"><b>${d.label}</b>${starsFor(stats[d.key] || 0)}</div>`
    ).join("");
  } else {
    rankEl.textContent = "未測定";
    miniEl.innerHTML = STAT_DEFS.map(
      (d) => `<div class="ms"><b>${d.label}</b>☆☆☆☆☆</div>`
    ).join("");
  }
}

/* ---------- Diagnosis flow ---------- */
let diagIndex = 0;
let diagAnswers = [];

document.getElementById("startDiagnosis").addEventListener("click", () => {
  diagIndex = 0;
  diagAnswers = [];
  document.getElementById("diagTotal").textContent = QUESTIONS.length;
  showQuestion();
  showScreen("screen-diagnosis-q");
});

function showQuestion() {
  const q = QUESTIONS[diagIndex];
  document.getElementById("qNum").textContent = `問い ${toKanjiNum(diagIndex + 1)}`;
  document.getElementById("qText").textContent = q.text;
  document.getElementById("diagStep").textContent = diagIndex + 1;
  const pct = ((diagIndex) / QUESTIONS.length) * 100;
  document.getElementById("diagBar").style.width = `${pct}%`;
  document.querySelectorAll("#scaleBtns button").forEach((b) => b.classList.remove("selected"));
}

document.querySelectorAll("#scaleBtns button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = parseInt(btn.dataset.val, 10);
    btn.classList.add("selected");
    diagAnswers.push({ stat: QUESTIONS[diagIndex].stat, val, reverse: !!QUESTIONS[diagIndex].reverse });
    setTimeout(() => {
      diagIndex++;
      if (diagIndex >= QUESTIONS.length) {
        finishDiagnosis();
      } else {
        showQuestion();
      }
    }, 250);
  });
});

function finishDiagnosis() {
  document.getElementById("diagBar").style.width = "100%";
  // Compute scores 1-10 per stat.
  const buckets = {};
  STAT_DEFS.forEach((d) => (buckets[d.key] = []));
  diagAnswers.forEach((a) => {
    const v = a.reverse ? 6 - a.val : a.val; // 1..5
    buckets[a.stat].push(v);
  });
  const stats = {};
  STAT_DEFS.forEach((d) => {
    const arr = buckets[d.key];
    if (arr.length === 0) {
      stats[d.key] = 5;
    } else {
      const avg = arr.reduce((s, x) => s + x, 0) / arr.length; // 1..5
      stats[d.key] = Math.round(avg * 2); // 2..10
    }
  });

  // Save: if no before stats yet, store as baseline.
  const state = loadState();
  const patch = { latestStats: stats };
  if (!state.baselineStats) patch.baselineStats = stats;
  saveState(patch);

  renderDiagnosisResult(stats);
  showScreen("screen-diagnosis-result");
}

function renderDiagnosisResult(stats) {
  document.getElementById("resultRank").textContent = rankOf(stats);
  const list = document.getElementById("statsList");
  list.innerHTML = STAT_DEFS.map((d) => {
    return `<div class="stat-row">
      <span class="stat-name">${d.label}</span>
      <span class="stars-row">${starsFor(stats[d.key])}</span>
      <span class="score">${stats[d.key]}/10</span>
    </div>`;
  }).join("");

  // Find weakest stat.
  const weakest = STAT_DEFS.reduce((w, d) =>
    stats[d.key] < stats[w.key] ? d : w
  , STAT_DEFS[0]);
  const recCase = Object.values(CASES).find((c) => c.stat === weakest.key);

  const narrative = document.getElementById("diagNarrative");
  narrative.innerHTML = `
    <p>水晶球がそなたの術式を映し出した、旅人よ。</p>
    <p>特に<b>${weakest.label}</b>に、まだ眠れる力を感じるぞ。
    その扉を叩くのは、今じゃ。</p>
    <p>焦らずともよい——一つひとつの修行が、そなたを<em>覚醒</em>へ導くじゃろう。</p>
  `;

  document.getElementById("nextCaseTitle").textContent = recCase.title;
  document.getElementById("goRecommendedCase").onclick = () => {
    openCase(recCase.id);
  };
}

function toKanjiNum(n) {
  const k = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  return k[n] || String(n);
}

/* ---------- Case flow ---------- */
function renderCaseList() {
  const list = document.getElementById("caseList");
  list.innerHTML = Object.values(CASES)
    .map(
      (c) => `<button class="case-card" data-case="${c.id}">
        <span class="case-tag">${c.tag}</span>
        <h3>${c.title}</h3>
        <p>${c.summary}</p>
      </button>`
    )
    .join("");
  list.querySelectorAll("[data-case]").forEach((btn) => {
    btn.addEventListener("click", () => openCase(btn.dataset.case));
  });
}

let currentCase = null;
let caseStep = 0;

function openCase(caseId) {
  currentCase = CASES[caseId];
  caseStep = 0;
  document.getElementById("caseTag").textContent = currentCase.tag;
  document.getElementById("caseTitle").textContent = currentCase.title;
  // Remove any trailing SSC-CTA button from previous case.
  const screen = document.getElementById("screen-case");
  screen.querySelectorAll(".ssc-cta").forEach((b) => b.remove());
  const log = document.getElementById("dialogLog");
  log.innerHTML = "";
  // Intro narration.
  const intro = document.createElement("div");
  intro.className = "narration";
  intro.innerHTML = currentCase.intro.map((p) => `<p>${p}</p>`).join("");
  log.appendChild(intro);
  // First question.
  appendSage(currentCase.questions[0].q);
  document.getElementById("answerInput").value = "";
  showAnswerArea(true);
  showScreen("screen-case");
}

function appendSage(text) {
  const log = document.getElementById("dialogLog");
  const el = document.createElement("div");
  el.className = "sage-msg";
  el.innerHTML = `<p>${text}</p>`;
  log.appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "end" });
}
function appendUser(text) {
  const log = document.getElementById("dialogLog");
  const el = document.createElement("div");
  el.className = "user-msg";
  el.textContent = text;
  log.appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "end" });
}
function showAnswerArea(show) {
  document.getElementById("answerArea").style.display = show ? "block" : "none";
}

document.getElementById("submitAnswer").addEventListener("click", () => {
  const input = document.getElementById("answerInput");
  const text = input.value.trim();
  if (!text) return;
  appendUser(text);
  const fb = currentCase.feedbacks[caseStep] || "うむ、よき答えじゃ。";
  setTimeout(() => appendSage(fb), 300);
  caseStep++;
  if (caseStep < currentCase.questions.length) {
    setTimeout(() => {
      appendSage(currentCase.questions[caseStep].q);
      input.value = "";
    }, 900);
  } else {
    // End: lead to SSC.
    setTimeout(() => {
      appendSage(
        "見事な修行であった、旅人よ。さあ、今日の学びを<b>冒険の誓い</b>に刻もうぞ。"
      );
      showAnswerArea(false);
      const btn = document.createElement("button");
      btn.className = "primary-btn ssc-cta";
      btn.textContent = "📜 誓いを立てる";
      btn.onclick = () => {
        // Remember completed case.
        const state = loadState();
        const done = state.completedCases || [];
        if (!done.includes(currentCase.id)) done.push(currentCase.id);
        saveState({ completedCases: done, lastCase: currentCase.id });
        showScreen("screen-ssc-intro");
      };
      document.getElementById("answerArea").parentElement.appendChild(btn);
      document.getElementById("answerArea").style.display = "none";
    }, 1400);
  }
  input.value = "";
});

/* ---------- SSC flow ---------- */
document.getElementById("sscForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const start = fd.get("start").toString().trim();
  const stop = fd.get("stop").toString().trim();
  const cont = fd.get("continue").toString().trim();
  if (!start || !stop || !cont) return;

  // Determine which stat to boost — based on last case, else weakest.
  const state = loadState();
  let boostStat = null;
  if (state.lastCase && CASES[state.lastCase]) boostStat = CASES[state.lastCase].stat;
  else if (state.latestStats) {
    const w = STAT_DEFS.reduce((w, d) =>
      state.latestStats[d.key] < state.latestStats[w.key] ? d : w
    , STAT_DEFS[0]);
    boostStat = w.key;
  } else boostStat = "purpose";

  // Apply boost to latest stats.
  const stats = { ...(state.latestStats || { purpose: 5, design: 5, ai_hi: 5, reflection: 5 }) };
  stats[boostStat] = Math.min(10, (stats[boostStat] || 5) + 1);
  saveState({
    latestStats: stats,
    lastSSC: { start, stop, continue: cont, stat: boostStat, at: Date.now() },
  });

  renderSSCResult({ start, stop, cont, boostStat });
  showScreen("screen-ssc-result");
  e.target.reset();
});

function renderSSCResult({ start, stop, cont, boostStat }) {
  const scroll = document.getElementById("sscScroll");
  scroll.innerHTML = `
    <div class="vow-title">⚜ 冒険の誓い ⚜</div>
    <div class="vow-item">
      <span class="vow-label">✨ 明日から唱える新しき術式</span>
      <div>— <b>${escapeHTML(start)}</b></div>
    </div>
    <div class="vow-item">
      <span class="vow-label">🚫 封印する古き呪文</span>
      <div>— <b>${escapeHTML(stop)}</b></div>
    </div>
    <div class="vow-item">
      <span class="vow-label">🔥 磨き続ける得意魔法</span>
      <div>— <b>${escapeHTML(cont)}</b></div>
    </div>
  `;
  const statLabel = STAT_DEFS.find((d) => d.key === boostStat).label;
  document.getElementById("statImpact").innerHTML =
    `この誓いは <b>${statLabel}</b> を高める術式じゃ。<br/>魔導書に刻まれた誓いは、そなたの覚醒を加速させるじゃろう。`;

  // Recommend next case = weakest remaining.
  const state = loadState();
  const done = state.completedCases || [];
  const remaining = Object.values(CASES).filter((c) => !done.includes(c.id));
  const pool = remaining.length ? remaining : Object.values(CASES);
  let next = pool[0];
  if (state.latestStats) {
    next = pool.reduce((best, c) => {
      const s = state.latestStats[c.stat] ?? 5;
      const bs = state.latestStats[best.stat] ?? 5;
      return s < bs ? c : best;
    }, pool[0]);
  }
  document.getElementById("sscNextCaseTitle").textContent = next.title;
  document.getElementById("sscGoNext").onclick = () => openCase(next.id);
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* ---------- Level up ---------- */
function renderLevelUp() {
  const state = loadState();
  const body = document.getElementById("levelupBody");
  if (!state.baselineStats || !state.latestStats) {
    body.innerHTML = `
      <div class="notice">
        まだ覚醒の軌跡は記されておらぬ、旅人よ。<br/>
        まずは <b>🔮 診断する</b> で水晶球を覗き、旅を始めるのじゃ。
      </div>
    `;
    return;
  }
  const before = state.baselineStats;
  const after = state.latestStats;
  const rows = STAT_DEFS.map((d) => {
    const b = before[d.key];
    const a = after[d.key];
    const delta = a - b;
    const cls = delta > 0 ? "up" : "same";
    const mark = delta > 0 ? `+${delta}` : "±0";
    return `<div class="growth-row">
      <span class="name">${d.label}</span>
      <span class="before">${starsFor(b)}</span>
      <span class="arrow">➤</span>
      <span class="after">${starsFor(a)}</span>
      <span class="delta ${cls}">${mark}</span>
    </div>`;
  }).join("");

  const weakest = STAT_DEFS.reduce((w, d) =>
    after[d.key] < after[w.key] ? d : w
  , STAT_DEFS[0]);
  const recCase = Object.values(CASES).find((c) => c.stat === weakest.key);

  const grew = STAT_DEFS.filter((d) => after[d.key] > before[d.key]);
  const growNarr = grew.length
    ? `見事な覚醒じゃ、旅人よ。とりわけ <b>${grew.map((g) => g.label).join("・")}</b> が輝きを増しておる。`
    : `歩みは静かに始まっておる。次なる修行で、さらなる覚醒を呼び起こそうぞ。`;

  body.innerHTML = `
    <div class="result-rank">
      <div class="result-rank-name">${rankOf(after)}</div>
      <div class="result-rank-sub">現在の冒険者ランク</div>
    </div>
    <div class="levelup-card">
      <h3>⚔ 四元の術式 · 成長の軌跡 ⚔</h3>
      ${rows}
    </div>
    <div class="sage-bubble stand-alone">
      <p>${growNarr}</p>
      <p>まだ弱き<b>${weakest.label}</b>には、次なる術式
      「<em>${recCase.title}</em>」が良き鍛錬となるじゃろう。</p>
    </div>
    <button class="primary-btn" id="luGoCase">次の修行へ挑む</button>
  `;
  document.getElementById("luGoCase").onclick = () => openCase(recCase.id);
}

/* ---------- Init ---------- */
showScreen("screen-title", false);
navStack.length = 0;
navStack.push("screen-title");
backBtn.hidden = true;
