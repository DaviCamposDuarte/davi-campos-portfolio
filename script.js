const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(
  ".about-grid, .about-note, .section-heading-row, .project-card, .skills-grid, .contact-inner"
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const titleLineOne = document.querySelector("#title-line-one");
  const titleLineTwo = document.querySelector("#title-line-two");
  const titleWord = document.querySelector("#title-word");
  const heroTitle = document.querySelector("#hero-title");

  const prepareTyping = (element, text) => {
    const fragment = document.createDocumentFragment();
    const targets = [];

    for (const part of text.match(/\s+|\S+/g) ?? []) {
      if (/^\s+$/.test(part)) {
        const space = document.createTextNode(part);
        fragment.append(space);
        targets.push({ node: space, isSpace: true });
        continue;
      }

      const word = document.createElement("span");
      word.className = "typing-word";
      word.setAttribute("aria-hidden", "true");
      for (const character of part) {
        const letter = document.createElement("span");
        letter.className = "typing-char";
        letter.textContent = character;
        word.append(letter);
        targets.push({ node: letter, isSpace: false });
      }
      fragment.append(word);
    }

    element.replaceChildren(fragment);
    return targets;
  };

  const typingCaret = document.createElement("span");
  typingCaret.className = "typing-caret";
  typingCaret.setAttribute("aria-hidden", "true");

  const typeText = async (element, targets) => {
    if (targets.length) targets[0].node.parentNode.insertBefore(typingCaret, targets[0].node);

    for (const target of targets) {
      if (!target.isSpace) target.node.classList.add("is-visible");
      if (target.node.nodeType === Node.TEXT_NODE) {
        target.node.parentNode.insertBefore(typingCaret, target.node.nextSibling);
      } else {
        target.node.after(typingCaret);
      }
      await new Promise((resolve) => window.setTimeout(resolve, target.isSpace ? 115 : 42));
    }
  };

  const titleLineOneTargets = prepareTyping(titleLineOne, "Ideias ganham vida");
  const titleLineTwoTargets = prepareTyping(titleLineTwo, "quando a gente ");
  const titleWordTargets = prepareTyping(titleWord, "cria.");

  window.setTimeout(async () => {
    await typeText(titleLineOne, titleLineOneTargets);
    await typeText(titleLineTwo, titleLineTwoTargets);
    await typeText(titleWord, titleWordTargets);
    heroTitle.classList.add("typing-done");
    titleWord.classList.add("is-typed");
  }, 350);

  const portraitFrame = document.querySelector(".portrait-frame");

  portraitFrame.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = portraitFrame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitFrame.style.setProperty("--portrait-tilt-x", `${-y * 8}deg`);
    portraitFrame.style.setProperty("--portrait-tilt-y", `${x * 10}deg`);
  });

  portraitFrame.addEventListener("pointerleave", () => {
    portraitFrame.style.setProperty("--portrait-tilt-x", "0deg");
    portraitFrame.style.setProperty("--portrait-tilt-y", "0deg");
  });

}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0.35, transform: "translateY(22px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}
