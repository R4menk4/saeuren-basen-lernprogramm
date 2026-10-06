(() => {
  'use strict';
  const number = raw => {
    const value = raw.trim().replace(',', '.');
    return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value) ? Number(value) : NaN;
  };
  const decimal = n => n.toFixed(2).replace('.', ',');
  const scientific = n => {
    const [a, b] = n.toExponential(1).split('e');
    return `${a.replace('.', ',')} · 10<sup>${Number(b)}</sup>`;
  };
  document.getElementById('calculator').addEventListener('submit', event => {
    event.preventDefault();
    const mode = document.getElementById('given').value;
    const n = number(document.getElementById('value').value);
    const output = document.getElementById('result');
    const concentration = mode === 'h' || mode === 'oh';
    if (!Number.isFinite(n) || (concentration ? n < 1e-14 || n > 1 : n < 0 || n > 14)) {
      output.textContent = concentration ? 'Gib eine Ionenkonzentration zwischen 1e-14 und 1 mol/L ein, z. B. 2,8e-4.' : 'Gib einen pH- oder pOH-Wert zwischen 0 und 14 ein.';
      output.className = 'feedback retry';
      return;
    }
    let ph, first;
    if (mode === 'h') { ph = -Math.log10(n); first = `pH = −lg(${n.toExponential().replace('.', ',')}) ≈ ${decimal(ph)}; pOH = 14 − pH.`; }
    if (mode === 'oh') { ph = 14 + Math.log10(n); first = `pOH = −lg(${n.toExponential().replace('.', ',')}) ≈ ${decimal(14-ph)}; pH = 14 − pOH.`; }
    if (mode === 'ph') { ph = n; first = `pOH = 14 − ${decimal(n)} = ${decimal(14-n)}.`; }
    if (mode === 'poh') { ph = 14-n; first = `pH = 14 − ${decimal(n)} = ${decimal(ph)}.`; }
    const poh = 14-ph;
    const state = Math.abs(ph-7) < 1e-12 ? 'neutral' : ph < 7 ? 'sauer' : 'basisch';
    output.className = 'result-box';
    output.innerHTML = `<h3>Dein Rechenweg</h3><p>${first}</p><p><strong>pH ≈ ${decimal(ph)} · pOH ≈ ${decimal(poh)}</strong></p><p>c(H₃O⁺) = 10<sup>−pH</sup> mol/L ≈ ${scientific(10**-ph)} mol/L<br>c(OH⁻) = 10<sup>−pOH</sup> mol/L ≈ ${scientific(10**-poh)} mol/L</p><p>Die Lösung ist bei 25 °C <strong>${state}</strong>. Die Einordnung und Berechnungen verwenden die ungerundeten Werte.</p>`;
  });
  const tasks = [
    ['Berechne den pH-Wert für c(H₃O⁺) = 2,8 · 10⁻⁴ mol/L.', 'pH', -Math.log10(2.8e-4), 'pH = −lg(2,8 · 10⁻⁴) ≈ <strong>3,55</strong>. Die Lösung ist sauer.', 'Verwende den negativen Zehnerlogarithmus der Oxonium-Ionen-Konzentration.'],
    ['Berechne den pOH-Wert für c(OH⁻) = 4,2 · 10⁻³ mol/L.', 'pOH', -Math.log10(4.2e-3), 'pOH = −lg(4,2 · 10⁻³) ≈ <strong>2,38</strong>.', 'Die Hydroxid-Ionen-Konzentration liefert zunächst den pOH-Wert.'],
    ['Berechne den pH-Wert für c(OH⁻) = 4,2 · 10⁻³ mol/L.', 'pH', 14+Math.log10(4.2e-3), 'pOH = −lg(4,2 · 10⁻³) ≈ 2,38; pH = 14 − pOH ≈ <strong>11,62</strong>. Die Lösung ist basisch.', 'Berechne erst pOH und ziehe diesen Wert von 14 ab.'],
    ['Eine Probe hat pH = 4,35. Berechne c(H₃O⁺).', 'mol/L', 10**-4.35, 'c(H₃O⁺) = 10<sup>−4,35</sup> mol/L ≈ <strong>4,5 · 10⁻⁵ mol/L</strong>.', 'Verwende 10 hoch minus pH. Achte auf das Vorzeichen im Exponenten.'],
    ['Eine Probe hat pOH = 3,40. Berechne c(OH⁻).', 'mol/L', 10**-3.4, 'c(OH⁻) = 10<sup>−3,40</sup> mol/L ≈ <strong>4,0 · 10⁻⁴ mol/L</strong>.', 'Verwende 10 hoch minus pOH und gib die Konzentration in mol/L ein.'],
    ['Eine Probe hat pH = 9,20. Berechne ihren pOH-Wert.', 'pOH', 4.8, 'pOH = 14 − 9,20 = <strong>4,80</strong>. Die Probe ist basisch, auch wenn ihr pOH-Wert kleiner als 7 ist.', 'Bei 25 °C addieren sich pH und pOH zu 14.'],
    ['Eine Probe hat pOH = 8,60. Berechne c(H₃O⁺).', 'mol/L', 10**-5.4, 'Zuerst pH = 14 − 8,60 = 5,40. Dann c(H₃O⁺) = 10<sup>−5,40</sup> mol/L ≈ <strong>4,0 · 10⁻⁶ mol/L</strong>.', 'Gesucht sind Oxonium-Ionen. Berechne deshalb zuerst den pH-Wert.'],
    ['Probe A hat pH = 3,20, Probe B pH = 5,70. Berechne den Faktor c(H₃O⁺) in A / c(H₃O⁺) in B. Runde auf eine ganze Zahl.', 'Faktor', 316, 'c(A) / c(B) = 10<sup>−3,20</sup> / 10<sup>−5,70</sup> = 10<sup>2,50</sup> ≈ <strong>316</strong>. A hat die größere Oxonium-Ionen-Konzentration. Die pH-Differenz ist ein Exponent, kein Konzentrationsfaktor.', 'Bilde das Verhältnis der Konzentrationen oder berechne 10 hoch (pH von B minus pH von A).']
  ];
  const key = 'saeuren-basen-ph-poh-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { storageUnavailable(); }
  function storageUnavailable() { document.getElementById('storage-status').textContent = 'Speichern ist gerade nicht möglich. Du kannst alle Übungen trotzdem bearbeiten.'; }
  function save() { try { localStorage.setItem(key, JSON.stringify(saved)); } catch { storageUnavailable(); } }
  const container = document.getElementById('exercises');
  function updateProgress() { document.getElementById('progress').textContent = `${container.querySelectorAll('[data-correct="true"]').length} / 8 Aufgaben richtig gelöst`; }
  tasks.forEach(([question, unit, expected, solution, hint], index) => {
    const id = index + 1;
    const article = document.createElement('article');
    article.className = 'task';
    article.innerHTML = `<h3>Aufgabe ${id}</h3><p>${question}</p><label for="notes-${id}">Dein Rechenweg</label><textarea id="notes-${id}" placeholder="Notiere hier deinen Ansatz und deine Rechenschritte."></textarea><form><div class="answer-row"><label for="answer-${id}">Dein Ergebnis (${unit})</label><input id="answer-${id}" type="text" autocomplete="off" required></div><button type="submit">Ergebnis prüfen</button><p class="feedback" role="status"></p></form><details class="locked"><summary aria-disabled="true">Musterlösung – gib zuerst deinen Rechenweg oder dein Ergebnis ein</summary><div class="solution"><p>${solution}</p></div></details>`;
    container.append(article);
    const input = article.querySelector('input'), notes = article.querySelector('textarea'), feedback = article.querySelector('.feedback'), detail = article.querySelector('details'), summary = detail.querySelector('summary');
    input.value = typeof saved[id]?.answer === 'string' ? saved[id].answer : '';
    notes.value = typeof saved[id]?.notes === 'string' ? saved[id].notes : '';
    const correct = () => {
      const value = number(input.value);
      const tolerance = unit === 'mol/L' ? expected * .015 : unit === 'Faktor' ? .5 : .0051;
      return Number.isFinite(value) && Math.abs(value-expected) <= tolerance;
    };
    function unlock() {
      const locked = !input.value.trim() && !notes.value.trim();
      detail.classList.toggle('locked', locked);
      summary.setAttribute('aria-disabled', String(locked));
      summary.textContent = locked ? 'Musterlösung – gib zuerst deinen Rechenweg oder dein Ergebnis ein' : 'Musterlösung aufklappen';
      if (locked) detail.open = false;
    }
    function persist() { saved[id] = {answer:input.value, notes:notes.value, checked:article.dataset.correct === 'true'}; save(); }
    input.addEventListener('input', () => { article.dataset.correct = 'false'; feedback.textContent = ''; unlock(); updateProgress(); persist(); });
    notes.addEventListener('input', () => { unlock(); persist(); });
    summary.addEventListener('click', e => { if (!input.value.trim() && !notes.value.trim()) { e.preventDefault(); notes.focus(); } });
    article.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const ok = correct();
      article.dataset.correct = String(ok);
      feedback.className = `feedback ${ok ? 'correct' : 'retry'}`;
      feedback.textContent = ok ? 'Richtig gerechnet. Vergleiche auch deinen Rechenweg mit der Musterlösung.' : !Number.isFinite(number(input.value)) ? 'Gib einen gültigen Zahlenwert ein, z. B. 3,55 oder 4,5e-5.' : `Noch nicht richtig. ${hint}`;
      updateProgress(); persist();
    });
    if (saved[id]?.checked && correct()) { article.dataset.correct = 'true'; feedback.textContent = 'Bereits richtig gelöst.'; feedback.classList.add('correct'); }
    unlock();
  });
  updateProgress();
})();
