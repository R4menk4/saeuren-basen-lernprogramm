'use strict';
(() => {
  const status = document.getElementById('storage-status');
  let storage;
  try {
    storage = window.localStorage;
    const probe = 'saeuren-basen-kontext-ph-poh-probe';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    status.textContent = 'Deine Notizen werden nur in diesem Browser gespeichert. Vergleiche deine Antworten selbst mit den Musterlösungen; Freitext wird nicht automatisch bewertet.';
  } catch {
    status.textContent = 'Lokales Speichern ist hier nicht möglich. Deine Notizen bleiben nur bis zum Verlassen der Seite erhalten. Die Lösungen kannst du trotzdem öffnen.';
  }
  document.querySelectorAll('[data-note]').forEach(field => {
    const key = 'saeuren-basen-kontext-ph-poh-v1-' + field.dataset.note;
    try { field.value = storage?.getItem(key) || ''; } catch { /* Notes remain editable. */ }
    field.addEventListener('input', () => {
      try { storage?.setItem(key, field.value); }
      catch { status.textContent = 'Deine letzte Änderung konnte nicht gespeichert werden. Übertrage wichtige Notizen ins Heft, bevor du die Seite verlässt.'; }
    });
  });
})();
