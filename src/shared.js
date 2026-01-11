/*
 * ============================================
 * KHOR ZE YI PORTFOLIO - SHARED JAVASCRIPT
 * ============================================
 * This file contains all shared JavaScript functionality
 * used across all pages of the portfolio.
 * ============================================
 */

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyToClipboard(event, text) {
  event.preventDefault();
  event.stopPropagation();

  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = "Copied!";
    btn.classList.add("copied");

    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-link");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      navToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
}

// ============================================
// CARD MOUSE FOLLOW EFFECT
// ============================================
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", x + "%");
    card.style.setProperty("--mouse-y", y + "%");

    // Subtle tilt effect
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 30;
    const rotateY = (centerX - e.clientX) / 30;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Re-observe cards after initial animation
setTimeout(() => {
  cards.forEach((card) => {
    card.style.opacity = "";
    card.style.transform = "";
  });
}, 1500);

// ============================================
// IMAGE LOADING & PERFORMANCE
// ============================================
function handleImageLoad(img) {
  const slide = img.closest(".carousel-slide");
  if (slide) {
    if (img.complete) {
      slide.classList.add("loaded");
    } else {
      img.addEventListener("load", () => slide.classList.add("loaded"));
    }
  }
}

function preloadImages(urls, priority = 'low') {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    if (priority === 'high') {
      link.fetchPriority = 'high';
    }
    document.head.appendChild(link);
  });
}

// Improved preloading that doesn't block the main thread
function idlePreload(urls) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    });
  } else {
    setTimeout(() => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }, 2000);
  }
}

function initImageLoading() {
  document.querySelectorAll(".carousel-slide img").forEach(handleImageLoad);
}

// ============================================
// PROJECT CAROUSEL FUNCTIONALITY
// ============================================
const carousels = new Map();

function initCarousel(carouselElement) {
  if (!carouselElement) return;

  const track = carouselElement.querySelector(".carousel-track");
  const prevBtn = carouselElement.querySelector(".carousel-btn.prev");
  const nextBtn = carouselElement.querySelector(".carousel-btn.next");
  const indicators = carouselElement.querySelector(".carousel-indicators");
  const dots = indicators ? indicators.querySelectorAll(".carousel-dot") : [];
  const slides = track ? track.querySelectorAll(".carousel-slide") : [];
  const totalSlides = slides.length;
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  if (totalSlides === 0) return;

  function updateCarousel() {
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
    
    // Trigger event for lightbox sync if active
    const event = new CustomEvent('carouselSlide', { detail: { index: currentIndex, carouselId: carouselElement.id } });
    window.dispatchEvent(event);
  }

  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Button event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  // Indicator dot event listeners
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(dot.getAttribute("data-index"));
      goToSlide(index);
    });
  });

  // Touch/Swipe support
  if (track) {
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard navigation
  carouselElement.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  carouselElement.setAttribute("tabindex", "0");

  const api = { goToSlide, nextSlide, prevSlide, getCurrentIndex: () => currentIndex, totalSlides };
  if (carouselElement.id) carousels.set(carouselElement.id, api);
  return api;
}

