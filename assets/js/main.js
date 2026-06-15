(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#site-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const themeToggle = document.querySelector(".theme-toggle");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const typedText = document.querySelector("#typed-text");

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`
    );
  };

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  setTheme(root.dataset.theme);

  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} navigation`);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.hash === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  if (typedText && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const roles = ["Electronics Engineer", "Robotics Hobbyist"];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    const typeRole = () => {
      const role = roles[roleIndex];

      if (deleting) {
        characterIndex -= 1;
      } else {
        characterIndex += 1;
      }

      typedText.textContent = role.slice(0, characterIndex);

      if (!deleting && characterIndex === role.length) {
        deleting = true;
        setTimeout(typeRole, 1600);
        return;
      }

      if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 350);
        return;
      }

      setTimeout(typeRole, deleting ? 45 : 85);
    };

    setTimeout(typeRole, 1500);
  }

  document.querySelector("#current-year").textContent = new Date().getFullYear();
})();
