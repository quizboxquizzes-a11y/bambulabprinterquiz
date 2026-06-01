let currentQuestionIndex = 0;
let userSelections = { max_budget: 3000 }; 
let historyStack = [];
let temporarySelection = null;
let finalRankedMatches = [];

// Advanced Feature Trackers
let currentCurrency = 'GBP';
let currencySymbols = { GBP: '£', USD: '$', EUR: '€' };
let currencyRates = { GBP: 1.0, USD: 1.28, EUR: 1.18 };
let budgetIsStrict = false;
let markedModelCompareList = [];

const printerModels = [
    { name: "A1 mini", form: "open", mat: "basic", size: "small", ams: "no", laser: "no", nozzle_setup: "1", price: 149, desc: "Ultra-quiet entry space-saver. Operates a highly functional single active extrusion nozzle setup." },
    { name: "A1 mini AMS 2 pro combo", form: "open", mat: "basic", size: "small", ams: "yes", laser: "no", nozzle_setup: "1", price: 259, desc: "The entry 4-colour printing setup feeding systematically into a single active hotend assembly." },
    { name: "A1", form: "open", mat: "basic", size: "standard", ams: "no", laser: "no", nozzle_setup: "1", price: 219, desc: "Full standard size open bed-slinger running on a durable 1-nozzle system configuration." },
    { name: "A1 AMS 2 pro combo", form: "open", mat: "basic", size: "standard", ams: "yes", laser: "no", nozzle_setup: "1", price: 319, desc: "Highly popular multi-material household machine utilizing a single nozzle split-feed layout." },
    { name: "P1P", form: "open-box", mat: "basic", size: "standard", ams: "no", laser: "no", nozzle_setup: "1", price: 538, desc: "High-speed core frame workhorse utilizing a rigid 1-nozzle core architecture layout." },
    { name: "P1S", form: "enclosed", mat: "advanced", size: "standard", ams: "no", laser: "no", nozzle_setup: "1", price: 339, desc: "Fully enclosed chassis setup running on a standard stable 1-nozzle high temperature block." },
    { name: "P1S AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "no", nozzle_setup: "1", price: 479, desc: "The iconic value multi-colour platform feeding 4 separate spools to a single nozzle." },
    { name: "P2S", form: "enclosed", mat: "advanced", size: "standard", ams: "no", laser: "no", nozzle_setup: "1", price: 479, desc: "Refined mid-tier box layout keeping an advanced, reliable single nozzle configuration toolhead." },
    { name: "P2S AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "no", nozzle_setup: "1", price: 699, desc: "Next-generation mid-range favorite with multi-filament capabilities feeding into 1 nozzle." },
    { name: "X1-Carbon", form: "enclosed", mat: "advanced", size: "standard", ams: "no", laser: "no", nozzle_setup: "1", price: 1179, desc: "Premium flagship workstation with AI monitoring and standard 1-nozzle toolhead layout." },
    { name: "X1-Carbon AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "no", nozzle_setup: "1", price: 1439, desc: "The professional workspace standard processing multi-filament feeds through a single nozzle." },
    { name: "X1E AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "no", nozzle_setup: "1", price: 1111, desc: "Enterprise machine adding an actively heated print house around its high-temp 1-nozzle system." },
    { name: "X2D", form: "enclosed", mat: "advanced", size: "large", ams: "no", laser: "no", nozzle_setup: "2", price: 569, desc: "Next-gen flagship scaled gantry platform introducing a dual independent nozzle system." },
    { name: "X2D AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "no", nozzle_setup: "2", price: 769, desc: "Flagship large-format printer combining dual-nozzle options with automated material feeding boxes." },
    { name: "H2S Standard", form: "enclosed", mat: "advanced", size: "standard", ams: "no", laser: "no", nozzle_setup: "2", price: 999, desc: "High-speed enclosed printer setup engineering an advanced dual independent nozzle assembly toolhead." },
    { name: "H2S AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "no", nozzle_setup: "2", price: 1199, desc: "Enclosed performance printing carrying a dual-nozzle system and heated material switcher." },
    { name: "H2S Laser Full AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "standard", ams: "yes", laser: "yes", nozzle_setup: "2", price: 1799, desc: "Complete multi-material package featuring dual structural print nozzles alongside a dedicated laser unit." },
    { name: "H2D Standard", form: "enclosed", mat: "advanced", size: "large", ams: "no", laser: "no", nozzle_setup: "2", price: 1449, desc: "Spacious enclosed workspace built with a dual independent nozzle layout for engineering scaling." },
    { name: "H2D AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "no", nozzle_setup: "2", price: 1649, desc: "Combines heavy industrial volume capacity with dual independent print nozzles and heating automation." },
    { name: "H2D Laser Combo", form: "enclosed", mat: "advanced", size: "large", ams: "no", laser: "yes", nozzle_setup: "2", price: 2149, desc: "Large-format platform matching a 2-nozzle plastic extrusion structure with precision laser units." },
    { name: "H2D Pro AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "no", nozzle_setup: "2", price: 1769, desc: "Upgraded luxury hardware specifications running a premier dual independent nozzle configuration." },
    { name: "H2C Vortek AMS 2 pro combo", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "no", nozzle_setup: "changing", price: 1999, desc: "Premium industrial mechanics featuring the automated dynamic robotic Vortek hotend changer layout." },
    { name: "H2C Laser Full AMS 2 pro combo (10W)", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "yes", nozzle_setup: "changing", price: 2499, desc: "Industrial build body loaded with automated changing nozzles, multi-colour feeding, and a 10W laser unit." },
    { name: "H2C Laser Full AMS 2 pro combo (40W)", form: "enclosed", mat: "advanced", size: "large", ams: "yes", laser: "yes", nozzle_setup: "changing", price: 2999, desc: "The ultimate industrial workshop master choice utilizing automated changing nozzle carousels and a 40W cutting laser." }
];

const questions = [
    {
        key: "max_budget",
        text: "What is your maximum budget?",
        explain: "Set your highest budget threshold. We will mathematically score and prioritize configurations you can afford.",
        isSlider: true,
        min: 100, max: 3000, step: 50
    },
    {
        key: "form_factor",
        text: "What style of printer frame do you prefer?",
        explain: "Open printers are lightweight and economical. Enclosed architectures isolate thermal currents for advanced engineering filaments.",
        options: [
            { text: "Open Frame Bed-Slinger", icon: "fa-arrows-left-right", hint: "Simple gantry, accessible base. Great for standard household objects.", value: "open" },
            { text: "Open-Sided Fast Box", icon: "fa-border-all", hint: "Rigid frame engineered to achieve velocity with non-warp everyday filaments.", value: "open-box" },
            { text: "Fully Enclosed Box", icon: "fa-cube", hint: "Maintains optimal internal temperatures while muffling operating noise.", value: "enclosed" }
        ]
    },
    {
        key: "materials",
        text: "What kind of plastic materials will you use?",
        explain: "Everyday plastics run seamlessly on any machine layout. High-performance fibers require structural enclosure stabilization.",
        options: [
            { text: "Standard Everyday Materials", icon: "fa-leaf", hint: "PLA, PETG, flexible TPU. Perfect for visual prototypes, toys, and custom mounts.", value: "basic" },
            { text: "Advanced Engineering Filaments", icon: "fa-flask", hint: "ABS, ASA, Nylon, or Carbon Fiber blends. High-strength structural parts.", value: "advanced" }
        ]
    },
    {
        key: "size_need",
        text: "How big are the objects you want to make?",
        explain: "Scale selection matches component targets. Smaller form factors reduce desk footprints; larger volumes support multi-panel arrays.",
        options: [
            { text: "Small (Up to 180mm area)", icon: "fa-compress", hint: "Ultra-compact footprint. Best for custom jewelry, gears, and figures.", value: "small" },
            { text: "Standard (Around 256mm area)", icon: "fa-expand", hint: "The regular industry size standard. Fits most structural community models.", value: "standard" },
            { text: "Large-Scale (Over 300mm area)", icon: "fa-maximize", hint: "Industrial volume capacity for full-scale helmet designs and thick casings.", value: "large" }
        ]
    },
    {
        key: "nozzle_config",
        text: "How many physical nozzles does the printer have built-in?",
        explain: "Isolate precise machine toolhead counts to match your production goals.",
        options: [
            { text: "1 Nozzle Built-In", icon: "fa-square", hint: "Single active filament extrusion block path (A1, A1 mini, P2S, P-Series).", value: "1" },
            { text: "2 Nozzles Built-In (Dual Setup)", icon: "fa-table-columns", hint: "Two independent gantry nozzles executing complex pathing (X2D, H2D series).", value: "2" },
            { text: "Automated Changing Nozzles System", icon: "fa-arrows-spin", hint: "Robotic carousel swaps hotends mid-print dynamically (H2C series).", value: "changing" }
        ]
    },
    {
        key: "ams_needed",
        text: "Do you want automatic multi-colour printing?",
        explain: "An automated multi-material feeder actively splices up to 4 distinct filament lines concurrently during live print cycles.",
        options: [
            { text: "Yes, multi-colour capabilities", icon: "fa-layer-group", hint: "Swaps active filament colors smoothly to paint designs automatically.", value: "yes" },
            { text: "No, standard single colour is fine", icon: "fa-scroll", hint: "Prints one material reel at a time. Drastically lowers systemic complexity.", value: "no" }
        ]
    },
    {
        key: "laser_needed",
        text: "Do you need laser engraving or cutting capabilities?",
        explain: "Isolate specialized processing paths. Standard handles plastic extrusion; advanced hybrid toolheads cut wood or engrave metals.",
        options: [
            { text: "Just standard 3D printing", icon: "fa-microchip", hint: "Pure plastic layer manufacturing. Best choice if you do not work with wood/leather.", value: "no" },
            { text: "Laser Cutting & Engraving (10W)", icon: "fa-bolt", hint: "Integrates an adaptable 10W optic laser system for clean detail lines.", value: "yes" },
            { text: "Laser Cutting & Engraving (40W)", icon: "fa-fire", hint: "High-density 40W industrial processing rig for slicing thick stock material.", value: "40w" }
        ]
    }
];

function toggleTheme() { document.body.classList.toggle('dark-theme'); }

function changeCurrency(val) {
    currentCurrency = val;
    if (document.getElementById('quiz-screen').classList.contains('active')) {
        renderQuestion();
    } else if (document.getElementById('results-screen').classList.contains('active')) {
        calculateResult();
    }
}

function toggleBudgetStrictness(checked) {
    budgetIsStrict = !checked; 
    updateSidebarAndStatus();
    if (document.getElementById('results-screen').classList.contains('active')) {
        calculateResult();
    }
}

function formatPrice(gbpAmt) {
    let sym = currencySymbols[currentCurrency];
    let converted = Math.round(gbpAmt * currencyRates[currentCurrency]);
    return `${sym}${converted}`;
}

window.onload = function() {
    const saved = localStorage.getItem('bambu_h_selections');
    const savedIndex = localStorage.getItem('bambu_h_index');
    if (saved && savedIndex && parseInt(savedIndex) > 0) {
        document.getElementById('resume-container').innerHTML = `
            <div class="resume-banner">
                <span>In-progress evaluation structure discovered.</span>
                <button class="btn" style="width:auto; padding: 6px 14px; font-size:12px;" onclick="resumeQuiz()">Restore Session</button>
            </div>`;
    }
};

function startQuiz(isResume = false) {
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    document.getElementById('sidebar').classList.add('visible');
    
    if (!isResume) {
        currentQuestionIndex = 0;
        userSelections = { max_budget: 3000 };
        historyStack = [];
        localStorage.clear();
    } else {
        userSelections = JSON.parse(localStorage.getItem('bambu_h_selections') || '{"max_budget":3000}');
        currentQuestionIndex = parseInt(localStorage.getItem('bambu_h_index') || '0');
        historyStack = JSON.parse(localStorage.getItem('bambu_h_history') || '[]');
    }
    renderQuestion();
}

function resumeQuiz() { startQuiz(true); }
function toggleExplanation() {
    const pane = document.getElementById('explain-modal');
    pane.style.display = (pane.style.display === 'block') ? 'none' : 'block';
}

function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
        executeSuspenseLoaderPause();
        return;
    }

    const q = questions[currentQuestionIndex];
    
    // Dynamic Background Gradient Shifts
    const bgElement = document.getElementById('ambient-bg');
    if(currentQuestionIndex % 3 === 0) {
        bgElement.style.filter = "hue-rotate(45deg)";
    } else if (currentQuestionIndex % 3 === 1) {
        bgElement.style.filter = "hue-rotate(180deg)";
    } else {
        bgElement.style.filter = "hue-rotate(270deg)";
    }

    document.getElementById('question-text').innerText = q.text;
    document.getElementById('explain-modal').innerText = q.explain;
    document.getElementById('explain-modal').style.display = 'none';
    document.getElementById('back-btn').style.visibility = historyStack.length > 0 ? 'visible' : 'hidden';
    document.getElementById('next-btn').disabled = true;
    document.getElementById('warning-box').style.display = 'none';
    
    const optionsContainer = document.getElementById('options-container');
    const sliderContainer = document.getElementById('slider-container');
    optionsContainer.innerHTML = '';
    sliderContainer.innerHTML = '';

    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress').style.width = `${progressPercent}%`;

    updateSidebarAndStatus();

    if (q.isSlider) {
        optionsContainer.style.display = 'none';
        sliderContainer.style.display = 'block';
        document.getElementById('next-btn').disabled = false;
        
        temporarySelection = userSelections[q.key] || q.max;
        const readout = document.createElement('div');
        readout.className = 'slider-readout';
        readout.innerText = formatPrice(temporarySelection);
        
        const range = document.createElement('input');
        range.type = 'range';
        range.className = 'range-slider';
        range.min = q.min; range.max = q.max; range.step = q.step;
        range.value = temporarySelection;
        
        range.oninput = (e) => {
            temporarySelection = parseInt(e.target.value);
            readout.innerText = formatPrice(temporarySelection);
            triggerContextValidation(q.key, temporarySelection);
        };
        sliderContainer.appendChild(readout);
        sliderContainer.appendChild(range);
    } else {
        optionsContainer.style.display = 'flex';
        sliderContainer.style.display = 'none';

        q.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            if(userSelections[q.key] === opt.value) {
                card.classList.add('selected');
                temporarySelection = opt.value;
                document.getElementById('next-btn').disabled = false;
            }
            
            // Premium Added Visual: Radio Circle Element
            const radioCircle = document.createElement('div');
            radioCircle.className = 'custom-radio-circle';
            card.appendChild(radioCircle);

            const icon = document.createElement('i');
            icon.className = `fa-solid ${opt.icon} card-icon`;
            card.appendChild(icon);

            const body = document.createElement('div');
            body.className = 'card-body';
            const titleText = document.createElement('div');
            titleText.innerText = opt.text;
            titleText.style.fontWeight = "600";
            body.appendChild(titleText);
            
            const hintSpan = document.createElement('span');
            hintSpan.className = 'hint';
            hintSpan.innerText = opt.hint;
            body.appendChild(hintSpan);
            card.appendChild(body);
            
            card.onclick = () => {
                document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                temporarySelection = opt.value;
                document.getElementById('next-btn').disabled = false;
                triggerContextValidation(q.key, opt.value);
            };
            optionsContainer.appendChild(card);
        });
    }
}

function triggerContextValidation(currentKey, currentValue) {
    const warnBox = document.getElementById('warning-box');
    const warnText = document.getElementById('warning-text');
    warnBox.style.display = 'none';

    if (currentKey === 'materials' && currentValue === 'advanced' && userSelections['form_factor'] === 'open') {
        warnText.innerText = "Notice: Open gantries shed thermal currents rapidly. Advanced materials risk layer separation without enclosing modifications.";
        warnBox.style.display = 'flex';
    }
    if (currentKey === 'nozzle_config' && currentValue === 'changing' && userSelections['max_budget'] < 1600) {
        warnText.innerText = "Financial Alert: Automated changing nozzle mechanisms are specific to high-end industrial systems.";
        warnBox.style.display = 'flex';
    }
}

function goNext() {
    if (temporarySelection === null) return;
    const q = questions[currentQuestionIndex];
    userSelections[q.key] = temporarySelection;
    historyStack.push(currentQuestionIndex);
    currentQuestionIndex++;
    
    localStorage.setItem('bambu_h_selections', JSON.stringify(userSelections));
    localStorage.setItem('bambu_h_index', currentQuestionIndex);
    localStorage.setItem('bambu_h_history', JSON.stringify(historyStack));
    renderQuestion();
}

function goBack() {
    if (historyStack.length === 0) return;
    currentQuestionIndex = historyStack.pop();
    renderQuestion();
}

function getRankedMatches() {
    const budgetCap = userSelections.max_budget || 3000;
    const f = userSelections.form_factor;
    const m = userSelections.materials;
    const s = userSelections.size_need;
    const nc = userSelections.nozzle_config;
    const ams = userSelections.ams_needed;
    const laser = userSelections.laser_needed;

    return printerModels.map(model => {
        let score = 0;
        let totalWeights = 0;
        
        const matrixPoints = { form: f, mat: m, size: s, nozzle_setup: nc, ams: ams, laser: laser };
        
        Object.keys(matrixPoints).forEach(key => {
            if (matrixPoints[key] !== undefined) { totalWeights++; }
            
            if (key === 'laser') {
                if (matrixPoints[key] === '40w' && model.name.includes('40W')) score++;
                else if (matrixPoints[key] === 'yes' && model.laser === 'yes' && !model.name.includes('40W')) score++;
                else if (matrixPoints[key] === 'no' && model.laser === 'no') score++;
            } else {
                if (model[key] === matrixPoints[key]) score++;
            }
        });

        let calculatedPercentage = totalWeights > 0 ? Math.round((score / totalWeights) * 100) : 100;
        
        // Strict Budget Logic vs Stretch logic control
        if (model.price > budgetCap) {
            if (budgetIsStrict) {
                calculatedPercentage = 0; 
            } else {
                calculatedPercentage = Math.max(0, calculatedPercentage - 45); 
            }
        }
        return { ...model, pct: calculatedPercentage };
    }).filter(model => model.pct > 0).sort((x, y) => y.pct - x.pct);
}

function updateSidebarAndStatus() {
    const statusBox = document.getElementById('status-box');
    const s = userSelections.size_need;
    
    if (s === "large") statusBox.innerText = "Filtering heavy-duty scale industrial platforms...";
    else if (s === "small") statusBox.innerText = "Isolating high-density micro workspace formats...";
    else statusBox.innerText = "Re-indexing sorting scores dynamically...";

    const ranked = getRankedMatches();
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';
    
    ranked.slice(0, 5).forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = `leaderboard-row ${idx === 0 ? 'top-tier' : ''}`;
        row.innerHTML = `<span>${idx === 0 ? '👑 ' : `${idx + 1}. `}${item.name}</span><span class="row-pct">${item.pct}%</span>`;
        leaderboard.appendChild(row);
    });
}

function executeSuspenseLoaderPause() {
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('loading-screen').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        calculateResult();
    }, 2200); 
}

function calculateResult() {
    document.getElementById('results-screen').classList.add('active');
    document.getElementById('sidebar').classList.remove('visible');
    localStorage.clear();

    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 85, origin: { y: 0.6 } });
    }

    finalRankedMatches = getRankedMatches();
    markedModelCompareList = [];
    updateCompareActionBar();

    const container = document.getElementById('results-list-container');
    container.innerHTML = '';

    finalRankedMatches.slice(0, 3).forEach((printer, idx) => {
        const isBest = idx === 0;
        const card = document.createElement('div');
        card.className = `result-item-card ${isBest ? 'best-match' : ''}`;

        // Advanced Feature: Multicard Comparison Checklist Selection
        const selectorHolder = document.createElement('div');
        selectorHolder.className = 'card-select-checkbox-holder';
        
        const checkInput = document.createElement('input');
        checkInput.type = 'checkbox';
        checkInput.id = `compare-check-${idx}`;
        checkInput.onchange = (e) => toggleModelComparisonMark(printer, e.target.checked);
        
        const checkLabel = document.createElement('label');
        checkLabel.htmlFor = `compare-check-${idx}`;
        checkLabel.innerText = " Include in custom specification table comparison";
        
        selectorHolder.appendChild(checkInput);
        selectorHolder.appendChild(checkLabel);
        card.appendChild(selectorHolder);

        const badge = document.createElement('div');
        badge.className = `result-badge ${isBest ? 'badge-primary' : 'badge-secondary'}`;
        badge.innerText = isBest ? `🏆 Primary Matching Vector - ${printer.pct}% Fit` : `Alternative Tier Match #${idx + 1} - ${printer.pct}%`;
        card.appendChild(badge);

        const title = document.createElement('div');
        title.className = 'result-item-title';
        title.innerText = `${printer.name} (${formatPrice(printer.price)})`;
        card.appendChild(title);

        const description = document.createElement('div');
        description.style.fontSize = '14px'; description.style.opacity = '0.85'; description.style.lineHeight = '1.55';
        description.innerText = printer.desc;
        card.appendChild(description);

        const actionBlock = document.createElement('div');
        actionBlock.className = 'action-block';
        
        const btnSpec = document.createElement('button');
        btnSpec.className = "btn";
        btnSpec.innerHTML = "<i class='fa-solid fa-list-check'></i> Isolation Sheet Spec";
        btnSpec.onclick = () => openSingleSpecificationSheet(printer);
        actionBlock.appendChild(btnSpec);
        card.appendChild(actionBlock);

        const matrix = document.createElement('div');
        matrix.className = 'matrix-container';
        
        const capabilities = [
            { name: "Everyday Plastics", ok: true },
            { name: "Enclosed Chassis", ok: printer.form === "enclosed" },
            { name: "Multi-Material Array", ok: printer.ams === "yes" },
            { name: "Affordability Vector", ok: printer.price <= (userSelections.max_budget || 3000) }
        ];

        capabilities.forEach(cap => {
            const item = document.createElement('div');
            item.className = `matrix-item ${cap.ok ? 'mat-pass' : 'mat-fail'}`;
            item.innerHTML = `<span>${cap.name}</span> <span>${cap.ok ? '✓' : '✕'}</span>`;
            matrix.appendChild(item);
        });
        card.appendChild(matrix);
        container.appendChild(card);
    });

    renderFilamentFlushCalculatorWidget();
}

