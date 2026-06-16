/**
 * Ambulance & Emergency Medical Services Provider
 * Unified JavaScript - main.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize standard modules
  initTheme();
  initRTL();
  initActiveNavLink();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initTestimonials();
  initTypewriter();
  initDispatchWidget();
  initPricingToggle();
  initFAQAccordion();
  initFormValidation();
  initDashboardClock();
  initBackToTop();
  initDashboardSidebar();
});

/* ==========================================================================
   1. THEME TOGGLE — dark/light, localStorage persist
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    updateThemeButton(themeToggle, 'dark');
  } else {
    document.body.classList.remove('dark');
    updateThemeButton(themeToggle, 'light');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton(themeToggle, isDark ? 'dark' : 'light');
  });
}

function updateThemeButton(btn, theme) {
  const icon = btn.querySelector('i');
  const text = btn.querySelector('.btn-label');
  if (theme === 'dark') {
    if (icon) icon.className = 'fa-solid fa-sun';
    if (text) text.textContent = 'Light';
  } else {
    if (icon) icon.className = 'fa-solid fa-moon';
    if (text) text.textContent = 'Dark';
  }
}

/* ==========================================================================
   2. RTL TOGGLE — dir="rtl", localStorage persist
   ========================================================================== */
function initRTL() {
  const rtlToggle = document.getElementById('rtl-toggle');
  if (!rtlToggle) return;

  const currentRTL = localStorage.getItem('rtl') === 'true';
  if (currentRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
    if (rtlToggle.querySelector('i')) rtlToggle.querySelector('i').className = 'fa-solid fa-globe';
    if (rtlToggle.querySelector('.btn-label')) rtlToggle.querySelector('.btn-label').textContent = 'LTR';
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    if (rtlToggle.querySelector('i')) rtlToggle.querySelector('i').className = 'fa-solid fa-globe';
    if (rtlToggle.querySelector('.btn-label')) rtlToggle.querySelector('.btn-label').textContent = 'RTL';
  }

  rtlToggle.addEventListener('click', () => {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const nextRTL = !isRTL;
    
    document.documentElement.setAttribute('dir', nextRTL ? 'rtl' : 'ltr');
    localStorage.setItem('rtl', nextRTL);
    
    const text = rtlToggle.querySelector('.btn-label');
    if (text) {
      text.textContent = nextRTL ? 'LTR' : 'RTL';
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAV LINK — detect current page by filename
   ========================================================================== */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length === 0) return;

  const path = window.location.pathname;
  let page = path.split('/').pop();
  if (page === '') page = 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. HAMBURGER MENU — mobile drawer open/close
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    hamburger.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Close menu on navigation click or clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* ==========================================================================
   5. ANIMATED COUNTERS — Intersection Observer trigger
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const speed = 100; // lower is faster
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count).toLocaleString() + suffix;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target.toLocaleString() + suffix;
      }
    };
    updateCount();
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   6. TESTIMONIAL SLIDER — prev/next + auto-advance (index.html)
   ========================================================================== */
function initTestimonials() {
  const slider = document.querySelector('.testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;

  // Create dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoAdvance();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoAdvance();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoAdvance();
    });
  }

  function startAutoAdvance() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoAdvance() {
    clearInterval(autoSlideInterval);
    startAutoAdvance();
  }

  startAutoAdvance();
}

/* ==========================================================================
   7. TYPEWRITER EFFECT — cycling text (home1.html)
   ========================================================================== */
function initTypewriter() {
  const target = document.querySelector('.typewriter-text');
  if (!target) return;

  const words = JSON.parse(target.getAttribute('data-words') || '[]');
  if (words.length === 0) return;

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 200;

  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      delay = 80;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      delay = 150;
    }

    if (!isDeleting && charIdx === currentWord.length) {
      delay = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 500; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 500);
}

/* ==========================================================================
   8. DISPATCH WIDGET — fake live updates every 4s (home1.html)
   ========================================================================== */
