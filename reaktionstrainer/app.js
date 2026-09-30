const STORAGE_KEY = "saeure-base-reaktionstrainer-v3";

const reactions = [
  {
    title: "Chlorwasserstoff in Wasser", label: "Einstieg", reversible: false,
    intro: "Untersuche die Protonenübertragung, die bereits aus dem Teilchenmodell bekannt ist.",
    species: { hcl: "HCl", h2o: "H₂O", h3o: "H₃O⁺", cl: "Cl⁻" },
    equation: { left: [[1,"hcl"],[1,"h2o"]], right: [[1,"h3o"],[1,"cl"]] },
    donor: "hcl", acceptor: "h2o", roles: { hcl: "Säure", h2o: "Base" },
    pairs: ["hcl-cl","h3o-h2o"], pairOptions: [["hcl-cl","HCl / Cl⁻"],["h3o-h2o","H₃O⁺ / H₂O"],["hcl-h2o","HCl / H₂O"],["h3o-cl","H₃O⁺ / Cl⁻"]],
    conclusion: "HCl gibt das Proton an H₂O ab. Dabei entstehen H₃O⁺ und Cl⁻."
  },
  {
    title: "Essigsäure in Wasser", label: "schwache Säure", reversible: true,
    intro: "Die Protonenübertragung ist umkehrbar. Bestimme deshalb die Rollen auf beiden Seiten.",
    species: { hac: "CH₃COOH", h2o: "H₂O", h3o: "H₃O⁺", ac: "CH₃COO⁻" },
    equation: { left: [[1,"hac"],[1,"h2o"]], right: [[1,"h3o"],[1,"ac"]] },
    donor: "hac", acceptor: "h2o", roles: { hac: "Säure", h2o: "Base", h3o: "Säure", ac: "Base" },
    pairs: ["hac-ac","h3o-h2o"], pairOptions: [["hac-ac","CH₃COOH / CH₃COO⁻"],["h3o-h2o","H₃O⁺ / H₂O"],["hac-h2o","CH₃COOH / H₂O"],["h3o-ac","H₃O⁺ / CH₃COO⁻"]],
    conclusion: "Die Rückreaktion macht sichtbar: H₃O⁺ kann als Säure und CH₃COO⁻ als Base reagieren."
  },
  {
    title: "Ammoniak in Wasser", label: "schwache Base", reversible: true,
    intro: "Hier gibt Wasser ein Proton ab. Achte darauf, welches Teilchen dadurch zum Hydroxid-Ion wird.",
    species: { nh3: "NH₃", h2o: "H₂O", nh4: "NH₄⁺", oh: "OH⁻" },
    equation: { left: [[1,"nh3"],[1,"h2o"]], right: [[1,"nh4"],[1,"oh"]] },
    donor: "h2o", acceptor: "nh3", roles: { nh3: "Base", h2o: "Säure", nh4: "Säure", oh: "Base" },
    pairs: ["h2o-oh","nh4-nh3"], pairOptions: [["h2o-oh","H₂O / OH⁻"],["nh4-nh3","NH₄⁺ / NH₃"],["h2o-nh3","H₂O / NH₃"],["nh4-oh","NH₄⁺ / OH⁻"]],
    conclusion: "NH₃ nimmt ein Proton von H₂O auf. In der Rückreaktion gibt NH₄⁺ dieses Proton wieder ab."
  },
  {
    title: "Dihydrogenphosphat in Wasser", label: "Ampholyt als Säure", reversible: true,
    intro: "Dihydrogenphosphat reagiert in dieser Gleichung als Protonendonator.",
    species: { h2po4: "H₂PO₄⁻", h2o: "H₂O", h3o: "H₃O⁺", hpo4: "HPO₄²⁻" },
    equation: { left: [[1,"h2po4"],[1,"h2o"]], right: [[1,"h3o"],[1,"hpo4"]] },
    donor: "h2po4", acceptor: "h2o", roles: { h2po4: "Säure", h2o: "Base", h3o: "Säure", hpo4: "Base" },
    pairs: ["h2po4-hpo4","h3o-h2o"], pairOptions: [["h2po4-hpo4","H₂PO₄⁻ / HPO₄²⁻"],["h3o-h2o","H₃O⁺ / H₂O"],["h2po4-h2o","H₂PO₄⁻ / H₂O"],["h3o-hpo4","H₃O⁺ / HPO₄²⁻"]],
    conclusion: "H₂PO₄⁻ gibt ein Proton ab. HPO₄²⁻ ist seine korrespondierende Base."
  },
  {
    title: "Hydrogencarbonat in Wasser", label: "Ampholyt als Base", reversible: true,
    intro: "Hydrogencarbonat zeigt nun die andere mögliche Ampholyt-Reaktion: Es nimmt ein Proton auf.",
    species: { hco3: "HCO₃⁻", h2o: "H₂O", h2co3: "H₂CO₃", oh: "OH⁻" },
    equation: { left: [[1,"hco3"],[1,"h2o"]], right: [[1,"h2co3"],[1,"oh"]] },
    donor: "h2o", acceptor: "hco3", roles: { hco3: "Base", h2o: "Säure", h2co3: "Säure", oh: "Base" },
    pairs: ["h2co3-hco3","h2o-oh"], pairOptions: [["h2co3-hco3","H₂CO₃ / HCO₃⁻"],["h2o-oh","H₂O / OH⁻"],["hco3-oh","HCO₃⁻ / OH⁻"],["h2co3-h2o","H₂CO₃ / H₂O"]],
    conclusion: "HCO₃⁻ nimmt ein Proton auf und wird zu H₂CO₃. In dieser Reaktion wirkt es als Base."
  },
  {
    title: "Oxonium- und Hydroxid-Ionen", label: "Neutralisation", reversible: false,
    intro: "Bei dieser Reaktion ist erstmals ein Koeffizient größer als eins.",
    species: { h3o: "H₃O⁺", oh: "OH⁻", h2o: "H₂O" },
    equation: { left: [[1,"h3o"],[1,"oh"]], right: [[2,"h2o"]] },
    donor: "h3o", acceptor: "oh", roles: { h3o: "Säure", oh: "Base" },
    pairs: ["h3o-h2o","h2o-oh"], pairOptions: [["h3o-h2o","H₃O⁺ / H₂O"],["h2o-oh","H₂O / OH⁻"],["h3o-oh","H₃O⁺ / OH⁻"],["oh-h2o","OH⁻ / H₂O"]],
    conclusion: "Ein H₃O⁺-Ion überträgt ein Proton auf OH⁻. Es entstehen zwei Wassermoleküle."
  }
];

