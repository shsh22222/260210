const form = document.querySelector(".checkin-form");
const statusButtons = document.querySelectorAll(".primary");
const scrollButtons = document.querySelectorAll("[data-scroll]");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");

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
