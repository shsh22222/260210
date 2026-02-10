const form = document.querySelector(".checkin-form");
const statusButtons = document.querySelectorAll(".primary");
const scrollButtons = document.querySelectorAll("[data-scroll]");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const exportButtons = document.querySelectorAll("[data-export]");
const copyButtons = document.querySelectorAll("[data-copy]");
const toast = document.getElementById("toast");

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = form.querySelector("button.primary");
  if (!button) return;
  button.textContent = "送信しました！";
  button.classList.add("submitted");
  setTimeout(() => {
    button.textContent = "チェックインを送信";
    button.classList.remove("submitted");
    form.reset();
  }, 2000);
});

statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" },
      ],
      { duration: 300 }
    );
  });
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
    const type = button.getAttribute("data-export");
    const rows = [
      ["項目", "値"],
      ["定着スコア平均", "78"],
      ["実践回数", "12"],
      ["週間成長", "+12%"],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `training-${type || "summary"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("データを書き出しました");
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const shareLink = `${window.location.origin}${window.location.pathname}#progress`;
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast("共有リンクをコピーしました");
    } catch (error) {
      showToast("コピーに失敗しました");
    }
  });
});
