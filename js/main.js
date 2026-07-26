(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('.nav-dropdown-toggle').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const parent = button.closest('.nav-item--dropdown');
      if (!parent) return;

      const willOpen = !parent.classList.contains('is-open');

      document.querySelectorAll('.nav-item--dropdown.is-open').forEach((item) => {
        if (item !== parent) {
          item.classList.remove('is-open');
          const otherToggle = item.querySelector('.nav-dropdown-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        document.querySelectorAll('.nav-item--dropdown.is-open').forEach((item) => {
          item.classList.remove('is-open');
          const dropdownToggle = item.querySelector('.nav-dropdown-toggle');
          if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Thanks for your message! This demo form does not send email — call 919-554-0606 or email office@youngsgym.com.';
        status.hidden = false;
      }
      contactForm.reset();
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      const dropdown = link.closest('.nav-item--dropdown');
      if (dropdown) {
        dropdown.querySelector('.nav-dropdown-toggle')?.classList.add('active');
      }
    }
  });
})();
