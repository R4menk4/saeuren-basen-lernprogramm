(() => {
  'use strict';
  const key = 'saeuren-basen-klausurentrainer-v1';
  const status = document.getElementById('storage-status');
  const fields = [...document.querySelectorAll('textarea, .check input')];
  const storageId = field => field.dataset.storageId || field.id;
  const blocks = [...document.querySelectorAll('.block')];
  const grid = document.querySelector('.block-grid');
  function showBlock(focus = false) {
    const active = blocks.find(block => '#' + block.id === location.hash);
    blocks.forEach(block => { block.hidden = block !== active; });
    grid.hidden = !!active;
    if (focus) {
      const target = active ? active.querySelector('h2') : grid.querySelector('a');
      target.tabIndex = -1;
      target.focus({preventScroll: true});
      if (!active) target.removeAttribute('tabindex');
      (active || grid).scrollIntoView({block: 'start'});
    }
  }
  window.addEventListener('hashchange', () => showBlock(true));
  showBlock();
  let available = true;
  document.getElementById('progress').hidden = false;
  status.textContent = 'Notizen und Selbstkontrollen werden nur in diesem Browser gespeichert.';
  function unavailable() {
    available = false;
    status.textContent = 'Speichern ist in diesem Browser gerade nicht möglich. Sichere deine Notizen vor dem Schließen selbst.';
    status.classList.add('storage-failed');
  }
  function progress() {
    const count = document.querySelectorAll('.check input:checked').length;
    document.getElementById('progress').textContent = `${count} / 18 Aufgaben selbst kontrolliert`;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    fields.forEach(field => {
      if (field.type === 'checkbox') field.checked = saved?.[storageId(field)] === true;
      else if (typeof saved?.[storageId(field)] === 'string') field.value = saved[storageId(field)];
    });
    localStorage.setItem(key, JSON.stringify(Object.fromEntries(fields.map(field => [storageId(field), field.type === 'checkbox' ? field.checked : field.value]))));
  } catch { unavailable(); }
  let pending;
  function save() {
    if (!available) return;
    try {
      localStorage.setItem(key, JSON.stringify(Object.fromEntries(fields.map(field => [storageId(field), field.type === 'checkbox' ? field.checked : field.value]))));
    } catch { unavailable(); }
  }
  fields.forEach(field => field.addEventListener('input', () => {
    progress();
    clearTimeout(pending);
    pending = setTimeout(save, 200);
  }));
  document.querySelectorAll('.task').forEach(task => {
    const field = task.querySelector('textarea');
    const detail = task.querySelector('details');
    const summary = detail.querySelector('summary');
    const label = summary.textContent;
    function unlock() {
      const locked = !field.value.trim();
      detail.classList.toggle('locked', locked);
      summary.setAttribute('aria-disabled', String(locked));
      summary.textContent = locked ? 'Musterlösung – schreibe zuerst deinen Lösungsweg' : label;
      if (locked) detail.open = false;
    }
    summary.addEventListener('click', event => {
      if (!field.value.trim()) { event.preventDefault(); field.focus(); }
    });
    detail.addEventListener('toggle', () => {
      if (!field.value.trim()) detail.open = false;
    });
    field.addEventListener('input', unlock);
    unlock();
  });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  const close = document.getElementById('close-solutions');
  close.hidden = false;
  close.addEventListener('click', () => document.querySelectorAll('.task details').forEach(detail => { detail.open = false; }));
  progress();
})();
