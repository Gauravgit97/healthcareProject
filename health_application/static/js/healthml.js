/**
 * healthml.js
 * Handles ML predictions via Anthropic API for all health apps.
 * 
 * SETUP: Replace ANTHROPIC_API_KEY below with your actual key,
 * OR pass it from Django via a template variable (recommended for production).
 *
 * Example (in your Django template, before loading this script):
 *   <script>window.ANTHROPIC_API_KEY = "{{ anthropic_api_key }}";</script>
 */

const ANTHROPIC_API_KEY = window.ANTHROPIC_API_KEY || "YOUR_API_KEY_HERE";
const ANTHROPIC_MODEL   = "claude-sonnet-4-20250514";

/* ── Utility: call Anthropic API ── */
async function callModel(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error("API error: " + res.status);
  const data = await res.json();
  const raw  = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

/* ── Utility: show/hide loading & result ── */
function setLoading(appId, on) {
  const btn  = document.getElementById("btn-" + appId);
  const load = document.getElementById("load-" + appId);
  if (btn)  btn.disabled = on;
  if (load) load.classList.toggle("show", on);
}

function showResult(appId, score, scoreLabel, message, category) {
  const box = document.getElementById("result-" + appId);
  if (!box) return;
  box.className = "hml-result show " + category;
  document.getElementById("score-"  + appId).textContent = scoreLabel;
  document.getElementById("msg-"    + appId).textContent = message;
}

function hideResult(appId) {
  const box = document.getElementById("result-" + appId);
  if (box) box.classList.remove("show");
}

/* ── Utility: read form field ── */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/* ══════════════════════════════════════════
   APP 1 — General Health
   ══════════════════════════════════════════ */
async function predictGeneral() {
  const age      = val("age");
  const gender   = val("gender");
  const height   = val("height");
  const weight   = val("weight");
  const exercise = val("exercise");
  const sleep    = val("sleep");
  const smoking  = val("smoking");
  const diet     = val("diet");
  const stress   = val("stress");
  const water    = val("water");

  if (!age || !gender || !height || !weight) {
    alert("Please fill in Age, Gender, Height and Weight.");
    return;
  }

  const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1);

  const prompt = `You are a general health scoring ML model.
Given the following patient data, respond ONLY with a valid JSON object — no explanation, no markdown.
JSON fields required:
  "score"   : integer 0–100 (100 = perfect health)
  "level"   : one of "Excellent", "Good", "Moderate", "Poor"
  "message" : one sentence of personalised health advice

Patient data:
  Age=${age}, Gender=${gender}, Height=${height}cm, Weight=${weight}kg, BMI=${bmi},
  Exercise=${exercise} days/week, Sleep=${sleep} hrs/night, Smoking=${smoking},
  Diet quality=${diet}, Stress level=${stress}/10, Daily water intake=${water}`;

  hideResult("general");
  setLoading("general", true);

  try {
    const result = await callModel(prompt);
    const score  = Math.round(result.score);
    const cat    = score >= 70 ? "good" : score >= 45 ? "warn" : "danger";
    showResult("general", score, score + " / 100 — " + result.level, result.message, cat);
  } catch (e) {
    showResult("general", 0, "Error", "Could not get prediction. Please try again.", "warn");
    console.error(e);
  } finally {
    setLoading("general", false);
  }
}

/* ══════════════════════════════════════════
   APP 2 — Diabetes Risk
   ══════════════════════════════════════════ */
async function predictDiabetes() {
  const age      = val("d-age");
  const bmi      = val("d-bmi");
  const glucose  = val("d-glucose");
  const hba1c    = val("d-hba1c");
  const family   = val("d-family");
  const activity = val("d-activity");

  if (!age || !bmi || !glucose || !hba1c) {
    alert("Please fill in Age, BMI, Fasting Glucose and HbA1c.");
    return;
  }

  const prompt = `You are a diabetes risk prediction ML model.
Given the following patient data, respond ONLY with a valid JSON object — no explanation, no markdown.
JSON fields required:
  "score"   : integer 0–100 (100 = highest risk)
  "level"   : one of "Low Risk", "Moderate Risk", "High Risk"
  "message" : one sentence of personalised clinical advice

Patient data:
  Age=${age}, BMI=${bmi}, Fasting glucose=${glucose} mg/dL, HbA1c=${hba1c}%,
  Family history of diabetes=${family}, Physical activity=${activity}`;

  hideResult("diabetes");
  setLoading("diabetes", true);

  try {
    const result = await callModel(prompt);
    const score  = Math.round(result.score);
    const cat    = score < 30 ? "good" : score < 60 ? "warn" : "danger";
    showResult("diabetes", score, result.level, result.message, cat);
  } catch (e) {
    showResult("diabetes", 0, "Error", "Could not get prediction. Please try again.", "warn");
    console.error(e);
  } finally {
    setLoading("diabetes", false);
  }
}

/* ══════════════════════════════════════════
   APP 3 — Heart Risk
   ══════════════════════════════════════════ */
async function predictHeart() {
  const age   = val("h-age");
  const gender = val("h-gender");
  const bp    = val("h-bp");
  const chol  = val("h-chol");
  const hr    = val("h-hr");
  const smoke = val("h-smoke");
  const chest = val("h-chest");

  if (!age || !bp || !chol || !hr) {
    alert("Please fill in Age, Blood Pressure, Cholesterol and Heart Rate.");
    return;
  }

  const prompt = `You are a cardiovascular risk prediction ML model.
Given the following patient data, respond ONLY with a valid JSON object — no explanation, no markdown.
JSON fields required:
  "score"   : integer 0–100 (100 = highest risk)
  "level"   : one of "Low Risk", "Moderate Risk", "High Risk"
  "message" : one sentence of personalised clinical advice

Patient data:
  Age=${age}, Gender=${gender}, Systolic BP=${bp} mmHg, Cholesterol=${chol} mg/dL,
  Resting HR=${hr} bpm, Smoking=${smoke}, Chest pain history=${chest}`;

  hideResult("heart");
  setLoading("heart", true);

  try {
    const result = await callModel(prompt);
    const score  = Math.round(result.score);
    const cat    = score < 30 ? "good" : score < 60 ? "warn" : "danger";
    showResult("heart", score, result.level, result.message, cat);
  } catch (e) {
    showResult("heart", 0, "Error", "Could not get prediction. Please try again.", "warn");
    console.error(e);
  } finally {
    setLoading("heart", false);
  }
}

/* ── Slider live labels ── */
document.addEventListener("DOMContentLoaded", function () {
  function bindSlider(sliderId, outId, formatter) {
    const slider = document.getElementById(sliderId);
    const out    = document.getElementById(outId);
    if (!slider || !out) return;
    out.textContent = formatter(slider.value);
    slider.addEventListener("input", () => { out.textContent = formatter(slider.value); });
  }

  bindSlider("exercise", "ex-val", v => v + " days/week");
  bindSlider("sleep",    "sl-val", v => v + " hrs/night");
  bindSlider("stress",   "st-val", v => v + " / 10");
});
