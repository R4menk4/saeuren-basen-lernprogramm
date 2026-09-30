const STORAGE_KEY = "broensted-basen-lernprogramm-v2";
const stepPanels = [...document.querySelectorAll("[data-step-panel]")];
const navButtons = [...document.querySelectorAll("[data-step]")];
const completed = new Set();
let currentStep = 0;

const classificationRows = [
  { formula: "NH₃", charge: "0", pair: "ja", product: "NH₄⁺", base: "ja" },
  { formula: "H₂O", charge: "0", pair: "ja", product: "H₃O⁺", base: "ja" },
  { formula: "OH⁻", charge: "−1", pair: "ja", product: "H₂O", base: "ja" },
  { formula: "NH₄⁺", charge: "+1", pair: "nein", product: "–", base: "nein" },
  { formula: "CH₄", charge: "0", pair: "nein", product: "–", base: "nein" },
  { formula: "Cl⁻", charge: "−1", pair: "ja", product: "HCl", base: "ja" },
];

const practiceRows = [
  { formula: "CO₃²⁻", possible: "ja", product: "HCO₃⁻" },
  { formula: "HCO₃⁻", possible: "ja", product: "H₂CO₃" },
  { formula: "NH₃", possible: "ja", product: "NH₄⁺" },
  { formula: "NH₄⁺", possible: "nein", product: "–" },
  { formula: "H₂O", possible: "ja", product: "H₃O⁺" },
  { formula: "CH₄", possible: "nein", product: "–" },
];

function optionList(values) {
  return `<option value="">auswählen</option>${values.map(value => `<option>${value}</option>`).join("")}`;
}

function buildTables() {
  const chargeOptions = ["−1", "0", "+1"];
  const pairOptions = ["ja", "nein"];
  const products = ["H₂O", "H₃O⁺", "NH₄⁺", "HCl", "–"];
  const baseOptions = ["ja", "nein"];
  document.querySelector("#classification-table tbody").innerHTML = classificationRows.map((row, index) => `
    <tr>
      <th>${row.formula}</th>
      <td><select data-field="c-${index}-charge">${optionList(chargeOptions)}</select></td>
      <td><select data-field="c-${index}-pair">${optionList(pairOptions)}</select></td>
      <td><select data-field="c-${index}-product">${optionList(products)}</select></td>
      <td><select data-field="c-${index}-base">${optionList(baseOptions)}</select></td>
    </tr>`).join("");

  const practiceProducts = ["HCO₃⁻", "H₂CO₃", "NH₄⁺", "H₃O⁺", "–"];
  document.querySelector("#practice-table tbody").innerHTML = practiceRows.map((row, index) => `
    <tr>
      <th>${row.formula}</th>
      <td><select data-field="p-${index}-possible">${optionList(["ja", "nein"])}</select></td>
      <td><select data-field="p-${index}-product">${optionList(practiceProducts)}</select></td>
    </tr>`).join("");
}

function allInputs() {
  return [...document.querySelectorAll("input, textarea, select")];
}

function serialize() {
  const fields = {};
  allInputs().forEach((element, index) => {
    const key = element.id || element.dataset.field || `${element.name}-${index}`;
    if (element.type === "radio") {
      if (element.checked) fields[element.name] = element.value;
    } else {
      fields[key] = element.value;
    }
  });
  return { fields, currentStep, completed: [...completed] };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize()));
}

function restore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    allInputs().forEach((element, index) => {
      const key = element.id || element.dataset.field || `${element.name}-${index}`;
      if (element.type === "radio") element.checked = state.fields?.[element.name] === element.value;
      else if (state.fields?.[key] !== undefined) element.value = state.fields[key];
    });
    (state.completed || []).forEach(step => completed.add(Number(step)));
    currentStep = Math.min(Math.max(Number(state.currentStep) || 0, 0), stepPanels.length - 1);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showStep(index) {
  currentStep = Math.min(Math.max(index, 0), stepPanels.length - 1);
  stepPanels.forEach((panel, panelIndex) => { panel.hidden = panelIndex !== currentStep; });
  navButtons.forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === currentStep);
    button.classList.toggle("completed", completed.has(buttonIndex));
    button.setAttribute("aria-current", buttonIndex === currentStep ? "step" : "false");
  });
  document.querySelector("#previous-step").disabled = currentStep === 0;
  document.querySelector("#next-step").textContent = currentStep === stepPanels.length - 1 ? "Zum Anfang" : "Weiter";
  document.querySelector("#step-counter").textContent = `Lernschritt ${currentStep + 1} von ${stepPanels.length}`;
  updateProgress();
  save();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const count = completed.size;
  document.querySelector("#progress-text").textContent = `${count} von ${stepPanels.length}`;
  document.querySelector("#progress-bar").style.width = `${(count / stepPanels.length) * 100}%`;
}

