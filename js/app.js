document.addEventListener('DOMContentLoaded', function() {
  /* ========================================
     STATE
     ======================================== */
  var currentScreen = 'landing';
  var currentQuestion = 0;
  var noAttempts = 0;
  var isTransitioning = false;

  /* ========================================
     DOM REFERENCES
     ======================================== */
  var screens = {
    landing: document.getElementById('landing'),
    proposal: document.getElementById('proposal'),
    questions: document.getElementById('questions'),
    reveal: document.getElementById('reveal')
  };

  var btnStart = document.getElementById('btn-start');
  var btnYes = document.getElementById('btn-yes');
  var btnNo = document.getElementById('btn-no');
  var btnDate = document.getElementById('btn-date');

  var progressBar = document.getElementById('progress-bar');
  var questionCard = document.getElementById('question-card');
  var questionText = document.getElementById('question-text');
  var questionResponse = document.getElementById('question-response');
  var questionOptions = document.getElementById('question-options');

  var revealLoading = document.getElementById('reveal-loading');
  var loadingText = document.getElementById('loading-text');
  var revealCard = document.getElementById('reveal-card');
  var closing = document.getElementById('closing');

  var noTexts = ['No', '\u00bfSegura?', 'Pi\u00e9nsalo bien...', '\u00daltima oportunidad!', '...'];

  /* ========================================
     INIT
     ======================================== */
  createFloatingHearts();
  buildProgressBar();

  /* ========================================
     SCREEN TRANSITIONS
     ======================================== */
  function transitionTo(screenName) {
    if (isTransitioning) return;
    isTransitioning = true;

    var current = screens[currentScreen];
    var next = screens[screenName];

    current.classList.remove('active');

    setTimeout(function() {
      next.classList.add('active');
      currentScreen = screenName;
      isTransitioning = false;
    }, 400);
  }

  /* ========================================
     LANDING
     ======================================== */
  btnStart.addEventListener('click', function() {
    transitionTo('proposal');
  });

  /* ========================================
     PROPOSAL - YES BUTTON
     ======================================== */
  btnYes.addEventListener('click', function() {
    if (isTransitioning) return;
    triggerProposalConfetti();
    setTimeout(function() {
      renderQuestion(0);
      transitionTo('questions');
    }, 1200);
  });

  /* ========================================
     PROPOSAL - NO BUTTON (ESCAPE LOGIC)
     ======================================== */
  function handleNo(e) {
    e.preventDefault();
    e.stopPropagation();
    noAttempts++;

    if (noAttempts >= 5) {
      btnNo.style.display = 'none';
      return;
    }

    // Make it escape
    btnNo.classList.add('escaping');
    var maxX = window.innerWidth - btnNo.offsetWidth - 20;
    var maxY = window.innerHeight - btnNo.offsetHeight - 20;
    btnNo.style.left = (Math.random() * maxX + 10) + 'px';
    btnNo.style.top = (Math.random() * maxY + 10) + 'px';

    // Shrink
    var scale = 1 - (noAttempts * 0.15);
    btnNo.style.transform = 'scale(' + Math.max(scale, 0.4) + ')';

    // Change text
    btnNo.textContent = noTexts[noAttempts] || '...';

    // Grow yes button
    var yesScale = 1 + (noAttempts * 0.08);
    btnYes.style.transform = 'scale(' + yesScale + ')';
  }

  btnNo.addEventListener('click', handleNo);
  btnNo.addEventListener('touchstart', handleNo, { passive: false });

  /* ========================================
     PROGRESS BAR
     ======================================== */
  function buildProgressBar() {
    progressBar.innerHTML = '';
    for (var i = 0; i < QUESTIONS.length; i++) {
      var dot = document.createElement('div');
      dot.classList.add('progress-dot');
      if (i === 0) dot.classList.add('active');
      progressBar.appendChild(dot);
    }
  }

  function updateProgress(index) {
    var dots = progressBar.querySelectorAll('.progress-dot');
    dots.forEach(function(dot, i) {
      dot.classList.remove('active');
      if (i < index) dot.classList.add('completed');
      if (i === index) dot.classList.add('active');
    });
  }

  /* ========================================
     QUESTIONS
     ======================================== */
  function renderQuestion(index) {
    var q = QUESTIONS[index];
    currentQuestion = index;

    // Slide out current card
    questionCard.classList.add('slide-out-left');

    setTimeout(function() {
      questionCard.classList.remove('slide-out-left');

      questionText.textContent = q.text;
      questionResponse.classList.add('hidden');
      questionResponse.textContent = '';
      questionOptions.innerHTML = '';

      q.options.forEach(function(option, i) {
        var btn = document.createElement('button');
        btn.classList.add('btn-option');
        btn.textContent = option.text;
        btn.addEventListener('click', function() {
          handleAnswer(option, btn);
        });
        questionOptions.appendChild(btn);
      });

      updateProgress(index);

      questionCard.classList.add('slide-in-right');
      setTimeout(function() {
        questionCard.classList.remove('slide-in-right');
      }, 400);
    }, index === 0 ? 0 : 400);
  }

  function handleAnswer(option, btnElement) {
    if (isTransitioning) return;

    // If this option should be eliminated
    if (option.eliminate) {
      questionResponse.textContent = option.response;
      questionResponse.classList.remove('hidden');
      btnElement.classList.add('eliminated');
      btnElement.disabled = true;
      return;
    }

    // Mark as selected
    var allBtns = questionOptions.querySelectorAll('.btn-option');
    allBtns.forEach(function(b) { b.disabled = true; });
    btnElement.classList.add('selected');

    if (option.response) {
      // Show funny response, then advance
      questionResponse.textContent = option.response;
      questionResponse.classList.remove('hidden');

      setTimeout(function() {
        advanceQuestion();
      }, 1500);
    } else {
      // Advance directly
      setTimeout(function() {
        advanceQuestion();
      }, 500);
    }
  }

  function advanceQuestion() {
    var next = currentQuestion + 1;
    if (next < QUESTIONS.length) {
      renderQuestion(next);
    } else {
      transitionTo('reveal');
      startRevealSequence();
    }
  }

  /* ========================================
     REVEAL SEQUENCE
     ======================================== */
  function startRevealSequence() {
    revealLoading.classList.remove('hidden');
    revealCard.classList.add('hidden');
    btnDate.classList.add('hidden');
    closing.classList.add('hidden');

    var messages = [
      'Analizando compatibilidad...',
      '\u00a199.9% compatible!',
      'Buscando el restaurante perfecto...',
      'Reservando mesa para dos...'
    ];

    var i = 0;
    function showNextMessage() {
      if (i < messages.length) {
        loadingText.textContent = messages[i];
        loadingText.style.animation = 'none';
        // Force reflow
        loadingText.offsetHeight;
        loadingText.style.animation = 'fadeInUp 0.4s ease-out';
        i++;
        setTimeout(showNextMessage, 800);
      } else {
        // Show the card
        revealLoading.classList.add('hidden');
        revealCard.classList.remove('hidden');

        // Trigger flip after a brief pause
        setTimeout(function() {
          revealCard.classList.add('flipped');
          triggerRevealConfetti();

          // Show the button
          setTimeout(function() {
            btnDate.classList.remove('hidden');
          }, 1000);
        }, 600);
      }
    }

    setTimeout(showNextMessage, 500);
  }

  /* ========================================
     FINAL BUTTON
     ======================================== */
  btnDate.addEventListener('click', function() {
    triggerFinalConfetti();
    revealCard.classList.add('hidden');
    btnDate.classList.add('hidden');

    closing.classList.remove('hidden');
    closing.classList.add('fade-in');
  });
});