const emptyAnswer = () => ({ values: {}, tasks: { balance: false, transfer: false, roles: false, pairs: false } });
let state = { current: 0, answers: reactions.map(emptyAnswer) };

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || !Array.isArray(stored.answers)) return;
    state.current = Math.min(Math.max(Number(stored.current) || 0, 0), reactions.length - 1);
    state.answers = reactions.map((_, index) => ({ ...emptyAnswer(), ...(stored.answers[index] || {}), tasks: { ...emptyAnswer().tasks, ...(stored.answers[index]?.tasks || {}) } }));
  } catch { localStorage.removeItem(STORAGE_KEY); }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function currentReaction() { return reactions[state.current]; }
function currentAnswer() { return state.answers[state.current]; }
function optionHtml(reaction, ids) { return `<option value="">auswählen</option>${ids.map(id => `<option value="${id}">${reaction.species[id]}</option>`).join("")}`; }

function renderNavigation() {
  document.querySelector("#reactionNav").innerHTML = reactions.map((reaction, index) => {
    const done = Object.values(state.answers[index].tasks).every(Boolean);
    return `<button class="nav-item ${index === state.current ? "active" : ""} ${done ? "done" : ""}" data-reaction="${index}" type="button"><span>${String(index + 1).padStart(2,"0")}</span>${reaction.title}</button>`;
  }).join("");
  document.querySelectorAll("[data-reaction]").forEach(button => button.addEventListener("click", () => { state.current = Number(button.dataset.reaction); render(); window.scrollTo({top: 0, behavior: "smooth"}); }));
}

function renderEquation(reaction, answer) {
  const term = ([coefficient, id], index, side) => `<span class="species-term"><input class="coefficient" type="number" min="1" max="4" inputmode="numeric" aria-label="Koeffizient vor ${reaction.species[id]}" data-value="coef-${side}-${index}" value="${answer.values[`coef-${side}-${index}`] || ""}"><span>${reaction.species[id]}</span></span>`;
  const side = (terms, name) => terms.map((item, index) => term(item, index, name)).join(`<span class="equation-symbol">+</span>`);
  const desktopArrow = reaction.reversible ? "⇌" : "→";
  const mobileArrow = reaction.reversible ? "⇅" : "↓";
  document.querySelector("#equationBuilder").innerHTML = `<div class="equation-side"><span class="equation-side-label">Edukte</span>${side(reaction.equation.left,"left")}</div><span class="equation-symbol reaction-arrow"><span class="desktop-arrow">${desktopArrow}</span><span class="mobile-arrow">${mobileArrow}</span></span><div class="equation-side"><span class="equation-side-label">Produkte</span>${side(reaction.equation.right,"right")}</div>`;
}

