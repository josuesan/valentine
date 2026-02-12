/* ========================================
   FLOATING HEARTS
   ======================================== */
function createFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '&#10084;';

    const size = Math.random() * 20 + 14;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * duration;
    const opacity = Math.random() * 0.2 + 0.06;
    const sway = (Math.random() - 0.5) * 80;
    const rotation = Math.random() * 90 - 45;

    heart.style.setProperty('--heart-size', size + 'px');
    heart.style.setProperty('--heart-duration', duration + 's');
    heart.style.setProperty('--heart-delay', '-' + delay + 's');
    heart.style.setProperty('--heart-opacity', opacity);
    heart.style.setProperty('--heart-sway', sway + 'px');
    heart.style.setProperty('--heart-rotation', rotation + 'deg');
    heart.style.left = left + '%';

    container.appendChild(heart);
  }
}

/* ========================================
   CONFETTI EFFECTS
   ======================================== */
function triggerProposalConfetti() {
  if (typeof confetti === 'undefined') return;

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 20,
    colors: ['#E91E63', '#FF4081', '#F8BBD0', '#FF6B6B', '#ff1744']
  };

  confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.5 } });
  confetti({ ...defaults, particleCount: 40, origin: { x: 0.7, y: 0.5 } });

  setTimeout(function() {
    confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.3 } });
  }, 200);
}

function triggerRevealConfetti() {
  if (typeof confetti === 'undefined') return;

  var duration = 3000;
  var end = Date.now() + duration;

  var colors = ['#E91E63', '#FF4081', '#F8BBD0', '#FF6B6B', '#ff1744'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function triggerFinalConfetti() {
  if (typeof confetti === 'undefined') return;

  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
    colors: ['#E91E63', '#FF4081', '#F8BBD0', '#FF6B6B', '#ff1744']
  };

  confetti({ ...defaults, spread: 26, startVelocity: 55, particleCount: Math.floor(count * 0.25) });
  confetti({ ...defaults, spread: 60, particleCount: Math.floor(count * 0.2) });
  confetti({ ...defaults, spread: 100, decay: 0.91, scalar: 0.8, particleCount: Math.floor(count * 0.35) });
  confetti({ ...defaults, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, particleCount: Math.floor(count * 0.1) });
  confetti({ ...defaults, spread: 120, startVelocity: 45, particleCount: Math.floor(count * 0.1) });
}
