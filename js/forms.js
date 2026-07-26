(function () {
  const page = document.querySelector('.forms-page');
  if (!page) return;

  const dialogs = document.querySelectorAll('.form-modal');
  const openers = document.querySelectorAll('[data-open-modal]');

  const openModal = (id) => {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
    document.body.classList.add('modal-open');
    const firstField = dialog.querySelector('input, select, textarea, button');
    if (firstField) firstField.focus();
  };

  const closeModal = (dialog) => {
    dialog.close();
    if (!document.querySelector('.form-modal[open]')) {
      document.body.classList.remove('modal-open');
    }
  };

  openers.forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.dataset.openModal);
    });
  });

  dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeModal(dialog);
    });

    dialog.querySelectorAll('[data-close-modal]').forEach((button) => {
      button.addEventListener('click', () => closeModal(dialog));
    });

    dialog.addEventListener('cancel', () => {
      document.body.classList.remove('modal-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openDialog = document.querySelector('.form-modal[open]');
    if (openDialog) closeModal(openDialog);
  });

  const hash = window.location.hash.replace('#', '');
  if (hash === 'drop-request' || hash === 'trial-class') {
    openModal(`${hash}-modal`);
  }

  const setToday = (input) => {
    if (!input) return;
    input.value = new Date().toISOString().split('T')[0];
  };

  setToday(document.getElementById('drop-date'));
  setToday(document.getElementById('trial-date'));

  const handleDemoSubmit = (form, statusId, successMessage) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const status = document.getElementById(statusId);
      const email = form.querySelector('[data-email]');
      const confirm = form.querySelector('[data-email-confirm]');

      if (email && confirm && email.value !== confirm.value) {
        if (status) {
          status.textContent = 'Email addresses do not match. Please check and try again.';
          status.hidden = false;
          status.classList.add('form-status--error');
        }
        confirm.focus();
        return;
      }

      if (status) {
        status.textContent = successMessage;
        status.hidden = false;
        status.classList.remove('form-status--error');
      }

      form.reset();
      setToday(form.querySelector('input[type="date"]'));
    });
  };

  handleDemoSubmit(
    document.getElementById('drop-request-form'),
    'drop-form-status',
    'Drop request received (demo). In production this would be sent to the office. For immediate help, call 919-554-0606.'
  );

  handleDemoSubmit(
    document.getElementById('trial-class-form'),
    'trial-form-status',
    'Trial class request received (demo). Your date and time are not confirmed until the office emails you — usually by the next business day.'
  );
})();