function toggleModelComparisonMark(printer, isChecked) {
    if(isChecked) {
        markedModelCompareList.push(printer);
    } else {
        markedModelCompareList = markedModelCompareList.filter(m => m.name !== printer.name);
    }
    updateCompareActionBar();
}

function updateCompareActionBar() {
    const btn = document.getElementById('compare-selected-btn');
    const countDisplay = document.getElementById('compare-count');
    countDisplay.innerText = markedModelCompareList.length;
    btn.disabled = markedModelCompareList.length < 2;
}

// Advanced Feature: Real-time Multi-Material Filament Waste & Flush Calculator Widget
function renderFilamentFlushCalculatorWidget() {
    const calcContainer = document.getElementById('filament-calc-container');
    calcContainer.innerHTML = '';

    const carriesAMS = finalRankedMatches.length > 0 && finalRankedMatches[0].ams === 'yes';
    if (!carriesAMS) return; 

    const widgetBox = document.createElement('div');
    widgetBox.className = 'flush-calc-card';
    widgetBox.innerHTML = `
        <h3 style="margin:0 0 6px 0; font-size:16px;"><i class="fa-solid fa-calculator" style="color:var(--selected-border);"></i> Intelligent AMS Flush Projection</h3>
        <p style="margin:0; font-size:13px; opacity:0.8; line-height:1.4;">Based on your premium selection of an <strong>AMS 2 pro combo</strong> machine ecosystem framework, your typical transition waste factor indices calculate as:</p>
        <div class="calc-grid">
            <div class="calc-metric-box">
                <div class="calc-metric-num">~250-400</div>
                <div style="font-size:11px; font-weight:600; opacity:0.7; margin-top:4px;">Average Flushes Per Multi-Color Print</div>
            </div>
            <div class="calc-metric-box">
                <div class="calc-metric-num" style="color:var(--tag-fail-text);">£0.04 - £0.09</div>
                <div style="font-size:11px; font-weight:600; opacity:0.7; margin-top:4px;">Purge Cost Deviation Factor Per Swap</div>
            </div>
        </div>
    `;
    calcContainer.appendChild(widgetBox);
}

