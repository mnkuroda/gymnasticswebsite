(function () {
  const REGISTER_URL = 'https://app.jackrabbitclass.com/regv2.asp?id=360293';

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTableHeaders(table) {
    const headerRow = table.querySelector('thead tr');
    if (!headerRow) return [];

    return Array.from(headerRow.querySelectorAll('th, td')).map((cell) =>
      cell.textContent.trim()
    );
  }

  function getField(row, table, field) {
    const cells = row.querySelectorAll('td');

    for (const cell of cells) {
      const title = cell.getAttribute('data-title') || '';
      if (title.toLowerCase() === field.toLowerCase()) {
        const value = cell.textContent.trim();
        if (value) return value;
      }
    }

    const headers = getTableHeaders(table);
    const index = headers.findIndex((header) => header.toLowerCase() === field.toLowerCase());
    if (index >= 0 && cells[index]) {
      return cells[index].textContent.trim();
    }

    return '';
  }

  function getClassName(row, table) {
    const className = getField(row, table, 'Class');
    if (className && className.toLowerCase() !== 'class') return className;

    const cells = row.querySelectorAll('td');
    if (cells[1]) {
      const fallback = cells[1].textContent.trim();
      if (fallback && fallback.toLowerCase() !== 'class') return fallback;
    }

    return 'Class offering';
  }

  function formatTuition(value) {
    if (!value) return '';
    return value.startsWith('$') ? value : `$${value}`;
  }

  function formatOpenings(value) {
    if (!value) return '';
    if (value === '0') {
      return '<span class="live-class-pill live-class-pill--waitlist">Waitlist</span>';
    }
    return `<span class="live-class-pill live-class-pill--open">${escapeHtml(value)} openings</span>`;
  }

  function buildAction(row) {
    const registerCell = row.querySelector('td[data-title="Register"]') || row.querySelector('td');
    if (!registerCell) {
      return `<a class="btn btn-register" href="${REGISTER_URL}" target="_blank" rel="noopener noreferrer">Register</a>`;
    }

    const link = registerCell.querySelector('a');
    if (link) {
      const label = link.textContent.trim() || 'Register';
      const href = link.getAttribute('href') || REGISTER_URL;
      const isWaitlist = /waitlist/i.test(label);
      const btnClass = isWaitlist ? 'btn btn-register btn-register--waitlist' : 'btn btn-register';
      return `<a class="${btnClass}" href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    }

    return `<a class="btn btn-register" href="${REGISTER_URL}" target="_blank" rel="noopener noreferrer">Register</a>`;
  }

  function buildQuickFacts(row, table) {
    const days = getField(row, table, 'Days');
    const times = getField(row, table, 'Times');
    const ages = getField(row, table, 'Ages');
    const gender = getField(row, table, 'Gender');
    const openings = getField(row, table, 'Openings');
    const tuition = formatTuition(getField(row, table, 'Tuition'));

    const items = [];

    if (days) items.push(`<span class="live-class-fact"><strong>Days</strong> ${escapeHtml(days)}</span>`);
    if (times) items.push(`<span class="live-class-fact"><strong>Times</strong> ${escapeHtml(times)}</span>`);
    if (ages) items.push(`<span class="live-class-fact"><strong>Ages</strong> ${escapeHtml(ages)}</span>`);
    if (gender) items.push(`<span class="live-class-fact"><strong>Gender</strong> ${escapeHtml(gender)}</span>`);
    if (openings) items.push(formatOpenings(openings));
    if (tuition) items.push(`<span class="live-class-fact live-class-fact--tuition"><strong>Tuition</strong> ${escapeHtml(tuition)}/mo</span>`);

    return items.join('');
  }

  function rowToCard(row, table) {
    const className = escapeHtml(getClassName(row, table));
    const description = escapeHtml(getField(row, table, 'Description'));
    const session = escapeHtml(getField(row, table, 'Session'));
    const quickFacts = buildQuickFacts(row, table);

    return `
      <article class="live-class-card">
        <div class="live-class-card-main">
          <div class="live-class-card-copy">
            <h3>${className}</h3>
            ${quickFacts ? `<div class="live-class-facts">${quickFacts}</div>` : ''}
          </div>
          <div class="live-class-card-action">
            ${buildAction(row)}
          </div>
        </div>
        ${description || session ? `
          <details class="live-class-details">
            <summary>Class details</summary>
            <div class="live-class-details-body">
              ${description ? `<p>${description}</p>` : ''}
              ${session ? `<p class="live-class-session"><strong>Session:</strong> ${session}</p>` : ''}
            </div>
          </details>
        ` : ''}
      </article>
    `;
  }

  function transformTable(table, container) {
    if (table.dataset.transformed === 'true') return;

    const rows = table.querySelectorAll('tbody tr');
    if (!rows.length) return;

    const grid = document.createElement('div');
    grid.className = 'live-class-grid';
    grid.innerHTML = Array.from(rows).map((row) => rowToCard(row, table)).join('');

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
