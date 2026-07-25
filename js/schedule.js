(function () {
  const META_FIELDS = ['Days', 'Times', 'Gender', 'Ages', 'Openings', 'Session', 'Tuition'];
  const REGISTER_URL = 'https://app.jackrabbitclass.com/regv2.asp?id=360293';

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getCellValue(row, title) {
    const cell = row.querySelector(`td[data-title="${title}"]`);
    return cell ? cell.innerHTML.trim() : '';
  }

  function getCellText(row, title) {
    const cell = row.querySelector(`td[data-title="${title}"]`);
    return cell ? cell.textContent.trim() : '';
  }

  function buildAction(row) {
    const registerCell = row.querySelector('td[data-title="Register"]');
    if (!registerCell) {
      return `<a class="btn btn-register" href="${REGISTER_URL}" target="_blank" rel="noopener noreferrer">Register</a>`;
    }

    const link = registerCell.querySelector('a');
    if (link) {
      const label = link.textContent.trim() || 'Register';
      const href = link.getAttribute('href') || REGISTER_URL;
      const isWaitlist = /waitlist/i.test(label);
      const btnClass = isWaitlist ? 'btn btn-register btn-register--waitlist' : 'btn btn-register';
      return `<a class="${btnClass}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }

    return `<a class="btn btn-register" href="${REGISTER_URL}" target="_blank" rel="noopener noreferrer">Register</a>`;
  }

  function buildMetaItems(row) {
    return META_FIELDS.map((field) => {
      const value = getCellText(row, field);
      if (!value) return '';

      const openingsClass = field === 'Openings' && value === '0' ? ' live-class-meta-value--full' : '';
      const displayValue = field === 'Openings' && value === '0' ? '0 (Waitlist)' : value;
      const tuitionValue = field === 'Tuition' && value && !value.startsWith('$') ? `$${value}` : displayValue;

      return `
        <div class="live-class-meta-item">
          <dt>${field}</dt>
          <dd class="live-class-meta-value${openingsClass}">${field === 'Tuition' ? tuitionValue : displayValue}</dd>
        </div>
      `;
    }).join('');
  }

  function rowToCard(row) {
    const className = escapeHtml(getCellText(row, 'Class') || 'Class');
    const description = escapeHtml(getCellText(row, 'Description'));

    return `
      <article class="live-class-card">
        <header class="live-class-card-header">
          <h3>${className}</h3>
          ${buildAction(row)}
        </header>
        ${description ? `<p class="live-class-card-desc">${description}</p>` : ''}
        <dl class="live-class-card-meta">
          ${buildMetaItems(row)}
        </dl>
      </article>
    `;
  }

  function transformTable(table, container) {
    if (table.dataset.transformed === 'true') return;

    const rows = table.querySelectorAll('tbody tr');
    if (!rows.length) return;

    const grid = document.createElement('div');
    grid.className = 'live-class-grid';
    grid.innerHTML = Array.from(rows).map(rowToCard).join('');

    table.dataset.transformed = 'true';
    table.replaceWith(grid);

    const loading = container.querySelector('.openings-loading');
    if (loading) loading.remove();
  }

  function scanContainer(container) {
    const tables = container.querySelectorAll('table:not([data-transformed="true"])');
    tables.forEach((table) => transformTable(table, container));
  }

  function observeContainer(container) {
    const parent = container.parentElement;

    function scan() {
      if (parent) {
        parent.querySelectorAll(':scope > table:not([data-transformed="true"])').forEach((table) => {
          container.appendChild(table);
        });
      }

      scanContainer(container);
    }

    scan();

    const observer = new MutationObserver(scan);
    observer.observe(parent || container, { childList: true, subtree: true });
  }

  document.querySelectorAll('.openings-embed').forEach(observeContainer);
})();
