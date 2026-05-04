function renderProgress(current) {
  const el = document.getElementById('progress');
  if (!el) return;
  let html = '';
  for (let i = 1; i <= 10; i++) {
    if (i < current)        html += '<span class="dot done"></span>';
    else if (i === current) html += '<span class="dot active"></span>';
    else                    html += '<span class="dot"></span>';
  }
  el.innerHTML = html;
}

function toggleHint() {
  const hint   = document.getElementById('hint');
  const toggle = document.querySelector('.hint-toggle');
  const visible = hint.classList.toggle('visible');
  toggle.textContent = visible ? 'Hide hint' : 'Need a hint?';
}

function checkAnswer(e, answer, next) {
  e.preventDefault();
  const input = document.querySelector('.answer-input');
  const val   = input.value.trim().toUpperCase();
  const fb    = document.getElementById('feedback');

  if (val === answer.toUpperCase()) {
    fb.textContent = '✓ Correct — moving to the next bug report...';
    fb.className   = 'feedback ok';
    input.disabled = true;
    const btn = document.querySelector('.btn-submit');
    if (btn) btn.disabled = true;
    setTimeout(() => { window.location = next; }, 1200);
  } else {
    fb.textContent = '✗ Not quite. Check the code again.';
    fb.className   = 'feedback err';
  }
}
