const TIMER_KEY = "escapeRoomStart_2026";
const TIMER_DURATION = 45 * 60;

function renderProgress(current, total) {
  total = total || 14;
  const el = document.getElementById("progress");
  if (!el) return;
  let html = "";
  for (let i = 1; i <= total; i++) {
    if (i < current) html += '<span class="dot done"></span>';
    else if (i === current) html += '<span class="dot active"></span>';
    else html += '<span class="dot"></span>';
  }
  el.innerHTML = html;
}

function toggleHint() {
  const hint = document.getElementById("hint");
  const toggle = document.querySelector(".hint-toggle");
  const visible = hint.classList.toggle("visible");
  toggle.textContent = visible ? "Hide help" : "Stuck? Need help?";
}

function checkAnswer(e, enc, next) {
  e.preventDefault();
  const answer = atob(enc);
  const input = document.querySelector(".answer-input");
  const val = input.value.trim().toUpperCase();
  const fb = document.getElementById("feedback");
  const expected = answer.trim().toUpperCase();
  const isHexAnswer = /^#?[0-9A-F]{3}([0-9A-F]{3})?([0-9A-F]{2})?$/.test(
    expected
  );
  const normalizedVal = isHexAnswer ? val.replace(/^#/, "") : val;
  const normalizedExpected = isHexAnswer
    ? expected.replace(/^#/, "")
    : expected;

  if (normalizedVal === normalizedExpected) {
    fb.textContent = "✓ Correct — moving to the next bug report...";
    fb.className = "feedback ok";
    input.disabled = true;
    const btn = document.querySelector(".btn-submit");
    if (btn) btn.disabled = true;
    setTimeout(() => {
      window.location = next;
    }, 1200);
  } else {
    fb.textContent = "✗ Not quite. Check the code again.";
    fb.className = "feedback err";
  }
}

/* ── Floating game timer (auto-mounts on task pages) ────────── */
(function () {
  const start =
    sessionStorage.getItem(TIMER_KEY) || localStorage.getItem(TIMER_KEY);
  if (!start) return;

  function _pad(n) {
    return String(n).padStart(2, "0");
  }

  /* inject styles */
  const style = document.createElement("style");
  style.textContent = [
    "#gTimer{position:fixed;top:1rem;right:1rem;background:#fff;border:1px solid #dde1f5;",
    "border-radius:8px;padding:7px 14px;box-shadow:0 2px 10px rgba(88,101,245,.1);",
    "z-index:999;text-align:center;min-width:72px;font-family:-apple-system,sans-serif}",
    "#gTimer .gtl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;",
    "color:#b0b5d0;margin-bottom:2px;display:block}",
    '#gTimer .gtd{font-family:"Courier New",monospace;font-size:18px;font-weight:700;',
    "color:#16a34a;display:block;transition:color .4s}",
    "#gTimer.yellow .gtd{color:#d97706}",
    "#gTimer.red .gtd{color:#dc2626}",
  ].join("");
  document.head.appendChild(style);

  /* create widget */
  const w = document.createElement("div");
  w.id = "gTimer";
  w.innerHTML =
    '<span class="gtl">Time left</span><span class="gtd">45:00</span>';
  document.body.appendChild(w);

  const disp = w.querySelector(".gtd");

  function tick() {
    const elapsed = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
    const left = Math.max(0, TIMER_DURATION - elapsed);
    disp.textContent = _pad(Math.floor(left / 60)) + ":" + _pad(left % 60);
    w.className = left <= 5 * 60 ? "red" : left <= 15 * 60 ? "yellow" : "";
    if (left > 0) setTimeout(tick, 500);
  }

  tick();
})();