function openSingleSpecificationSheet(printer) {
    markedModelCompareList = [printer, finalRankedMatches[0]]; 
    openMultiComparisonModal(true);
}

// Advanced Feature: Dynamic Multi-Column Processing Matrix with Relative Build Area Cubes
function openMultiComparisonModal(isSingleView = false) {
    if(markedModelCompareList.length === 0) return;
    
    document.getElementById('compare-title').innerText = isSingleView ? `${markedModelCompareList[0].name} Specification Sheet` : "Multi-Chassis Matrix Check View";
    
    // Dynamic Scale Volume Box Visualizer Logic
    const visualizerContainer = document.getElementById('visualizer-box-container');
    visualizerContainer.innerHTML = '';
    
    let sizeDimensions = { small: 40, standard: 70, large: 100 };

    markedModelCompareList.forEach(m => {
        const cubeWrapper = document.createElement('div');
        cubeWrapper.className = 'v-box-wrapper';
        
        const cube = document.createElement('div');
        cube.className = 'v-cube';
        let hValue = sizeDimensions[m.size];
        cube.style.height = `${hValue}px`;
        cube.style.width = `${hValue}px`;
        
        const label = document.createElement('span');
        label.style.marginTop = '6px';
        label.innerText = `${m.name.split(' ')[0]} (${m.size})`;

        cubeWrapper.appendChild(cube);
        cubeWrapper.appendChild(label);
        visualizerContainer.appendChild(cubeWrapper);
    });

    const table = document.getElementById('compare-table-data');
    
    let headerRow = `<tr><th>Hardware Feature Axis</th>`;
    markedModelCompareList.forEach(m => { headerRow += `<th>${m.name}</th>`; });
    headerRow += `</tr>`;

    let priceRow = `<tr><td>Standard MSRP</td>`;
    markedModelCompareList.forEach(m => { priceRow += `<td><strong>${formatPrice(m.price)}</strong></td>`; });
    priceRow += `</tr>`;

    let chamberRow = `<tr><td>Build Chamber Scale</td>`;
    markedModelCompareList.forEach(m => { chamberRow += `<td>${m.size.toUpperCase()}</td>`; });
    chamberRow += `</tr>`;

    let enclosedRow = `<tr><td>Enclosed Shell Layout</td>`;
    markedModelCompareList.forEach(m => { enclosedRow += `<td>${m.form === 'enclosed' ? 'Yes' : 'No'}</td>`; });
    enclosedRow += `</tr>`;

    let nozzleRow = `<tr><td>Nozzle Configuration</td>`;
    markedModelCompareList.forEach(m => { nozzleRow += `<td>${m.nozzle_setup === 'changing' ? 'Automated Changer' : m.nozzle_setup + ' Fixed'}</td>`; });
    nozzleRow += `</tr>`;

    let amsRow = `<tr><td>Multi-Filament Feeding</td>`;
    markedModelCompareList.forEach(m => { amsRow += `<td>${m.ams === 'yes' ? 'AMS 2 pro combo' : 'None'}</td>`; });
    amsRow += `</tr>`;

    table.innerHTML = headerRow + priceRow + chamberRow + enclosedRow + nozzleRow + amsRow;
    document.getElementById('compare-modal').style.display = 'flex';
}

function closeCompareModal() { document.getElementById('compare-modal').style.display = 'none'; }

function copyMarkdownReport() {
    if (!finalRankedMatches.length) return;
    let report = `### 🖨️ Bambu Lab Ecosystem Hardware Assessment Report\n`;
    finalRankedMatches.slice(0, 3).forEach((p, idx) => {
        report += `${idx + 1}. **${p.name}** (${formatPrice(p.price)}) - ${p.pct}% Match\n   - ${p.desc}\n`;
    });
    navigator.clipboard.writeText(report);
    alert("Formatted markdown report successfully synchronized to system clipboard.");
}

function resetQuiz() {
    document.getElementById('results-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.add('active');
    document.getElementById('resume-container').innerHTML = '';
    localStorage.clear();
}
