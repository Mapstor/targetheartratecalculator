/* ============================================
   TARGET HEART RATE CALCULATOR - JAVASCRIPT
   ============================================ */

// Heart Rate Zone Definitions
const HR_ZONES = [
  { name: 'Warm-up', min: 0.50, max: 0.60, color: 'warmup', desc: 'Recovery, easy activity' },
  { name: 'Fat Burn', min: 0.60, max: 0.70, color: 'fatburn', desc: 'Weight loss, light cardio' },
  { name: 'Cardio', min: 0.70, max: 0.80, color: 'cardio', desc: 'Aerobic fitness, endurance' },
  { name: 'Hard', min: 0.80, max: 0.90, color: 'hard', desc: 'Performance training' },
  { name: 'Peak', min: 0.90, max: 1.00, color: 'peak', desc: 'Maximum effort, sprints' }
];

// Max HR Formulas
const MAX_HR_FORMULAS = {
  standard: { name: 'Standard (220-age)', calc: (age) => 220 - age },
  tanaka: { name: 'Tanaka (more accurate)', calc: (age) => 208 - (0.7 * age) },
  gulati: { name: 'Gulati (women)', calc: (age) => 206 - (0.88 * age) },
  hunt: { name: 'HUNT (fit adults)', calc: (age) => 211 - (0.64 * age) }
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
  setupTabs();
  setupCalculateButtons();
  setupFAQ();
  setupMobileNav();
}

