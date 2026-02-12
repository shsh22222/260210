const form = document.querySelector(".checkin-form");
const statusButtons = document.querySelectorAll(".primary");
const scrollButtons = document.querySelectorAll("[data-scroll]");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const exportButtons = document.querySelectorAll("[data-export]");
const copyButtons = document.querySelectorAll("[data-copy]");
const toast = document.getElementById("toast");
const reflectionList = document.querySelector(".reflection-list");
const summaryCards = document.querySelectorAll(".reflection-summary article h3");

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
};

const animateButton = (button) => {
  button.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    { duration: 300 }
  );
};

statusButtons.forEach((button) => {
  button.addEventListener("click", () => animateButton(button));
});

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-scroll");
    if (!targetId) return;
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-tab");
    if (!target) return;
    tabButtons.forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", tab === button ? "true" : "false");
    });
    tabPanels.forEach((panel) => {
      const isActive = panel.getAttribute("data-panel") === target;
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  });
});

exportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "/api/export.csv";
    showToast("CSVをダウンロードします");
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const shareLink = `${window.location.origin}/reflections.html`;
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast("共有リンクをコピーしました");
    } catch {
      showToast("コピーに失敗しました");
    }
  });
});

const submitCheckin = async (event) => {
  event.preventDefault();
  if (!form) return;

  const practiceInput = form.querySelector('input[type="number"]');
  const retentionInput = form.querySelector('input[type="range"]');
  const contentInput = form.querySelector("textarea");
  const tagInput = form.querySelector("select");
  const button = form.querySelector("button.primary");

  if (!practiceInput || !retentionInput || !contentInput || !tagInput || !button) return;

  const payload = {
    title: "日次チェックイン",
    content: contentInput.value || "記録なし",
    tag: tagInput.value,
    retention_score: Number(retentionInput.value),
    practice_count: Number(practiceInput.value),
  };

  const res = await fetch("/api/reflections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    showToast("保存に失敗しました");
    return;
  }

  button.textContent = "送信しました！";
  button.classList.add("submitted");
  showToast("振り返りを保存しました");
  setTimeout(() => {
    button.textContent = "チェックインを送信";
    button.classList.remove("submitted");
    form.reset();
  }, 2000);
};

if (form) {
  form.addEventListener("submit", submitCheckin);
}

const renderReflections = async () => {
  if (!reflectionList) return;
  const res = await fetch("/api/reflections?limit=20");
  if (!res.ok) return;
  const rows = await res.json();

  reflectionList.innerHTML = rows
    .map(
      (row) => `
      <article class="reflection-item">
        <div class="reflection-head">
          <strong>${row.created_at}</strong>
          <span class="tag">${row.tag}</span>
        </div>
        <p>${row.content}</p>
        <div class="reflection-meta">
          <span>定着 ${row.retention_score}</span>
          <span>実践 ${row.practice_count}回</span>
          <span>上司コメント: ${row.manager_comment ? "あり" : "なし"}</span>
        </div>
      </article>
    `
    )
    .join("");
};

const loadSummary = async () => {
  if (!summaryCards.length) return;
  const res = await fetch("/api/dashboard-summary");
  if (!res.ok) return;
  const data = await res.json();

  summaryCards[0].textContent = `${data.total_posts}件`;
  summaryCards[1].textContent = String(data.avg_retention);
  summaryCards[2].textContent = `${data.total_practice}回`;
  summaryCards[3].textContent = `${data.comment_rate}%`;
};

renderReflections();
loadSummary();
