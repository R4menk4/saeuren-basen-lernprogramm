(() => {
  const STORAGE_KEY = 'oxonium-labor-v1';
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completed":[]}');
  const modules = [...document.querySelectorAll('.module')];
  const navItems = [...document.querySelectorAll('.nav-item')];

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateProgress(); }
  function complete(id){ if(!state.completed.includes(id)) state.completed.push(id); save(); }
  function updateProgress(){
    const pct = Math.round((state.completed.length / modules.length) * 100);
    document.querySelector('#progressText').textContent = `${pct} %`;
    document.querySelector('#progressBar').style.width = `${pct}%`;
    navItems.forEach(n => n.classList.toggle('done', state.completed.includes(n.dataset.target)));
  }
  function showModule(id, persist=true){
    modules.forEach(m => { const active=m.id===id; m.hidden=!active; m.classList.toggle('active',active); });
    navItems.forEach(n => n.classList.toggle('active', n.dataset.target===id));
    document.querySelector(`#${id}`).scrollIntoView({behavior:'smooth',block:'start'});
    if (persist) { state.current=id; save(); }
  }
  navItems.forEach(n => n.addEventListener('click',()=>showModule(n.dataset.target)));
  document.querySelectorAll('.next-module').forEach(b => b.addEventListener('click',()=>{complete(b.closest('.module').id);showModule(b.dataset.next);}));

  document.querySelectorAll('[data-question="basics"] .choice').forEach(btn => btn.addEventListener('click',()=>{
    const group=btn.closest('.choice-group'); group.querySelectorAll('.choice').forEach(x=>x.classList.remove('correct','incorrect'));
    const ok=btn.dataset.correct==='true'; btn.classList.add(ok?'correct':'incorrect');
    const fb=group.nextElementSibling; fb.className=`feedback ${ok?'success':'error'}`; fb.textContent=ok?'Richtig. +1 und −1 ergeben insgesamt 0.':'Noch nicht. Denke an Kern und Hülle sowie ihre entgegengesetzten Ladungen.';
    if(ok) complete('start');
  }));

  const labState={step1:false,step2:false,step3:false};
  const labPanels=[...document.querySelectorAll('.lab-panel')];
  const labDots=[...document.querySelectorAll('.lab-step-dot')];
  let selectedParticle=null;

  function unlockLabStep(number){
    const dot=document.querySelector(`.lab-step-dot[data-lab-step="${number}"]`);
    if(dot)dot.disabled=false;
  }
  function showLabStep(number){
    const targetDot=document.querySelector(`.lab-step-dot[data-lab-step="${number}"]`);
    if(!targetDot||targetDot.disabled)return;
    labPanels.forEach(panel=>{const active=Number(panel.dataset.panel)===number;panel.hidden=!active;panel.classList.toggle('active',active);});
    labDots.forEach(dot=>{const active=Number(dot.dataset.labStep)===number;dot.classList.toggle('active',active);if(active)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');});
    document.querySelector('#guidedLab').scrollIntoView({behavior:'smooth',block:'start'});
    if(number===4){document.querySelector('.lab-step-dot[data-lab-step="4"]').classList.add('done');complete('oxonium');}
  }
  labDots.forEach(dot=>dot.addEventListener('click',()=>showLabStep(Number(dot.dataset.labStep))));
  document.querySelectorAll('.lab-back').forEach(button=>button.addEventListener('click',()=>showLabStep(Number(button.dataset.goStep))));
  document.querySelector('#toLabStep2').addEventListener('click',()=>showLabStep(2));
  document.querySelector('#toLabStep3').addEventListener('click',()=>showLabStep(3));
  document.querySelector('#toLabStep4').addEventListener('click',()=>showLabStep(4));

  function selectParticle(source){
    if(source.getAttribute('draggable')!=='true')return;
    if(selectedParticle&&selectedParticle!==source)selectedParticle.classList.remove('selected');
    selectedParticle=selectedParticle===source?null:source;
    source.classList.toggle('selected',selectedParticle===source);
  }
  function connectDragAndDrop(source,target,onSuccess){
    source.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',source.id);event.dataTransfer.effectAllowed='move';});
    source.addEventListener('click',()=>selectParticle(source));
    target.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='move';target.classList.add('drag-over');});
    target.addEventListener('dragleave',()=>target.classList.remove('drag-over'));
    target.addEventListener('drop',event=>{event.preventDefault();target.classList.remove('drag-over');if(event.dataTransfer.getData('text/plain')===source.id)onSuccess();});
    const activateTarget=()=>{if(selectedParticle===source)onSuccess();};
    target.addEventListener('click',activateTarget);
    target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activateTarget();}});
  }

  const labElectron=document.querySelector('#labElectron');
  const electronDrop=document.querySelector('#electronDrop');
  const step1Atom=document.querySelector('#step1Atom');
  const hydrogenLabel=document.querySelector('#hydrogenLabel');
  function finishStep1(){
    if(labState.step1)return;
    labState.step1=true;selectedParticle=null;labElectron.classList.remove('selected');labElectron.setAttribute('draggable','false');electronDrop.prepend(labElectron);electronDrop.classList.add('completed');step1Atom.classList.add('ionized');hydrogenLabel.textContent='Wasserstoffion H⁺ · Proton';document.querySelector('#step1Explanation').hidden=false;document.querySelector('#toLabStep2').disabled=false;document.querySelector('.lab-step-dot[data-lab-step="1"]').classList.add('done');unlockLabStep(2);
  }
  connectDragAndDrop(labElectron,electronDrop,finishStep1);

  const labProton=document.querySelector('#labProton');
  const waterDrop=document.querySelector('#waterDrop');
  const step2Water=document.querySelector('#step2Water');
  function finishStep2(){
    if(labState.step2)return;
    labState.step2=true;selectedParticle=null;labProton.classList.remove('selected');labProton.setAttribute('draggable','false');labProton.hidden=true;waterDrop.classList.add('completed');step2Water.classList.add('protonated');document.querySelector('#waterLabel').textContent='Oxonium-Ion H₃O⁺';waterDrop.querySelector('.drop-hint').textContent='Proton aufgenommen';document.querySelector('#step2Explanation').hidden=false;document.querySelector('#toLabStep3').disabled=false;document.querySelector('.lab-step-dot[data-lab-step="2"]').classList.add('done');unlockLabStep(3);
  }
  connectDragAndDrop(labProton,waterDrop,finishStep2);

  document.querySelector('#splitHcl').addEventListener('click',event=>{
    if(labState.step3)return;
    labState.step3=true;document.querySelector('#hclStage').classList.add('split');document.querySelector('#hclEquation').classList.add('revealed');document.querySelector('#step3Explanation').hidden=false;document.querySelector('#toLabStep4').disabled=false;event.currentTarget.disabled=true;event.currentTarget.textContent='Bindung getrennt';document.querySelector('.lab-step-dot[data-lab-step="3"]').classList.add('done');unlockLabStep(4);
  });

  document.querySelector('#resetLab').addEventListener('click',()=>{
    labState.step1=false;labState.step2=false;labState.step3=false;selectedParticle=null;
    step1Atom.appendChild(labElectron);labElectron.setAttribute('draggable','true');labElectron.classList.remove('selected');electronDrop.classList.remove('completed');step1Atom.classList.remove('ionized');hydrogenLabel.textContent='Wasserstoffatom H';document.querySelector('#step1Explanation').hidden=true;document.querySelector('#toLabStep2').disabled=true;
    labProton.hidden=false;labProton.setAttribute('draggable','true');labProton.classList.remove('selected');waterDrop.classList.remove('completed');step2Water.classList.remove('protonated');document.querySelector('#waterLabel').textContent='Wassermolekül H₂O';waterDrop.querySelector('.drop-hint').textContent='H⁺ hierher ziehen';document.querySelector('#step2Explanation').hidden=true;document.querySelector('#toLabStep3').disabled=true;
    document.querySelector('#hclStage').classList.remove('split');document.querySelector('#hclEquation').classList.remove('revealed');document.querySelector('#step3Explanation').hidden=true;document.querySelector('#toLabStep4').disabled=true;const split=document.querySelector('#splitHcl');split.disabled=false;split.textContent='Bindung gedanklich trennen';
    labDots.forEach(dot=>{const step=Number(dot.dataset.labStep);dot.disabled=step!==1;dot.classList.remove('done');});showLabStep(1);
  });

  document.querySelectorAll('.graded-single .choice').forEach(btn => btn.addEventListener('click', () => {
    const group = btn.closest('.graded-single');
    group.querySelectorAll('.choice').forEach(x => x.classList.remove('correct','incorrect'));
    const ok = btn.dataset.correct === 'true';
    btn.classList.add(ok ? 'correct' : 'incorrect');
    const fb = group.nextElementSibling;
    fb.className = `feedback ${ok ? 'success' : 'error'}`;
    if (group.dataset.moduleComplete === 'ph') {
      fb.textContent = ok ? 'Richtig: Drei pH-Stufen entsprechen 10³ = 1000.' : 'Noch nicht. Von pH 5 zu pH 2 sind es drei Stufen: 10 · 10 · 10.';
    } else {
      fb.textContent = ok ? 'Genau. Ohne die Skala des verwendeten Indikators ist „grün“ nicht eindeutig.' : 'Prüfe die Behauptung „bei jedem Indikator“: Rotkohlsaft und Universalindikator haben verschiedene Farbskalen.';
    }
    if (ok) complete(group.dataset.moduleComplete);
  }));

  const phColors = ['#e52b20','#ed3c1f','#f04e20','#f6781f','#f6a620','#f0ce23','#9bcf31','#27a955','#1aa67b','#169ca0','#187fab','#356fbd','#5a5ab0','#713f9d','#873797'];
  const phScale = document.querySelector('#phScale');
  function describePh(value) {
    const category = value < 7 ? 'sauer' : value === 7 ? 'neutral' : 'basisch';
    const meaning = value < 7 ? 'Die Lösung enthält unter den betrachteten Bedingungen mehr H₃O⁺ als eine neutrale Lösung.' : value === 7 ? 'Der Neutralpunkt liegt bei pH 7.' : 'Die Lösung enthält unter den betrachteten Bedingungen weniger H₃O⁺ als eine neutrale Lösung.';
    document.querySelector('#phValue').textContent = value;
    document.querySelector('#phCategory').textContent = category;
    document.querySelector('#phMeaning').textContent = meaning;
    phScale.querySelectorAll('.ph-tick').forEach(t => t.classList.toggle('selected', Number(t.dataset.ph) === value));
  }
  for (let i=0;i<=14;i++) {
    const b=document.createElement('button'); b.className='ph-tick'; b.textContent=i; b.dataset.ph=i; b.style.background=phColors[i]; b.setAttribute('aria-label',`pH ${i} auswählen`); b.addEventListener('click',()=>describePh(i)); phScale.appendChild(b);
  }
  describePh(7);

  const indicatorData = {
    universal: [
      ['#d92525','rot'],['#e43a20','rotorange'],['#ee5720','orange'],['#f57b1e','orange'],['#f7a91d','gelborange'],['#f1d326','gelb'],['#9dcc32','gelbgrün'],['#28a652','grün'],['#19a47a','türkisgrün'],['#14999e','türkis'],['#197eab','blau'],['#346fbc','blau'],['#5859ae','blauviolett'],['#713f9c','violett'],['#873695','violett']
    ],
    cabbage: [
      ['#d93649','rot'],['#df3e5e','rot'],['#d94d79','pink'],['#c14b8d','pinkviolett'],['#9f489b','violett'],['#81479d','violett'],['#7047a3','violett'],['#664ba2','violett'],['#515aa6','blauviolett'],['#3b68a8','blau'],['#287b9c','blaugrün'],['#218c82','grün'],['#36976b','grün'],['#64a153','grün'],['#81a83d','gelbgrün']
    ]
  };
  function updateIndicator(){
    const kind=document.querySelector('#indicatorSelect').value; const pH=Number(document.querySelector('#indicatorPh').value); const [color,name]=indicatorData[kind][pH];
    document.querySelector('#indicatorPhLabel').textContent=pH; document.querySelector('#beakerLiquid').style.fill=color; document.querySelector('#liquidLabel').textContent=name; document.querySelector('#indicatorColorName').textContent=name;
    document.querySelector('#indicatorNote').textContent=kind==='universal'?'Universalindikator: grobe pH-Abschätzung durch mehrere Farbstoffe.':'Rotkohlsaft: Naturfarbstoffe erscheinen sauer rötlich, nahe neutral violett und basisch bläulich bis grün.';
  }
  document.querySelector('#indicatorSelect').addEventListener('change',updateIndicator); document.querySelector('#indicatorPh').addEventListener('input',updateIndicator); updateIndicator();

  const claims = [
    {text:'Produkt B ist sauer.', answer:true, why:'Zulässig: Der angegebene pH-Wert 2,3 liegt unter 7.'},
    {text:'Produkt B enthält deshalb eine stärkere Säure als Produkt A.', answer:false, why:'Nicht zulässig: Aus den pH-Werten der Produkte folgt nicht direkt die Säurestärke. Auch Konzentration und Zusammensetzung beeinflussen den pH-Wert.'},
    {text:'Produkt D ist bei pH 7,2 automatisch ungefährlich.', answer:false, why:'Nicht zulässig: Die Karte nennt eine schwere Augenreizung. Ein pH-Wert nahe 7 garantiert keine Ungefährlichkeit.'},
    {text:'Produkt A und C können beide ätzend wirken, obwohl ihre pH-Werte auf verschiedenen Seiten der Skala liegen.', answer:true, why:'Zulässig: Stark saure und stark basische Produkte können beide ätzend wirken; die Kennzeichnung bestätigt es.'},
    {text:'Am Aussehen einer klaren Flüssigkeit lässt sich ihr Gefahrenpotenzial erkennen.', answer:false, why:'Nicht zulässig: Klare Flüssigkeiten können sehr unterschiedliche Gefahren besitzen. Entscheidend sind Kennzeichnung und Stoffinformationen.'}
  ];
  const claimList=document.querySelector('#claimList'); const solvedClaims=new Set();
  claims.forEach((claim,index)=>{
    const row=document.createElement('div'); row.className='claim'; row.innerHTML=`<p>${index+1}. ${claim.text}</p><div class="verdict-buttons"><button data-value="true">zulässig</button><button data-value="false">nicht zulässig</button></div><div class="claim-explain" aria-live="polite"></div>`;
    row.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      row.querySelectorAll('button').forEach(x=>x.classList.remove('correct','incorrect')); const ok=(btn.dataset.value==='true')===claim.answer; btn.classList.add(ok?'correct':'incorrect'); row.querySelector('.claim-explain').textContent=ok?claim.why:'Prüfe noch einmal alle Angaben der passenden Produktkarte.';
      if(ok){solvedClaims.add(index); if(solvedClaims.size===claims.length){document.querySelector('#productCompletion').textContent='Alle fünf Aussagen richtig bewertet – Produkt-Check abgeschlossen.';complete('produkte');}}
    })); claimList.appendChild(row);
  });

  const questions = [
    {topic:'Grundlagen',q:'Was bleibt übrig, wenn ein Wasserstoffatom sein Elektron abgibt?',a:['ein neutrales Atom','ein Proton H⁺','ein Wassermolekül'],correct:1,why:'H besitzt ein Proton und ein Elektron. Nach der Elektronenabgabe bleibt H⁺, also ein Proton.'},
    {topic:'Teilchenmodell',q:'Welche Gleichung zeigt die Bildung eines Oxonium-Ions?',a:['H⁺ + H₂O → H₃O⁺','H₂O → H⁺ + O²⁻','H₃O⁺ → H₂ + O'],correct:0,why:'Wasser nimmt ein Proton auf; dadurch entsteht H₃O⁺.'},
    {topic:'Teilchenmodell',q:'Wie ist H⁺ in einer wässrigen Säurelösung fachlich zu verstehen?',a:['als lange frei schwimmendes Proton','als Kurzschreibweise für den sauren Teilchenbestand','als Elektron'],correct:1,why:'Ein Proton wird in Wasser direkt übertragen und liegt nicht längere Zeit isoliert vor.'},
    {topic:'pH-Regel',q:'Was geschieht mit dem pH-Wert, wenn die H₃O⁺-Konzentration größer wird?',a:['Er wird kleiner.','Er bleibt immer 7.','Er wird größer.'],correct:0,why:'Mehr H₃O⁺ bedeutet unter den betrachteten Bedingungen einen kleineren pH-Wert.'},
    {topic:'pH-Skala',q:'Wie wird eine Lösung mit pH 9 eingeordnet?',a:['sauer','neutral','basisch'],correct:2,why:'pH-Werte über 7 werden als basisch eingeordnet.'},
    {topic:'Zehnerpotenzen',q:'Eine Lösung mit pH 3 enthält gegenüber pH 5 ungefähr …',a:['zweimal so viele H₃O⁺-Ionen','100-mal so viele H₃O⁺-Ionen','100-mal weniger H₃O⁺-Ionen'],correct:1,why:'Zwei pH-Stufen entsprechen 10² = 100.'},
    {topic:'Indikatoren',q:'Eine Probe mit Rotkohlsaft ist grün. Welche Aussage ist am besten?',a:['Sie liegt wahrscheinlich im basischen Bereich.','Sie ist sicher neutral.','Sie ist automatisch ungefährlich.'],correct:0,why:'Bei Rotkohlsaft deutet Grün auf einen basischen Bereich. Für eine genaue Zahl reicht die Beobachtung nicht.'},
    {topic:'Bewerten',q:'Warum beweist pH 7,2 nicht, dass ein Produkt ungefährlich ist?',a:['Weil pH-Werte nie messbar sind.','Weil weitere Stoffeigenschaften und Gefahrhinweise berücksichtigt werden müssen.','Weil jede neutrale Lösung ätzend ist.'],correct:1,why:'Der pH-Wert beschreibt den sauren oder basischen Zustand, aber nicht allein das gesamte Gefahrenpotenzial.'}
  ];
  let testIndex=0,testScore=0,answered=false;
  function shuffledOptions(item){
    const options=item.a.map((answer,original)=>({answer,original,correct:original===item.correct}));
    for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
    if(options.every((option,index)=>option.original===index))options.push(options.shift());
    return options;
  }
  function renderQuestion(){
    const item=questions[testIndex]; answered=false; document.querySelector('#testCounter').textContent=`Frage ${testIndex+1} von ${questions.length}`; document.querySelector('#testProgressBar').style.width=`${(testIndex/questions.length)*100}%`; document.querySelector('#testTopic').textContent=item.topic; document.querySelector('#testQuestion').textContent=item.q; document.querySelector('#testFeedback').textContent=''; document.querySelector('#testFeedback').className='feedback'; document.querySelector('#nextQuestion').hidden=true;
    const options=document.querySelector('#testOptions'); options.innerHTML=''; shuffledOptions(item).forEach((option,i)=>{const b=document.createElement('button');b.className='test-option';b.dataset.correct=String(option.correct);b.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>${option.answer}</span>`;b.addEventListener('click',()=>answerTest(option.correct,b));options.appendChild(b);});
  }
  function answerTest(ok,button){
    if(answered)return; answered=true; const item=questions[testIndex]; if(ok)testScore++; document.querySelector('#score').textContent=testScore; document.querySelectorAll('.test-option').forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct');else if(b===button)b.classList.add('incorrect');}); const fb=document.querySelector('#testFeedback');fb.className=`feedback ${ok?'success':'error'}`;fb.textContent=`${ok?'Richtig.':'Noch nicht.'} ${item.why}`;document.querySelector('#nextQuestion').hidden=false;
  }
  function finishTest(){
    document.querySelector('#testCard').hidden=true;document.querySelector('#testProgressBar').style.width='100%';document.querySelector('#testCounter').textContent='Test beendet';const result=document.querySelector('#testResult');result.hidden=false;document.querySelector('#resultScore').textContent=`${testScore}/${questions.length}`;const passed=testScore>=6;document.querySelector('#resultTitle').textContent=passed?'Sicheres Fundament!':'Fast da – übe gezielt weiter';document.querySelector('#resultText').textContent=passed?'Du kannst die zentralen Zusammenhänge erklären und auf neue Situationen übertragen.':'Wiederhole besonders die Rückmeldungen zu deinen falschen Antworten und starte den Test danach erneut.';state.bestScore=Math.max(state.bestScore||0,testScore);if(passed)complete('test');else save();
  }
  document.querySelector('#nextQuestion').addEventListener('click',()=>{testIndex++;testIndex<questions.length?renderQuestion():finishTest();});
  document.querySelector('#restartTest').addEventListener('click',()=>{testIndex=0;testScore=0;document.querySelector('#score').textContent='0';document.querySelector('#testCard').hidden=false;document.querySelector('#testResult').hidden=true;renderQuestion();}); renderQuestion();

  document.querySelector('#resetProgress').addEventListener('click',()=>{if(confirm('Möchtest du den gespeicherten Lernfortschritt wirklich löschen?')){localStorage.removeItem(STORAGE_KEY);location.reload();}});
  updateProgress();
  if (state.current && document.querySelector(`#${state.current}`)) showModule(state.current, false);
})();