function setupTabs() {
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${tabId}`).classList.add('active');
    });
  });
}

function setupCalculateButtons() {
  document.getElementById('calc-maxhr-btn')?.addEventListener('click', calculateMaxHR);
  document.getElementById('calc-target-btn')?.addEventListener('click', calculateTargetHR);
  document.getElementById('calc-zones-btn')?.addEventListener('click', calculateZones);
  document.getElementById('calc-karvonen-btn')?.addEventListener('click', calculateKarvonen);
}

// ============================================
// TAB 1: MAX HEART RATE CALCULATOR
// ============================================
function calculateMaxHR() {
  const age = parseInt(document.getElementById('maxhr-age')?.value) || 30;
  const gender = document.querySelector('input[name="maxhr-gender"]:checked')?.value || 'any';
  
  if (age < 10 || age > 100) {
    alert('Please enter a valid age (10-100)');
    return;
  }
  
  // Calculate using all formulas
  const results = {};
  for (const [key, formula] of Object.entries(MAX_HR_FORMULAS)) {
    results[key] = Math.round(formula.calc(age));
  }
  
  // Primary result: Use Tanaka for general, Gulati for women
  let primaryFormula = 'tanaka';
  if (gender === 'female') {
    primaryFormula = 'gulati';
  }
  
  displayMaxHRResults({
    age,
    gender,
    primary: results[primaryFormula],
    primaryName: MAX_HR_FORMULAS[primaryFormula].name,
    all: results
  });
}

function displayMaxHRResults(results) {
  const section = document.getElementById('maxhr-results');
  const report = document.getElementById('maxhr-report');
  if (!section) return;

  document.getElementById('maxhr-value').textContent = results.primary;
  document.getElementById('maxhr-formula-used').textContent = results.primaryName;

  section.classList.add('visible');

  // Show enhanced report
  if (report) {
    report.style.display = 'block';

    // Input summary
    document.getElementById('maxhr-input-age').textContent = results.age;
    document.getElementById('maxhr-input-gender').textContent = results.gender === 'female' ? 'Female' : results.gender === 'male' ? 'Male' : 'Not specified';

    // Bar chart (scale relative to max value)
    const maxVal = Math.max(results.all.standard, results.all.tanaka, results.all.gulati, results.all.hunt);
    const minVal = Math.min(results.all.standard, results.all.tanaka, results.all.gulati, results.all.hunt);
    const scale = (val) => ((val - minVal + 20) / (maxVal - minVal + 20) * 60 + 40);

    document.getElementById('bar-standard').style.width = scale(results.all.standard) + '%';
    document.getElementById('bar-tanaka').style.width = scale(results.all.tanaka) + '%';
    document.getElementById('bar-gulati').style.width = scale(results.all.gulati) + '%';
    document.getElementById('bar-hunt').style.width = scale(results.all.hunt) + '%';

    document.getElementById('bar-val-standard').textContent = results.all.standard + ' BPM';
    document.getElementById('bar-val-tanaka').textContent = results.all.tanaka + ' BPM';
    document.getElementById('bar-val-gulati').textContent = results.all.gulati + ' BPM';
    document.getElementById('bar-val-hunt').textContent = results.all.hunt + ' BPM';

    // Training zones table
    const maxHR = results.primary;
    document.getElementById('zone1-range').textContent = Math.round(maxHR * 0.5) + '-' + Math.round(maxHR * 0.6) + ' BPM';
    document.getElementById('zone2-range').textContent = Math.round(maxHR * 0.6) + '-' + Math.round(maxHR * 0.7) + ' BPM';
    document.getElementById('zone3-range').textContent = Math.round(maxHR * 0.7) + '-' + Math.round(maxHR * 0.8) + ' BPM';
    document.getElementById('zone4-range').textContent = Math.round(maxHR * 0.8) + '-' + Math.round(maxHR * 0.9) + ' BPM';
    document.getElementById('zone5-range').textContent = Math.round(maxHR * 0.9) + '-' + maxHR + ' BPM';

    // Interpretation
    let interpText = `Based on your age of ${results.age}, your estimated maximum heart rate is ${results.primary} BPM using the ${results.primaryName}. `;
    interpText += `Individual variation means your actual max HR could be 10-20 BPM higher or lower. `;
    interpText += `For the most accurate measurement, consider a supervised maximal exercise test.`;
    document.getElementById('maxhr-interpretation-text').textContent = interpText;
  }
}

// ============================================
// TAB 2: TARGET HEART RATE CALCULATOR
// ============================================
function calculateTargetHR() {
  const age = parseInt(document.getElementById('target-age')?.value) || 30;
  const goal = document.querySelector('input[name="target-goal"]:checked')?.value || 'cardio';
  const useCustomMax = document.getElementById('target-custom-max')?.value;
  
  let maxHR;
  if (useCustomMax && parseInt(useCustomMax) > 0) {
    maxHR = parseInt(useCustomMax);
  } else {
    maxHR = Math.round(208 - (0.7 * age)); // Tanaka formula
  }
  
  // Get zone based on goal
  let targetZone;
  switch (goal) {
    case 'fatburn':
      targetZone = { min: 0.60, max: 0.70, name: 'Fat Burn Zone' };
      break;
    case 'cardio':
      targetZone = { min: 0.70, max: 0.80, name: 'Cardio Zone' };
      break;
    case 'peak':
      targetZone = { min: 0.80, max: 0.90, name: 'Performance Zone' };
      break;
    default:
      targetZone = { min: 0.70, max: 0.80, name: 'Cardio Zone' };
  }
  
  const targetMin = Math.round(maxHR * targetZone.min);
  const targetMax = Math.round(maxHR * targetZone.max);
  
  displayTargetHRResults({
    maxHR,
    targetMin,
    targetMax,
    zoneName: targetZone.name,
    zonePercent: Math.round(targetZone.min * 100) + '-' + Math.round(targetZone.max * 100) + '%',
    age
  });
  
  // Generate visual gauge
  generateHRGauge(maxHR, targetMin, targetMax);
}

function displayTargetHRResults(results) {
  const section = document.getElementById('target-results');
  const report = document.getElementById('target-report');
  if (!section) return;

  document.getElementById('target-range').textContent = results.targetMin + ' - ' + results.targetMax;
  document.getElementById('target-zone-name').textContent = results.zoneName;

  section.classList.add('visible');

  // Show enhanced report
  if (report) {
    report.style.display = 'block';

    // Input summary
    document.getElementById('target-input-age').textContent = results.age;
    document.getElementById('target-input-goal').textContent = results.zoneName.replace(' Zone', '');
    document.getElementById('target-input-maxhr').textContent = results.maxHR + ' BPM';

    // Key results table
    document.getElementById('target-tbl-maxhr').textContent = results.maxHR + ' BPM';
    document.getElementById('target-tbl-range').textContent = results.targetMin + '-' + results.targetMax + ' BPM';
    document.getElementById('target-tbl-zone').textContent = results.zoneName + ' (' + results.zonePercent + ')';
    document.getElementById('target-tbl-min').textContent = results.targetMin + ' BPM';
    document.getElementById('target-tbl-max').textContent = results.targetMax + ' BPM';

    // All zones
    const maxHR = results.maxHR;
    document.getElementById('target-z1').textContent = Math.round(maxHR * 0.5) + '-' + Math.round(maxHR * 0.6);
    document.getElementById('target-z2').textContent = Math.round(maxHR * 0.6) + '-' + Math.round(maxHR * 0.7);
    document.getElementById('target-z3').textContent = Math.round(maxHR * 0.7) + '-' + Math.round(maxHR * 0.8);
    document.getElementById('target-z4').textContent = Math.round(maxHR * 0.8) + '-' + Math.round(maxHR * 0.9);
    document.getElementById('target-z5').textContent = Math.round(maxHR * 0.9) + '-' + maxHR;

    // Interpretation based on goal
    let interpText = '';
    if (results.zoneName.includes('Fat Burn')) {
      interpText = `Your fat burn zone (${results.targetMin}-${results.targetMax} BPM) burns a higher percentage of calories from fat. Maintain this heart rate for 30-60 minutes for optimal fat oxidation. This zone is sustainable for longer periods and great for building aerobic base.`;
    } else if (results.zoneName.includes('Cardio')) {
      interpText = `Your cardio zone (${results.targetMin}-${results.targetMax} BPM) improves cardiovascular fitness and endurance. This moderate intensity is ideal for most aerobic workouts. Aim for 20-45 minutes at this intensity to build heart health.`;
    } else if (results.zoneName.includes('Performance')) {
      interpText = `Your performance zone (${results.targetMin}-${results.targetMax} BPM) pushes your anaerobic threshold. This high intensity improves speed and power but is harder to sustain. Use for intervals of 1-10 minutes with recovery periods.`;
    }
    document.getElementById('target-interpretation-text').textContent = interpText;
  }
}

function generateHRGauge(maxHR, targetMin, targetMax) {
  const gauge = document.getElementById('hr-gauge-track');
  if (!gauge) return;
  
  gauge.innerHTML = '';
  
  HR_ZONES.forEach(zone => {
    const segment = document.createElement('div');
    segment.className = 'hr-gauge-segment';
    segment.style.flex = '1';
    segment.style.background = `var(--zone-${zone.color})`;
    segment.textContent = zone.name.split(' ')[0];
    gauge.appendChild(segment);
  });
  
  // Update labels
  document.getElementById('gauge-min').textContent = Math.round(maxHR * 0.5) + ' BPM';
  document.getElementById('gauge-max').textContent = maxHR + ' BPM';
}

// ============================================
// TAB 3: TRAINING ZONES CALCULATOR
// ============================================
function calculateZones() {
  const age = parseInt(document.getElementById('zones-age')?.value) || 30;
  const restingHR = parseInt(document.getElementById('zones-resting')?.value) || 0;
  const useCustomMax = document.getElementById('zones-custom-max')?.value;
  
  let maxHR;
  if (useCustomMax && parseInt(useCustomMax) > 0) {
    maxHR = parseInt(useCustomMax);
  } else {
    maxHR = Math.round(208 - (0.7 * age));
  }
  
  // Calculate zones (using simple % of max, or Karvonen if resting HR provided)
  const useKarvonen = restingHR > 0;
  const hrr = maxHR - restingHR; // Heart Rate Reserve
  
  const zones = HR_ZONES.map(zone => {
    let min, max;
    if (useKarvonen && restingHR > 0) {
      min = Math.round((hrr * zone.min) + restingHR);
      max = Math.round((hrr * zone.max) + restingHR);
    } else {
      min = Math.round(maxHR * zone.min);
      max = Math.round(maxHR * zone.max);
    }
    return { ...zone, minBPM: min, maxBPM: max };
  });
  
  displayZonesResults({
    maxHR,
    restingHR,
    useKarvonen,
    zones
  });
}

function displayZonesResults(results) {
  const section = document.getElementById('zones-results');
  const report = document.getElementById('zones-report');
  if (!section) return;

  document.getElementById('zones-maxhr').textContent = results.maxHR + ' BPM';
  document.getElementById('zones-method').textContent = results.useKarvonen ? 'Karvonen (HRR)' : 'Standard (% Max)';

  const container = document.getElementById('zones-bars');
  container.innerHTML = '';

  results.zones.forEach(zone => {
    const barHtml = `
      <div class="zone-bar">
        <div class="zone-label">${zone.name}</div>
        <div class="zone-track">
          <div class="zone-fill ${zone.color}" style="width: ${(zone.max - zone.min) * 100 + (zone.min * 100)}%">
            ${Math.round(zone.min * 100)}-${Math.round(zone.max * 100)}%
          </div>
        </div>
        <div class="zone-bpm">${zone.minBPM}-${zone.maxBPM}</div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', barHtml);
  });

  section.classList.add('visible');

  // Show enhanced report
  if (report) {
    report.style.display = 'block';

    // Input summary
    const ageInput = document.getElementById('zones-age')?.value || '--';
    document.getElementById('zones-input-age').textContent = ageInput;
    document.getElementById('zones-input-maxhr').textContent = results.maxHR;
    document.getElementById('zones-input-resting').textContent = results.restingHR > 0 ? results.restingHR + ' BPM' : 'Not provided';
    document.getElementById('zones-input-method').textContent = results.useKarvonen ? 'Karvonen (HRR)' : 'Standard (% Max)';

    // Zones table
    results.zones.forEach((zone, i) => {
      const el = document.getElementById('zt-z' + (i + 1));
      if (el) el.textContent = zone.minBPM + '-' + zone.maxBPM + ' BPM';
    });

    // Interpretation
    let interpText = '';
    if (results.useKarvonen) {
      const hrr = results.maxHR - results.restingHR;
      interpText = `Using the Karvonen method with your resting HR of ${results.restingHR} BPM, your Heart Rate Reserve is ${hrr} BPM. This gives you more personalized training zones that account for your fitness level. `;
    } else {
      interpText = `These zones are calculated as percentages of your max HR (${results.maxHR} BPM). For more personalized zones, add your resting heart rate to use the Karvonen method. `;
    }
    interpText += `Most training should occur in Zones 1-2 to build aerobic base. Reserve Zones 4-5 for specific high-intensity workouts.`;
    document.getElementById('zones-interpretation-text').textContent = interpText;
  }
}