function initDispatchWidget() {
  const listContainer = document.querySelector('.dispatch-list');
  if (!listContainer) return;

  // Status mapping
  const statuses = [
    { label: 'Available', class: 'status-available', badgeClass: 'available' },
    { label: 'En Route', class: 'status-en-route', badgeClass: 'en-route' },
    { label: 'On Scene', class: 'status-on-scene', badgeClass: 'on-scene' },
    { label: 'Returning', class: 'status-returning', badgeClass: 'returning' }
  ];

  // Locations to rotate
  const locations = ['Adyar', 'T. Nagar', 'Velachery', 'Anna Nagar', 'Guindy', 'Mylapore', 'Tambaram', 'Nungambakkam'];

  function updateMockDispatch() {
    const items = listContainer.querySelectorAll('.dispatch-item');
    items.forEach(item => {
      // Pick a random status occasionally
      if (Math.random() > 0.4) {
        const randStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const locationText = item.querySelector('.dispatch-unit-loc');
        const statusBadge = item.querySelector('.status-badge');
        const etaText = item.querySelector('.dispatch-eta');
        
        // Remove previous status classes
        item.className = `dispatch-item ${randStatus.class}`;
        
        // Update badge text and color
        statusBadge.textContent = randStatus.label;
        statusBadge.className = `status-badge ${randStatus.badgeClass}`;
        
        // Update ETA
        if (randStatus.label === 'En Route') {
          etaText.textContent = `ETA ${Math.floor(Math.random() * 8) + 2} min`;
          locationText.textContent = `En Route to ${locations[Math.floor(Math.random() * locations.length)]}`;
        } else if (randStatus.label === 'On Scene') {
          etaText.textContent = 'Active Scene';
          locationText.textContent = `Responding in ${locations[Math.floor(Math.random() * locations.length)]}`;
        } else if (randStatus.label === 'Returning') {
          etaText.textContent = 'Returning';
          locationText.textContent = 'Headed back to base';
        } else {
          etaText.textContent = '--';
          locationText.textContent = 'Stationed Base';
        }
      }
    });
  }

  setInterval(updateMockDispatch, 4000);
}

/* ==========================================================================
   9. PRICING TOGGLE — monthly/yearly price switch (pricing.html)
   ========================================================================== */
function initPricingToggle() {
  const billingToggle = document.getElementById('billing-toggle');
  if (!billingToggle) return;

  const priceElements = document.querySelectorAll('.pricing-amount');

  billingToggle.addEventListener('change', () => {
    const isYearly = billingToggle.checked;
    
    priceElements.forEach(priceEl => {
      const monthlyVal = parseInt(priceEl.getAttribute('data-monthly'), 10);
      const yearlyVal = monthlyVal * 10; // 2 months free

      if (isYearly) {
        priceEl.innerHTML = `₹${yearlyVal.toLocaleString()}<span>/yr</span>`;
      } else {
        priceEl.innerHTML = `₹${monthlyVal.toLocaleString()}<span>/mo</span>`;
      }
    });
  });
}

/* ==========================================================================
   10. FAQ ACCORDION — open/close toggle (services.html, pricing.html)
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });

      // Toggle this item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

/* ==========================================================================
   11. SIGN UP VALIDATION — real-time field validation (signup.html)
   ========================================================================== */
function initFormValidation() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const fields = {
    fullname: {
      el: document.getElementById('fullname'),
      validate: (val) => val.trim().length >= 3,
      errorMsg: 'Full name must be at least 3 characters long.'
    },
    email: {
      el: document.getElementById('email'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      errorMsg: 'Please enter a valid email address.'
    },
    phone: {
      el: document.getElementById('phone'),
      validate: (val) => /^[6-9]\d{9}$/.test(val.trim()), // India 10 digit check
      errorMsg: 'Please enter a valid 10-digit Indian phone number.'
    },
    password: {
      el: document.getElementById('password'),
      validate: (val) => val.length >= 8,
      errorMsg: 'Password must be at least 8 characters long.'
    },
    confirmPassword: {
      el: document.getElementById('confirm-password'),
      validate: (val) => val === document.getElementById('password').value,
      errorMsg: 'Passwords do not match.'
    },
    terms: {
      el: document.getElementById('terms-checkbox'),
      validate: (_, el) => el.checked,
      errorMsg: 'You must agree to the Terms & Conditions.'
    }
  };

  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (!field.el) return;

    // Listeners for real-time checks
    const eventType = field.el.type === 'checkbox' ? 'change' : 'input';
    field.el.addEventListener(eventType, () => {
      validateField(field);
      
      // If password field changes, also re-validate confirm password
      if (key === 'password' && fields.confirmPassword.el.value !== '') {
        validateField(fields.confirmPassword);
      }

      // Password strength meter trigger
      if (key === 'password') {
        updatePasswordStrength(field.el.value);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    let formValid = true;
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (!validateField(field)) {
        formValid = false;
      }
    });

    if (!formValid) {
      e.preventDefault();
    }
  });

  function validateField(field) {
    const container = field.el.closest('.form-group');
    if (!container) return true;

    const value = field.el.type === 'checkbox' ? '' : field.el.value;
    const isValid = field.validate(value, field.el);

    if (isValid) {
      container.classList.remove('error');
      container.classList.add('success');
      return true;
    } else {
      container.classList.remove('success');
      container.classList.add('error');
      
      // Update error text if span exists
      let errorSpan = container.querySelector('.form-error-msg');
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'form-error-msg';
        container.appendChild(errorSpan);
      }
      errorSpan.textContent = field.errorMsg;
      return false;
    }
  }
}

