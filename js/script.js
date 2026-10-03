(() => {
  "use strict";

  const deck = document.querySelector(".deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const previousButton = document.getElementById("previous-slide");
  const nextButton = document.getElementById("next-slide");
  const counter = document.getElementById("slide-counter");
  const announcement = document.getElementById("slide-announcement");
  const progressButtons = Array.from(document.querySelectorAll(".progress-step"));

  if (!deck || slides.length === 0 || !previousButton || !nextButton) return;

  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let touchStartX = null;
  let touchStartY = null;

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  function showSlide(targetIndex, direction = "forward") {
    const nextIndex = Math.min(Math.max(targetIndex, 0), slides.length - 1);
    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;
    deck.dataset.direction = direction;

    slides.forEach((slide, index) => {
      const isCurrent = index === activeIndex;
      slide.classList.toggle("is-active", isCurrent);
      slide.setAttribute("aria-hidden", String(!isCurrent));
      if ("inert" in slide) slide.inert = !isCurrent;
    });

    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;

    const currentTitle = slides[activeIndex].dataset.title || `Diapositiva ${activeIndex + 1}`;
    if (counter) {
      counter.innerHTML = `<strong>${formatNumber(activeIndex + 1)}</strong><span>/</span>${formatNumber(slides.length)}`;
    }
    if (announcement) {
      announcement.textContent = `Diapositiva ${activeIndex + 1} de ${slides.length}: ${currentTitle}`;
    }

    progressButtons.forEach((button, index) => {
      const isCurrent = index === activeIndex;
      button.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    document.title = `${currentTitle} · Storytelling para perfiles técnicos de Ingeniería`;
  }

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1, "backward"));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1, "forward"));

  progressButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showSlide(index, index < activeIndex ? "backward" : "forward");
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target instanceof Element ? event.target : null;
    const isTyping = target?.closest("input, textarea, select, [contenteditable='true'], [role='textbox']");
    const isLink = target?.closest("a");
    const isButton = target?.closest("button");
    const isSpace = event.key === " " || event.code === "Space";
    if (isTyping || isLink || (isButton && isSpace)) return;

    if (event.key === "ArrowRight" || event.key === "PageDown" || isSpace) {
      event.preventDefault();
      showSlide(activeIndex + 1, "forward");
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      showSlide(activeIndex - 1, "backward");
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0, "backward");
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1, "forward");
    }
  });

  deck.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
  }, { passive: true });

  deck.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || touchStartX === null || touchStartY === null) return;
    const deltaX = event.clientX - touchStartX;
    const deltaY = event.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    showSlide(activeIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? "forward" : "backward");
  }, { passive: true });

  showSlide(activeIndex);
})();