// ============================================
// TAB 4: KARVONEN METHOD CALCULATOR
// ============================================
function calculateKarvonen() {
  const age = parseInt(document.getElementById('karv-age')?.value) || 30;
  const restingHR = parseInt(document.getElementById('karv-resting')?.value) || 60;
  const intensityMin = parseInt(document.getElementById('karv-intensity-min')?.value) || 60;
  const intensityMax = parseInt(document.getElementById('karv-intensity-max')?.value) || 80;
  
  if (restingHR < 30 || restingHR > 120) {
    alert('Please enter a valid resting heart rate (30-120 BPM)');
    return;
  }
  
  const maxHR = Math.round(208 - (0.7 * age)); // Tanaka
  const hrr = maxHR - restingHR; // Heart Rate Reserve
  
  // Karvonen formula: Target HR = (HRR × Intensity%) + Resting HR
  const targetMin = Math.round((hrr * (intensityMin / 100)) + restingHR);
  const targetMax = Math.round((hrr * (intensityMax / 100)) + restingHR);
  
  // Compare to simple method
  const simpleMin = Math.round(maxHR * (intensityMin / 100));
  const simpleMax = Math.round(maxHR * (intensityMax / 100));
  
  displayKarvonenResults({
    age,
    maxHR,
    restingHR,
    hrr,
    intensityMin,
    intensityMax,
    targetMin,
    targetMax,
    simpleMin,
    simpleMax
  });
}

