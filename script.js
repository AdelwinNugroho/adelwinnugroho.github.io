// Initialize theme as early as possible to avoid FOUC
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initial);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        initial === "light" ? "#ffffff" : "#000000"
      );
    }
  } catch (_) {}
})();

// Prevent terminal content flash: pre-store original HTML and clear lines as soon as script runs
(function clearTerminalsEarly() {
  try {
    // target terminal wrappers; prefer inner .terminal-content if present
    const wrappers = document.querySelectorAll('.terminal-text');
    wrappers.forEach(wrapper => {
      const container = wrapper.querySelector('.terminal-content') || wrapper;
      Array.from(container.children).forEach(line => {
        if (!line.dataset.content) line.dataset.content = line.innerHTML;
        line.innerHTML = '';
        line.style.visibility = 'hidden';
      });
      try { container.style.opacity = '0'; } catch (e) {}
    });
  } catch (e) {}
})();

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const scrollToTopBtn = document.querySelector(".scroll-to-top");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  const terminalContents = document.querySelectorAll('.terminal-content');

  const projectDetails = [
    {
      title: "Office Network Design & Implementation",
      description:
        "Designing and implementing a secure and scalable network infrastructure for a new office.",
      details: [
        "Planned and deployed VLANs, firewalls, and wireless access points.",
        "Ensured redundancy and failover for critical systems.",
        "Documented network topology and provided training to staff.",
      ],
      images: [
        "https://placehold.co/800x400/1a1a1a/ffffff?text=Network+Design+1",
        "https://placehold.co/800x400/222/ffffff?text=Network+Design+2",
        "https://placehold.co/800x400/333/ffffff?text=Network+Design+3",
      ],
      moreLink: "https://example.com/network-design-report"
    },
    {
      title: "Web System Security Audit",
      description:
        "Conducted a comprehensive security audit on a web application, identifying vulnerabilities, and providing recommendations.",
      details: [
        "Performed penetration testing and vulnerability scanning.",
        "Reported findings and suggested mitigation strategies.",
        "Collaborated with developers to patch security issues.",
      ],
      images: [
        "https://placehold.co/800x400/111/ffffff?text=Security+Audit+1",
        "https://placehold.co/800x400/191919/ffffff?text=Security+Audit+2",
        "https://placehold.co/800x400/2a2a2a/ffffff?text=Security+Audit+3",
      ],
      moreLink: "https://example.com/security-audit-report"
    },
    {
      title: "Router Configuration Automation Script",
      description:
        "Developed Python scripts for automating the initial configuration of Cisco routers and switches.",
      details: [
        "Automated device configuration using Paramiko and Python.",
        "Reduced manual errors and deployment time.",
        "Supported scalable onboarding for new network devices.",
      ],
      images: [
        "https://placehold.co/800x400/0f0f0f/ffffff?text=Automation+Script+1",
        "https://placehold.co/800x400/1f1f1f/ffffff?text=Automation+Script+2",
        "https://placehold.co/800x400/2f2f2f/ffffff?text=Automation+Script+3",
      ],
      moreLink: "https://example.com/router-automation"
    },
  ];

  // Scroll effect on header and scroll-to-top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
      scrollToTopBtn.classList.add("visible");
    } else {
      header.classList.remove("scrolled");
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Toggle mobile menu
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Theme toggle logic
  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        theme === "light" ? "#ffffff" : "#000000"
      );
    }
    themeToggleButtons.forEach((btn) => {
      btn.innerHTML = theme === 'light'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  }

  // Initialize toggle icon
  setTheme(getCurrentTheme());

  // Simplified typing effect: types each child line's text content, preserving simple inline spans
  function typeLines(container, opts = {}) {
    if (!container || container.dataset.typed === 'true') return;
    container.dataset.typed = 'true';
    container.style.opacity = '1';

    const lines = Array.from(container.children);
    let idxLine = 0;

    function typeSingleLine(line, cb) {
      // preserve original HTML and start from empty
      const original = line.dataset.content || line.innerHTML;
      line.dataset.content = original;
      line.innerHTML = '';
      line.style.visibility = 'visible';
      line.classList.add('typing');
      // Build nodes to preserve simple spans
      const temp = document.createElement('div');
      temp.innerHTML = original;
      line.innerHTML = '';
      line.style.visibility = 'visible';

      const nodes = Array.from(temp.childNodes).map(n => {
        return {
          isText: n.nodeType === 3,
          text: n.textContent,
          className: n.nodeType === 1 ? n.className : ''
        };
      });

  let nodeIdx = 0;
      let charIdx = 0;

      function step() {
        if (nodeIdx >= nodes.length) {
          // done typing this line
          line.classList.remove('typing');
          return cb && cb();
        }
        const node = nodes[nodeIdx];
        if (!node._dom) {
          node._dom = node.isText ? document.createTextNode('') : document.createElement('span');
          if (!node.isText && node.className) node._dom.className = node.className;
          line.appendChild(node._dom);
        }
  if (charIdx < node.text.length) {
          const ch = node.text.charAt(charIdx);
          if (node.isText) node._dom.nodeValue += ch;
          else node._dom.textContent += ch;
          charIdx++;
          setTimeout(step, opts.charDelay || 20);
        } else {
          charIdx = 0;
          nodeIdx++;
          setTimeout(step, opts.nodeDelay || 40);
        }
      }

      step();
    }

    function next() {
      if (idxLine >= lines.length) return;
      const line = lines[idxLine++];
      typeSingleLine(line, () => {
        setTimeout(next, opts.lineDelay || 140);
      });
    }

    // start after a short pause
    setTimeout(next, opts.startDelay || 240);
  }

  // Initialize only hero and contact terminals (keep footer clean)
  {
    const selectors = ['#home .terminal-text', '#contact .terminal-text'];
    const wrappers = document.querySelectorAll(selectors.join(','));
    wrappers.forEach((wrapper, i) => {
      const container = wrapper.querySelector('.terminal-content') || wrapper;
      try { container.style.opacity = '0'; } catch (e) {}
      // stagger start slightly per wrapper
      setTimeout(() => typeLines(container, { charDelay: 18, nodeDelay: 28, lineDelay: 120, startDelay: 200 + i * 120 }), 50 + i * 80);
    });
  }

  themeToggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const next = getCurrentTheme() === "light" ? "dark" : "light";
      setTheme(next);
    });
  });

  // Smooth scroll for navigation links
  const navLinksElements = document.querySelectorAll(".nav-links a");
  navLinksElements.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link behavior
      const targetId = this.getAttribute("href"); // Get target ID from href attribute
      if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId); // Get the target element
        if (targetElement) {
          targetElement.scrollIntoView({
            // Scroll to target element smoothly
            behavior: "smooth",
          });
        }
      }
      navLinks.classList.remove("active"); // Close mobile menu after click
    });
  });

  // Intersection Observer for animating elements on scroll
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Margin for triggering
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // If element enters viewport, animate it
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll(
    ".skill-card, .project-card, .stat, .contact-item"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0"; // Set initial opacity to 0
    el.style.transform = "translateY(30px)"; // Set initial position slightly down
    el.style.transition = "all 0.6s ease"; // Add transition
    observer.observe(el); // Start observing the element
  });

  // Modal logic for project details
  const modal = document.getElementById("project-modal");
  const modalClose = modal.querySelector(".project-modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-description");
  const modalDetails = document.getElementById("modal-details");
  const carouselWrapper = document.getElementById("modal-carousel");
  const carouselImg = document.getElementById("modal-carousel-image");
  const indicators = document.getElementById("modal-carousel-indicators");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  let currentCarouselIndex = 0;
  let currentImages = [];

  function renderIndicators(count) {
    indicators.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === currentCarouselIndex ? " active" : "");
      dot.setAttribute("data-idx", i.toString());
      dot.style.cursor = "pointer";
      dot.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx")) || 0;
        showImage(idx);
      });
      indicators.appendChild(dot);
    }
  }

  function showImage(idx) {
    if (!currentImages || currentImages.length === 0) return;
    if (idx < 0) idx = currentImages.length - 1;
    if (idx >= currentImages.length) idx = 0;
    currentCarouselIndex = idx;
    const src = currentImages[currentCarouselIndex];
    carouselImg.src = src;
    carouselImg.alt = "Project preview " + (currentCarouselIndex + 1);
    Array.from(indicators.children).forEach((el, i) => {
      if (i === currentCarouselIndex) el.classList.add("active");
      else el.classList.remove("active");
    });
  }
  const detailBtns = document.querySelectorAll(".project-detail-btn");

  detailBtns.forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.style.marginTop = "12px";
    btn.addEventListener("click", function () {
      const idx = parseInt(this.getAttribute("data-project"));
      const proj = projectDetails[idx];
      if (proj) {
        modalTitle.textContent = proj.title;
        modalDesc.textContent = proj.description;
        modalDetails.innerHTML = "";
        proj.details.forEach((d) => {
          const li = document.createElement("li");
          li.textContent = d;
          modalDetails.appendChild(li);
        });
        // setup carousel
        currentImages = Array.isArray(proj.images) ? proj.images : [];
        currentCarouselIndex = 0;
        if (currentImages.length > 0) {
          if (carouselWrapper) carouselWrapper.style.display = "flex";
          renderIndicators(currentImages.length);
          showImage(0);
        } else {
          if (carouselWrapper) carouselWrapper.style.display = "none";
          indicators.innerHTML = "";
        }
        // inject More Details button for project if available
        const projActions = document.getElementById('project-modal-actions');
        if (projActions) {
          projActions.innerHTML = '';
          if (proj.moreLink) {
            const more = document.createElement('a');
            more.className = 'btn btn-primary';
            more.style.margin = '16px auto';
            more.href = proj.moreLink;
            more.target = '_blank';
            more.textContent = 'More Details';
            projActions.appendChild(more);
          }
        }

        modal.classList.add("show");
      }
    });
  });

  // Carousel controls
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      showImage(currentCarouselIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      showImage(currentCarouselIndex + 1);
    });
  }

  function closeModal() {
    modal.classList.remove("show");
    currentImages = [];
    currentCarouselIndex = 0;
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Achievement modal logic
  const achievementModal = document.getElementById("achievement-modal");
  const achievementModalClose = achievementModal.querySelector(
    ".achievement-modal-close"
  );
  const achievementModalTitle = document.getElementById(
    "achievement-modal-title"
  );
  const achievementModalDesc = document.getElementById(
    "achievement-modal-description"
  );
  const achievementModalDetails = document.getElementById(
    "achievement-modal-details"
  );
  const achievementBtns = document.querySelectorAll(".achievement-detail-btn");

  const achievementDetails = [
    {
      title: "CCNA Certification",
      description:
        "Successfully obtained the globally recognized Cisco Certified Network Associate (CCNA) certification.",
      details: [
        "Studied and mastered Cisco networking fundamentals.",
        "Passed the official CCNA exam.",
        "Demonstrated practical skills in routing, switching, and network troubleshooting.",
      ],
      images: [
        "https://placehold.co/800x400/880000/ffffff?text=CCNA+Cert+1",
        "https://placehold.co/800x400/990000/ffffff?text=CCNA+Cert+2",
      ],
      moreLink: "https://example.com/ccna-certificate"
    },
    {
      title: "MTCNA Certification",
      description:
        "Achieved Mikrotik Certified Network Associate (MTCNA) certification, validating foundational Mikrotik networking expertise.",
      details: [
        "Completed Mikrotik official training.",
        "Passed the MTCNA certification exam.",
        "Gained hands-on experience with Mikrotik RouterOS.",
      ],
      images: ["https://placehold.co/800x400/005588/ffffff?text=MTCNA+1"],
      moreLink: "https://example.com/mtcna-certificate"
    },
    {
      title:
        "Winner of Central Java Shopee Barokah Digital Marketing Competition",
      description:
        "Awarded as the winner of the Central Java Shopee Barokah Digital Marketing Competition, showcasing strong marketing skills.",
      details: [
        "Led a team to develop a successful digital marketing strategy.",
        "Outperformed other teams in campaign effectiveness.",
        "Recognized for creativity and execution.",
      ],
      images: ["https://placehold.co/800x400/004400/ffffff?text=Shopee+Winner"],
      moreLink: "https://example.com/shopee-award"
    },
    {
      title: "Network Monitoring System Innovation",
      description:
        "Developed a custom network monitoring system that improved anomaly detection efficiency by 20%.",
      details: [
        "Designed and implemented a real-time monitoring dashboard.",
        "Integrated alerting for unusual network activity.",
        "Improved detection efficiency by 20%.",
      ],
      images: ["https://placehold.co/800x400/222222/ffffff?text=Monitoring+1"],
      moreLink: "https://example.com/monitoring-system"
    },
  ];

  achievementBtns.forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.style.marginTop = "12px";
    btn.addEventListener("click", function () {
      const idx = parseInt(this.getAttribute("data-achievement"));
      const ach = achievementDetails[idx];
      if (ach) {
        achievementModalTitle.textContent = ach.title;
        achievementModalDesc.textContent = ach.description;
        achievementModalDetails.innerHTML = "";
        ach.details.forEach((d) => {
          const li = document.createElement("li");
          li.textContent = d;
          achievementModalDetails.appendChild(li);
        });
        // setup achievement carousel
        const achImgEl = document.getElementById('achievement-modal-carousel-image');
        const achIndicators = document.getElementById('achievement-modal-carousel-indicators');
        const achPrevBtn = document.querySelector('.achievement-carousel-prev');
        const achNextBtn = document.querySelector('.achievement-carousel-next');
        let achImgs = Array.isArray(ach.images) ? ach.images : [];
        let achIdx = 0;

        function renderAchDots(count) {
          if (!achIndicators) return;
          achIndicators.innerHTML = '';
          for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === achIdx ? ' active' : '');
            dot.setAttribute('data-idx', i.toString());
            dot.style.cursor = 'pointer';
            dot.addEventListener('click', function () {
              achIdx = parseInt(this.getAttribute('data-idx')) || 0;
              showAchImage(achIdx);
            });
            achIndicators.appendChild(dot);
          }
        }

        function showAchImage(i) {
          if (!achImgs || achImgs.length === 0) {
            if (achImgEl) { achImgEl.src = ''; achImgEl.alt = ''; }
            return;
          }
          if (i < 0) i = achImgs.length - 1;
          if (i >= achImgs.length) i = 0;
          achIdx = i;
          if (achImgEl) {
            achImgEl.src = achImgs[achIdx];
            achImgEl.alt = ach.title + ' preview ' + (achIdx + 1);
          }
          if (achIndicators) Array.from(achIndicators.children).forEach((el, idx) => {
            if (idx === achIdx) el.classList.add('active'); else el.classList.remove('active');
          });
        }

        if (achPrevBtn) achPrevBtn.onclick = () => showAchImage(achIdx - 1);
        if (achNextBtn) achNextBtn.onclick = () => showAchImage(achIdx + 1);

        renderAchDots(achImgs.length);
        showAchImage(0);

        // inject More Details button into modal actions
        const actions = document.getElementById('achievement-modal-actions');
        if (actions) {
          actions.innerHTML = '';
          if (ach.moreLink) {
            const more = document.createElement('a');
            more.className = 'btn btn-primary';
            more.style.textAlign = 'center';
            more.style.margin = '16px auto';
            more.href = ach.moreLink;
            more.target = '_blank';
            more.textContent = 'More Details';
            actions.appendChild(more);
          }
        }

        achievementModal.classList.add("show");
      }
    });
  });

  function closeAchievementModal() {
    achievementModal.classList.remove("show");
  }

  if (achievementModalClose) {
    achievementModalClose.addEventListener("click", closeAchievementModal);
  }
  window.addEventListener("click", function (e) {
    if (e.target === achievementModal) {
      closeAchievementModal();
    }
  });
});

// Function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to create the Matrix effect in the background
function createMatrixEffect() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const matrixBg = document.querySelector(".matrix-bg");

  if (matrixBg) {
    matrixBg.appendChild(canvas);

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";

    // Function to adjust canvas size
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize(); // Call on initialization
    window.addEventListener("resize", resize); // Call when window size changes

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1); // Array for Y position of each column

    function draw() {
      // Create trail effect
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ff0000"; // Matrix text color (red)
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset the drop if it goes past the bottom and randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++; // Move the drop down
      }
    }

    setInterval(draw, 50); // Call draw function every 50ms
  }
}
// Call matrix effect after a slight delay to ensure DOM is ready
setTimeout(createMatrixEffect, 1000);