function renderRoles(reaction, answer) {
  const ids = Object.keys(reaction.roles);
  const leftIds = reaction.equation.left.map(item => item[1]);
  document.querySelector("#rolesInstruction").textContent = reaction.reversible ? "Ordne auf beiden Seiten Säure und Base zu. Beziehe die Rückreaktion mit ein." : "Ordne auf der Eduktseite Säure und Base zu.";
  document.querySelector("#roleGrid").innerHTML = ids.map((id, index) => {
    const side = leftIds.includes(id) ? "Eduktseite" : "Produktseite";
    const heading = index === 0 || (index > 0 && side !== (leftIds.includes(ids[index - 1]) ? "Eduktseite" : "Produktseite")) ? `<p class="side-label">${side}</p>` : "";
    const selected = answer.values[`role-${id}`] || "";
    return `${heading}<div class="role-item ${side === "Produktseite" ? "product" : ""}"><strong class="role-formula">${reaction.species[id]}</strong><label class="role-select-label"><span>Rolle auswählen</span><select class="role-select" data-role="${id}" aria-label="Rolle von ${reaction.species[id]}"><option value="">– auswählen –</option><option value="Säure" ${selected === "Säure" ? "selected" : ""}>Säure</option><option value="Base" ${selected === "Base" ? "selected" : ""}>Base</option></select></label></div>`;
  }).join("");
}

function renderPairs(reaction, answer) {
  document.querySelector("#pairOptions").innerHTML = reaction.pairOptions.map(([id,label]) => `<label class="pair-option"><input type="checkbox" data-pair="${id}" ${answer.values[`pair-${id}`] ? "checked" : ""}><span>${label}</span></label>`).join("");
}

function renderFeedback() {
  const answer = currentAnswer();
  Object.entries(answer.tasks).forEach(([task, correct]) => {
    if (!correct) return;
    const feedback = document.querySelector(`#feedback-${task}`);
    feedback.textContent = "Richtig."; feedback.className = "feedback success";
    feedback.closest(".card")?.classList.add("task-correct");
  });
}

function render() {
  const reaction = currentReaction(), answer = currentAnswer();
  document.querySelector("#reactionLabel").textContent = `Reaktion ${state.current + 1} · ${reaction.label}`;
  document.querySelector("#reactionTitle").textContent = reaction.title;
  document.querySelector("#reactionIntro").textContent = reaction.intro;
  document.querySelector("#reactionType").textContent = reaction.reversible ? "reversibel" : "gerichtet";
  renderEquation(reaction, answer);
  const reactantIds = reaction.equation.left.map(item => item[1]);
  document.querySelector("#donorSelect").innerHTML = optionHtml(reaction, reactantIds);
  document.querySelector("#acceptorSelect").innerHTML = optionHtml(reaction, reactantIds);
  document.querySelector("#donorSelect").value = answer.values.donor || "";
  document.querySelector("#acceptorSelect").value = answer.values.acceptor || "";
  renderRoles(reaction, answer); renderPairs(reaction, answer);
  document.querySelectorAll(".card").forEach(card => card.classList.remove("task-correct","task-wrong"));
  document.querySelectorAll(".feedback").forEach(box => { box.textContent = ""; box.className = "feedback"; });
  renderFeedback(); renderNavigation(); updateCompletion(); bindInputs();
  document.querySelector("#previousReaction").disabled = state.current === 0;
  document.querySelector("#nextReaction").textContent = state.current === reactions.length - 1 ? "Zur ersten Reaktion" : "Nächste Reaktion";
  document.querySelector("#reactionCounter").textContent = `${state.current + 1} von ${reactions.length}`;
  saveState();
}