function selected(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function setFeedback(step, ok, message) {
  const feedback = document.querySelector(`#feedback-${step}`);
  feedback.textContent = message;
  feedback.className = `feedback ${ok ? "success" : "error"}`;
  document.querySelector(`#solution-${step}`).hidden = false;
  if (ok) completed.add(Number(step.replace("step", "")) - 1);
  updateProgress();
  navButtons.forEach((button, index) => button.classList.toggle("completed", completed.has(index)));
  save();
}

function markSelect(select, correct) {
  select.closest("td")?.classList.remove("cell-correct", "cell-wrong");
  select.closest("td")?.classList.add(correct ? "cell-correct" : "cell-wrong");
}

function checkStep1() {
  const ok = selected("step1-base") === "nh3";
  setFeedback("step1", ok, ok ? "Richtig. Vergleiche nun deine Begründung mit der Selbstkontrolle." : "Prüfe, welches Edukt das Proton aufnimmt. Nutze anschließend die Selbstkontrolle.");
}

function checkStep2() {
  const checks = [
    [document.querySelector("#product-oh"), "H₂O"],
    [document.querySelector("#product-h2o"), "H₃O⁺"],
    [document.querySelector("#product-nh3"), "NH₄⁺"],
  ];
  checks.forEach(([select, answer]) => markSelect(select, select.value === answer));
  const ok = checks.every(([select, answer]) => select.value === answer) && selected("step2-common") === "pair";
  setFeedback("step2", ok, ok ? "Alle Zuordnungen stimmen." : "Mindestens eine Zuordnung stimmt noch nicht. Vergleiche mit dem Merksatz.");
}

function checkStep3() {
  let correctCount = 0;
  let total = 0;
  classificationRows.forEach((answer, index) => {
    ["charge", "pair", "product", "base"].forEach(key => {
      const select = document.querySelector(`[data-field="c-${index}-${key}"]`);
      const correct = select.value === answer[key];
      markSelect(select, correct);
      total += 1;
      if (correct) correctCount += 1;
    });
  });
  const ok = correctCount === total;
  setFeedback("step3", ok, ok ? "Die Tabelle ist vollständig richtig." : `${correctCount} von ${total} Tabellenfeldern sind richtig. Korrigiere die rot markierten Felder.`);
}

function checkStep4() {
  const ok = selected("claim-a") === "false" && selected("claim-b") === "false" && selected("claim-c") === "true";
  setFeedback("step4", ok, ok ? "Alle drei Aussagen sind richtig beurteilt." : "Mindestens eine Beurteilung stimmt noch nicht. Unterscheide Strukturfrage und Stärkefrage.");
}

function checkStep5() {
  let correctCount = 0;
  let total = 0;
  practiceRows.forEach((answer, index) => {
    ["possible", "product"].forEach(key => {
      const select = document.querySelector(`[data-field="p-${index}-${key}"]`);
      const correct = select.value === answer[key];
      markSelect(select, correct);
      total += 1;
      if (correct) correctCount += 1;
    });
  });
  const transfer = [
    ["#h2po4-accept", "H₃PO₄"],
    ["#h2po4-donate", "HPO₄²⁻"],
    ["#hpo4-accept", "H₂PO₄⁻"],
    ["#hpo4-donate", "PO₄³⁻"],
  ];
  transfer.forEach(([selector, answer]) => {
    const select = document.querySelector(selector);
    const correct = select.value === answer;
    markSelect(select, correct);
    total += 1;
    if (correct) correctCount += 1;
  });
  const ok = correctCount === total;
  setFeedback("step5", ok, ok ? "Übung und Transfer sind vollständig richtig." : `${correctCount} von ${total} Zuordnungen sind richtig. Korrigiere die rot markierten Felder.`);
}

const checkers = { step1: checkStep1, step2: checkStep2, step3: checkStep3, step4: checkStep4, step5: checkStep5 };

buildTables();
restore();
showStep(currentStep);

document.addEventListener("input", save);
document.querySelectorAll(".check-step").forEach(button => button.addEventListener("click", () => checkers[button.dataset.check]()));
navButtons.forEach(button => button.addEventListener("click", () => showStep(Number(button.dataset.step))));
document.querySelector("#previous-step").addEventListener("click", () => showStep(currentStep - 1));
document.querySelector("#next-step").addEventListener("click", () => showStep(currentStep === stepPanels.length - 1 ? 0 : currentStep + 1));
document.querySelector("#print-button").addEventListener("click", () => window.print());
document.querySelector("#reset-button").addEventListener("click", () => {
  if (!window.confirm("Möchtest du alle Antworten und den Fortschritt löschen?")) return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

function registerWebMcp() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const reportError = error => console.warn("WebMCP tool registration failed", error);
  try {
    void Promise.resolve(context.registerTool({
      name: "get_learning_progress",
      title: "Lernfortschritt lesen",
      description: "Liest den aktuellen Lernschritt und die Zahl abgeschlossener Lernschritte.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return { currentStep: currentStep + 1, completedSteps: completed.size, totalSteps: stepPanels.length };
      },
    })).catch(reportError);
    void Promise.resolve(context.registerTool({
      name: "reset_learning_progress",
      title: "Lernfortschritt zurücksetzen",
      description: "Löscht alle eingegebenen Antworten und startet das Lernprogramm neu.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() {
        localStorage.removeItem(STORAGE_KEY);
        allInputs().forEach(element => {
          if (element.type === "radio") element.checked = false;
          else element.value = "";
        });
        completed.clear();
        document.querySelectorAll(".solution").forEach(element => { element.hidden = true; });
        document.querySelectorAll(".feedback").forEach(element => { element.textContent = ""; element.className = "feedback"; });
        document.querySelectorAll(".cell-correct, .cell-wrong").forEach(element => element.classList.remove("cell-correct", "cell-wrong"));
        showStep(0);
        return { reset: true, currentStep: 1, completedSteps: 0 };
      },
    })).catch(reportError);
  } catch (error) {
    reportError(error);
  }
}

registerWebMcp();