/* ==========================================================================
   12. PASSWORD STRENGTH METER — dynamic strength bar (signup.html)
   ========================================================================== */
function updatePasswordStrength(password) {
  const strengthBar = document.getElementById('strength-bar');
  const strengthLabel = document.getElementById('strength-label');
  if (!strengthBar || !strengthLabel) return;

  if (password.length === 0) {
    strengthBar.className = 'strength-bar';
    strengthLabel.textContent = '';
    return;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    strengthBar.className = 'strength-bar weak';
    strengthLabel.textContent = 'Weak';
    strengthLabel.style.color = 'var(--primary)';
  } else if (score === 2 || score === 3) {
    strengthBar.className = 'strength-bar medium';
    strengthLabel.textContent = 'Medium';
    strengthLabel.style.color = '#f1c40f';
  } else {
    strengthBar.className = 'strength-bar strong';
    strengthLabel.textContent = 'Strong';
    strengthLabel.style.color = '#2ecc71';
  }
}

/* ==========================================================================
   13. DASHBOARD CLOCK — live HH:MM:SS update (dashboard.html)
   ========================================================================== */
function initDashboardClock() {
  const clockEl = document.getElementById('dashboard-clock');
  const dateEl = document.getElementById('dashboard-date');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    
    // Format Clock: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // conversion 0 to 12
    const hoursStr = String(hours).padStart(2, '0');
    
    clockEl.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    
    // Format Date: DD Month YYYY (e.g. 15 June 2026)
    if (dateEl) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   14. SCROLL ANIMATIONS — fade-in-up on Intersection Observer (all pages)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (elements.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   15. BACK TO TOP BUTTON — dynamically inject, show on scroll, smooth scroll
   ========================================================================== */
function initBackToTop() {
  // 1. Create the button element
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  
  // 2. Set the inner SVG progress circle and chevron icon
  backToTopBtn.innerHTML = `
    <svg class="progress-circle" width="100%" height="100%" viewBox="0 0 100 100">
      <circle class="progress-bg" cx="50" cy="50" r="45" fill="none" stroke-width="6"></circle>
      <circle class="progress-bar" cx="50" cy="50" r="45" fill="none" stroke-width="6" stroke-dasharray="283" stroke-dashoffset="283"></circle>
    </svg>
    <i class="fa-solid fa-chevron-up"></i>
  `;
  
  // 3. Append to body
  document.body.appendChild(backToTopBtn);

  const progressBar = backToTopBtn.querySelector('.progress-bar');
  const pathLength = 283;
  
  // 4. Update the scroll progress circle stroke-dashoffset
  const updateProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
      const progress = scrollTop / docHeight;
      const offset = pathLength - (progress * pathLength);
      progressBar.style.strokeDashoffset = offset;
    }
  };

  // 5. Toggle visibility based on scroll position (show after 300px)
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  // 6. Event listener for scroll
  window.addEventListener('scroll', () => {
    toggleVisibility();
    updateProgress();
  });

  // 7. Initial check in case page starts scrolled down
  toggleVisibility();
  updateProgress();

  // 8. Click event - smooth scroll to top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   16. DASHBOARD SIDEBAR DRAWER — slide-out sidebar toggle on mobile/tablet
   ========================================================================== */
function initDashboardSidebar() {
  const hamburger = document.getElementById('dashboard-hamburger-btn');
  const sidebar = document.getElementById('dashboard-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close-btn');

  if (!sidebar) return;

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