function bindInputs() {
  document.querySelectorAll("[data-value]").forEach(input => input.addEventListener("input", () => { currentAnswer().values[input.dataset.value] = input.value; invalidate(input.dataset.value.startsWith("coef-") ? "balance" : "transfer"); }));
  document.querySelectorAll("[data-pair]").forEach(input => input.addEventListener("change", () => { currentAnswer().values[`pair-${input.dataset.pair}`] = input.checked; invalidate("pairs"); }));
  document.querySelectorAll(".role-select").forEach(input => input.addEventListener("change", () => {
    currentAnswer().values[`role-${input.dataset.role}`] = input.value;
    invalidate("roles");
  }));
}

function invalidate(task) {
  currentAnswer().tasks[task] = false;
  const feedback = document.querySelector(`#feedback-${task}`); feedback.textContent = ""; feedback.className = "feedback";
  feedback.closest(".card")?.classList.remove("task-correct","task-wrong");
  updateCompletion(); renderNavigation(); saveState();
}

function report(task, ok, message) {
  currentAnswer().tasks[task] = ok;
  const feedback = document.querySelector(`#feedback-${task}`);
  feedback.textContent = message; feedback.className = `feedback ${ok ? "success" : "error"}`;
  feedback.closest(".card")?.classList.toggle("task-correct", ok);
  feedback.closest(".card")?.classList.toggle("task-wrong", !ok);
  updateCompletion(); renderNavigation(); saveState();
}

function checkBalance() {
  const reaction = currentReaction(); let ok = true;
  [["left",reaction.equation.left],["right",reaction.equation.right]].forEach(([side,terms]) => terms.forEach(([coefficient],index) => { if (Number(currentAnswer().values[`coef-${side}-${index}`]) !== coefficient) ok = false; }));
  report("balance", ok, ok ? "Richtig ausgeglichen." : "Noch nicht ausgeglichen. Prüfe Teilchenzahl und Gesamtladung auf beiden Seiten.");
}
function checkTransfer() { const reaction=currentReaction(), answer=currentAnswer(); const ok=answer.values.donor===reaction.donor&&answer.values.acceptor===reaction.acceptor; report("transfer",ok,ok?"Donator und Akzeptor stimmen.":"Noch nicht. Verfolge, welches Teilchen H⁺ abgibt und welches es aufnimmt."); }
function checkRoles() { const reaction=currentReaction(), answer=currentAnswer(); const ok=Object.entries(reaction.roles).every(([id,role])=>answer.values[`role-${id}`]===role); report("roles",ok,ok?"Alle Brønsted-Rollen stimmen.":reaction.reversible?"Mindestens eine Rolle stimmt noch nicht. Denke auch an die Rückreaktion.":"Prüfe die Rollen von Protonendonator und Protonenakzeptor."); }
function checkPairs() { const selected=currentReaction().pairOptions.filter(([id])=>currentAnswer().values[`pair-${id}`]).map(([id])=>id).sort(); const expected=[...currentReaction().pairs].sort(); const ok=selected.length===2&&selected.every((id,index)=>id===expected[index]); report("pairs",ok,ok?"Beide korrespondierenden Paare stimmen.":"Noch nicht. Markiere genau zwei Paare, deren Teilchen sich jeweils um ein H⁺ unterscheiden."); }

function updateCompletion() {
  const completed = state.answers.filter(answer => Object.values(answer.tasks).every(Boolean)).length;
  document.querySelector("#progressText").textContent = `${completed} / ${reactions.length}`;
  document.querySelector("#progressBar").style.width = `${completed / reactions.length * 100}%`;
  const done = Object.values(currentAnswer().tasks).every(Boolean);
  document.querySelector("#completionCard").hidden = !done;
  document.querySelector("#completionText").textContent = currentReaction().conclusion;
}

document.querySelectorAll("[data-check]").forEach(button => button.addEventListener("click", () => ({balance:checkBalance,transfer:checkTransfer,roles:checkRoles,pairs:checkPairs})[button.dataset.check]()));
document.querySelector("#previousReaction").addEventListener("click", () => { if (state.current > 0) { state.current -= 1; render(); window.scrollTo({top:0,behavior:"smooth"}); } });
document.querySelector("#nextReaction").addEventListener("click", () => { state.current = state.current === reactions.length - 1 ? 0 : state.current + 1; render(); window.scrollTo({top:0,behavior:"smooth"}); });
document.querySelector("#resetProgress").addEventListener("click", () => { if (!window.confirm("Möchtest du alle Antworten und den Fortschritt dieses Trainers löschen?")) return; localStorage.removeItem(STORAGE_KEY); state={current:0,answers:reactions.map(emptyAnswer)}; render(); });

loadState(); render();
