const form = document.querySelector(".checkin-form");
const statusButtons = document.querySelectorAll(".primary");
const scrollButtons = document.querySelectorAll("[data-scroll]");

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