function displayKarvonenResults(results) {
  const section = document.getElementById('karvonen-results');
  const report = document.getElementById('karvonen-report');
  if (!section) return;

  document.getElementById('karv-target').textContent = results.targetMin + ' - ' + results.targetMax;
  document.getElementById('karv-intensity-display').textContent = results.intensityMin + '-' + results.intensityMax + '% intensity';

  document.getElementById('karv-maxhr').textContent = results.maxHR + ' BPM';
  document.getElementById('karv-hrr').textContent = results.hrr + ' BPM';
  document.getElementById('karv-resting-display').textContent = results.restingHR + ' BPM';

  section.classList.add('visible');

  // Show enhanced report
  if (report) {
    report.style.display = 'block';

    // Input summary
    document.getElementById('karv-input-age').textContent = results.age;
    document.getElementById('karv-input-resting').textContent = results.restingHR;
    document.getElementById('karv-input-intensity').textContent = results.intensityMin + '-' + results.intensityMax + '%';

    // Key calculations table
    document.getElementById('karv-tbl-maxhr').textContent = results.maxHR + ' BPM';
    document.getElementById('karv-tbl-resting').textContent = results.restingHR + ' BPM';
    document.getElementById('karv-tbl-hrr').textContent = results.hrr + ' BPM';
    document.getElementById('karv-tbl-target').textContent = results.targetMin + '-' + results.targetMax + ' BPM';

    // Method comparison
    document.getElementById('karv-cmp-min').textContent = results.targetMin + ' BPM';
    document.getElementById('karv-cmp-max').textContent = results.targetMax + ' BPM';
    document.getElementById('simple-cmp-min').textContent = results.simpleMin + ' BPM';
    document.getElementById('simple-cmp-max').textContent = results.simpleMax + ' BPM';

    const diff = results.targetMin - results.simpleMin;
    document.getElementById('karv-diff-cell').textContent = (diff > 0 ? '+' : '') + diff + ' BPM';

    // Karvonen zones
    const hrr = results.hrr;
    const rhr = results.restingHR;
    document.getElementById('karv-z1').textContent = Math.round(hrr * 0.5 + rhr) + '-' + Math.round(hrr * 0.6 + rhr);
    document.getElementById('karv-z2').textContent = Math.round(hrr * 0.6 + rhr) + '-' + Math.round(hrr * 0.7 + rhr);
    document.getElementById('karv-z3').textContent = Math.round(hrr * 0.7 + rhr) + '-' + Math.round(hrr * 0.8 + rhr);
    document.getElementById('karv-z4').textContent = Math.round(hrr * 0.8 + rhr) + '-' + Math.round(hrr * 0.9 + rhr);
    document.getElementById('karv-z5').textContent = Math.round(hrr * 0.9 + rhr) + '-' + Math.round(hrr * 1.0 + rhr);

    // Interpretation
    document.getElementById('karv-interp-hrr').textContent = results.hrr;

    let interpText = `Your Heart Rate Reserve of ${results.hrr} BPM represents your cardiovascular working range. `;
    if (results.restingHR < 60) {
      interpText += `Your resting HR of ${results.restingHR} BPM suggests good cardiovascular fitness. `;
    } else if (results.restingHR > 80) {
      interpText += `Your resting HR of ${results.restingHR} BPM is in the average range. Regular exercise can help lower this over time. `;
    }
    interpText += `The Karvonen method gives you ${diff > 0 ? 'higher' : 'similar'} target zones than the simple percentage method, reflecting a more personalized approach.`;
    document.getElementById('karvonen-interpretation-text').textContent = interpText;

    // Highlight current RHR row in context table
    const rows = document.querySelectorAll('#rhr-context-table tr');
    rows.forEach(row => row.style.background = '');
    if (results.restingHR <= 50) rows[0].style.background = 'var(--success-bg)';
    else if (results.restingHR <= 60) rows[1].style.background = 'var(--success-bg)';
    else if (results.restingHR <= 70) rows[2].style.background = 'var(--success-bg)';
    else if (results.restingHR <= 80) rows[3].style.background = 'var(--warning-bg)';
    else rows[4].style.background = 'var(--warning-bg)';

    // Formula example
    document.getElementById('formula-hrr').textContent = results.hrr;
    document.getElementById('formula-hrr2').textContent = results.hrr;
    document.getElementById('formula-rhr').textContent = results.restingHR;
    document.getElementById('formula-result').textContent = Math.round(results.hrr * 0.7 + results.restingHR);
  }
}

// ============================================
// UTILITY
// ============================================
function setupFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('active');
      }
    });
  }
}