// ============================================
// IMAGE LIGHTBOX LOGIC
// ============================================
function initLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  if (!lightbox) return;

  const lightboxImg = document.getElementById("lightboxImage");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");
  const indicators = lightbox.querySelector(".lightbox-indicators");
  const tabsContainer = document.getElementById("lightboxTabsContainer");
  
  let currentCarouselId = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function openLightbox(carouselId, index) {
    currentCarouselId = carouselId;
    const carouselApi = carousels.get(carouselId);
    if (!carouselApi) return;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scroll

    // Handle Hookflow Tabs
    if (carouselId === "projectCarouselHookflow") {
      const originalTabs = document.getElementById("hookflowTabs");
      if (originalTabs) {
        tabsContainer.innerHTML = "";
        const clonedTabs = originalTabs.cloneNode(true);
        clonedTabs.id = "lightboxHookflowTabs";
        tabsContainer.appendChild(clonedTabs);
        tabsContainer.style.display = "flex";
        
        // Setup cloned tabs logic
        initHookFlowTabs("lightboxHookflowTabs", true);
      }
    } else {
      tabsContainer.style.display = "none";
    }

    updateLightbox(index);
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    tabsContainer.innerHTML = "";
    currentCarouselId = null;
  }

  function updateLightbox(index) {
    const originalCarousel = document.getElementById(currentCarouselId);
    const slides = originalCarousel.querySelectorAll(".carousel-slide img");
    const carouselApi = carousels.get(currentCarouselId);
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Sync original carousel
    carouselApi.goToSlide(index);

    // Update Lightbox UI
    const activeImg = slides[index];
    lightboxImg.style.opacity = "0";
    
    // Add loading indicator to lightbox container
    const container = lightbox.querySelector(".lightbox-image-container");
    container.style.background = "rgba(255, 255, 255, 0.05)";
    
    lightboxImg.onload = () => {
      lightboxImg.style.opacity = "1";
      container.style.background = "transparent";
    };

    setTimeout(() => {
      lightboxImg.src = activeImg.src;
      lightboxImg.alt = activeImg.alt;
      // If cached, trigger onload manually
      if (lightboxImg.complete) lightboxImg.onload();
    }, 50);

    // Update Indicators
    indicators.innerHTML = "";
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${i === index ? "active" : ""}`;
      dot.addEventListener("click", () => updateLightbox(i));
      indicators.appendChild(dot);
    }

    // Preload next image in lightbox
    const nextIdx = (index + 1) % slides.length;
    const nextImg = new Image();
    nextImg.src = slides[nextIdx].src;
  }

  // Click on carousel images to open
  document.querySelectorAll(".carousel-slide img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      const carousel = e.target.closest(".project-carousel");
      const slides = Array.from(carousel.querySelectorAll(".carousel-slide img"));
      const index = slides.indexOf(e.target);
      if (carousel.id) openLightbox(carousel.id, index);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector(".lightbox-image-container")) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const api = carousels.get(currentCarouselId);
    updateLightbox(api.getCurrentIndex() - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const api = carousels.get(currentCarouselId);
    updateLightbox(api.getCurrentIndex() + 1);
  });

  // Swipe support for Lighbox
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      const api = carousels.get(currentCarouselId);
      if (diff > 0) updateLightbox(api.getCurrentIndex() + 1);
      else updateLightbox(api.getCurrentIndex() - 1);
    }
  }, { passive: true });

  // Sync with OS tab changes in background
  window.addEventListener('hookflowOsChanged', (e) => {
    if (currentCarouselId === "projectCarouselHookflow") {
      const api = carousels.get(currentCarouselId);
      updateLightbox(api.getCurrentIndex());
    }
  });
}

// ============================================
// HOOKFLOW PROJECT TABS
// ============================================
function initHookFlowTabs(containerId = "hookflowTabs", isLightbox = false) {
  const tabsContainer = document.getElementById(containerId);
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll(".tab");
  const slider = tabsContainer.querySelector(".tab-slider");
  const carousel = document.getElementById("projectCarouselHookflow");
  const images = carousel.querySelectorAll(".hookflow-img");

  const iosImages = [
    "/src/assets/ios-1.png",
    "/src/assets/ios-2.png",
    "/src/assets/ios-3.png",
    "/src/assets/ios-4.png",
    "/src/assets/ios-5.png",
  ];

  const androidImages = [
    "/src/assets/android-1.jpg",
    "/src/assets/android-2.jpg",
    "/src/assets/android-3.jpg",
    "/src/assets/android-4.jpg",
    "/src/assets/android-5.jpg",
  ];

  function updateSlider(activeTab) {
    slider.style.width = `${activeTab.offsetWidth}px`;
    slider.style.left = `${activeTab.offsetLeft}px`;
  }

  // Initialize
  const activeTab = tabsContainer.querySelector(".tab.active");
  if (activeTab) {
    setTimeout(() => updateSlider(activeTab), 100);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const os = tab.getAttribute("data-os");
      
      // Update ALL tab instances (main and lightbox)
      document.querySelectorAll(`#hookflowTabs, #lightboxHookflowTabs`).forEach(container => {
        const targetTab = container.querySelector(`[data-os="${os}"]`);
        const targetSlider = container.querySelector(".tab-slider");
        container.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        targetTab.classList.add("active");
        targetSlider.style.width = `${targetTab.offsetWidth}px`;
        targetSlider.style.left = `${targetTab.offsetLeft}px`;
      });

      // Update Images
      const selectedSource = os === "ios" ? iosImages : androidImages;
      images.forEach((img, index) => {
        const slide = img.closest(".carousel-slide");
        if (slide) slide.classList.remove("loaded");
        
        img.style.opacity = "0";
        setTimeout(() => {
          img.src = selectedSource[index];
          img.alt = `HookFlow ${os.toUpperCase()} - Image ${index + 1}`;
          // Re-trigger load detection
          if (img.complete) {
            if (slide) slide.classList.add("loaded");
          } else {
            img.onload = () => { if (slide) slide.classList.add("loaded"); };
          }
          img.style.opacity = "1";
        }, 300);
      });

      // Notify lightbox
      window.dispatchEvent(new CustomEvent('hookflowOsChanged', { detail: { os } }));
    });
  });

  window.addEventListener("resize", () => {
    const currentActive = tabsContainer.querySelector(".tab.active");
    if (currentActive) updateSlider(currentActive);
  });
}

// Global Init
document.addEventListener("DOMContentLoaded", () => {
  // Initialize image load states
  initImageLoading();
  
  // Initialize all carousels
  document.querySelectorAll(".project-carousel").forEach(initCarousel);
  
  // Initialize specific project features
  initHookFlowTabs();
  initLightbox();
  
  // Preload Android images if currently showing iOS (or vice versa)
  const androidImages = [
    "/src/assets/android-1.jpg",
    "/src/assets/android-2.jpg",
    "/src/assets/android-3.jpg",
    "/src/assets/android-4.jpg",
    "/src/assets/android-5.jpg",
  ];
  const faceImages = [
    "/src/assets/face2.webp",
    "/src/assets/face3.webp",
    "/src/assets/face4.webp",
    "/src/assets/face5.webp",
    "/src/assets/face6.webp",
  ];
  
  idlePreload([...androidImages, ...faceImages]);

  document.body.style.opacity = "1";
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const mainNav = document.querySelector(".main-nav");

if (mainNav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      mainNav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      mainNav.style.boxShadow = "none";
    }
  });
}
