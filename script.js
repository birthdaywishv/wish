/**
 * Birthday Surprise Website for Soul Sister 💓
 * English-Only Version with Instant Background Music Autoplay & Smooth Auto-Scrolling
 * Background Song: Connie Francis - Pretty Little Baby
 */

(function () {
  'use strict';

  // --- Configuration ---
  const CORRECT_PASSWORD = '1111';

  // --- DOM Elements ---
  const passwordOverlay = document.getElementById('password-overlay');
  const pwdInput = document.getElementById('password-input');
  const pwdError = document.getElementById('pwd-error');
  const mainContent = document.getElementById('main-content');

  // Music Player
  const bgAudio = document.getElementById('bg-audio');
  const playOurSongBtn = document.getElementById('play-our-song-btn');
  const musicDisc = document.getElementById('music-disc');
  const musicPlayIcon = document.getElementById('music-play-icon');
  const musicPauseIcon = document.getElementById('music-pause-icon');
  const musicBtnText = document.getElementById('music-btn-text');
  const musicStatusText = document.getElementById('music-status-text');

  // Letter & Auto-Scroll
  const letterParchment = document.getElementById('letter-parchment');
  const autoScrollToggle = document.getElementById('auto-scroll-toggle');
  const scrollPlayIcon = document.getElementById('scroll-play-icon');
  const scrollPauseIcon = document.getElementById('scroll-pause-icon');
  const scrollBtnLabel = document.getElementById('scroll-btn-label');
  const scrollSpeedBtn = document.getElementById('scroll-speed-btn');
  const speedLabel = document.getElementById('speed-label');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const btnOpenSurprise = document.getElementById('btn-open-surprise');
  const btnUnlockCake = document.getElementById('btn-unlock-cake');

  // Cake Section
  const cakeSection = document.getElementById('cake-section');
  const birthdayCake = document.getElementById('birthday-cake');
  const cakeMessageBox = document.getElementById('cake-message-box');

  // Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  // Canvas
  const ambientCanvas = document.getElementById('ambient-canvas');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // --- State Variables ---
  let isUnlocked = false;
  let isAutoScrolling = false;
  let scrollSpeed = 0.75; // Pixels per frame for smooth reading
  const speedLevels = [0.75, 1.35, 2.0];
  const speedLabels = ['1x', '1.5x', '2x'];
  let currentSpeedIdx = 0;
  let scrollAnimFrameId = null;
  let cakeCelebrated = false;
  let isSongPlaying = false;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. BACKGROUND MUSIC & AUTOPLAY (Local Song: Pretty Little Baby)
     ========================================================================== */

  let audioUnlocked = false;

  function playSong() {
    isSongPlaying = true;
    setMusicUI(true);

    if (bgAudio) {
      bgAudio.volume = 1.0;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioUnlocked = true;
        }).catch((err) => {
          console.warn('Audio play pending user interaction:', err);
        });
      }
    }
  }

  function playAllAudio() {
    playSong();
  }

  function pauseSong() {
    isSongPlaying = false;
    setMusicUI(false);
    if (bgAudio) {
      try { bgAudio.pause(); } catch (e) {}
    }
  }

  function toggleSong() {
    if (isSongPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  function setMusicUI(playing) {
    if (playing) {
      if (musicDisc) musicDisc.classList.add('is-spinning');
      if (musicPlayIcon) musicPlayIcon.classList.add('is-hidden');
      if (musicPauseIcon) musicPauseIcon.classList.remove('is-hidden');
      if (musicBtnText) musicBtnText.textContent = 'Pause Song';
      if (musicStatusText) musicStatusText.textContent = 'Playing: Pretty Little Baby 🎶';
    } else {
      if (musicDisc) musicDisc.classList.remove('is-spinning');
      if (musicPlayIcon) musicPlayIcon.classList.remove('is-hidden');
      if (musicPauseIcon) musicPauseIcon.classList.add('is-hidden');
      if (musicBtnText) musicBtnText.textContent = 'Play Our Song';
      if (musicStatusText) musicStatusText.textContent = 'Paused 🎵';
    }
  }

  if (playOurSongBtn) {
    playOurSongBtn.addEventListener('click', toggleSong);
  }

  // --- GUARANTEED INSTANT AUTOPLAY SYSTEM ---
  function attemptInstantAutoplay() {
    if (!isSongPlaying) {
      playSong();
    }
  }

  function unlockOnFirstGesture() {
    if (!audioUnlocked || !isSongPlaying) {
      playSong();
      audioUnlocked = true;
    }
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.removeEventListener(evt, unlockOnFirstGesture);
    });
  }

  // Attempt autoplay immediately
  attemptInstantAutoplay();
  window.addEventListener('DOMContentLoaded', attemptInstantAutoplay);
  window.addEventListener('load', attemptInstantAutoplay);

  // If browser blocks until interaction, first click/touch/keypress anywhere unlocks immediately
  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, unlockOnFirstGesture, { passive: true, once: true });
  });

                  /* ==========================================================================
                     2. PASSWORD SCREEN & PIN KEYPAD (Reference Video Style)
                     ========================================================================== */

                  let enteredPin = '';
                  const pinDots = [
                    document.getElementById('pdot-0'),
                    document.getElementById('pdot-1'),
                    document.getElementById('pdot-2'),
                    document.getElementById('pdot-3')
                  ];
                  const pinDotsContainer = document.getElementById('pin-dots-container');
                  const pinKeypad = document.getElementById('pin-keypad');

                  function updatePinDots() {
                    pinDots.forEach((dot, idx) => {
                      if (dot) {
                        if (idx < enteredPin.length) {
                          dot.classList.add('is-filled');
                        } else {
                          dot.classList.remove('is-filled');
                        }
                      }
                    });
                  }

                  function handlePinInput(digit) {
                    if (isUnlocked) return;
                    if (enteredPin.length < 4) {
                      enteredPin += digit;
                      updatePinDots();
                      if (enteredPin.length === 4) {
                        checkPin();
                      }
                    }
                  }

                  function handlePinClear() {
                    enteredPin = '';
                    updatePinDots();
                    if (pwdError) pwdError.textContent = '';
                  }

                  function handlePinBack() {
                    if (enteredPin.length > 0) {
                      enteredPin = enteredPin.slice(0, -1);
                      updatePinDots();
                      if (pwdError) pwdError.textContent = '';
                    }
                  }

                  function checkPin() {
                    if (enteredPin === CORRECT_PASSWORD) {
                      if (pwdError) pwdError.textContent = '';

                      // Play background song immediately on user interaction
                      playSong();

                      // Confetti burst!
                      fireConfetti();

                      // Smooth transition to website
                      setTimeout(() => {
                        if (passwordOverlay) passwordOverlay.classList.add('is-unlocked');
                        if (mainContent) {
                          mainContent.classList.remove('is-locked');
                          mainContent.removeAttribute('aria-hidden');
                        }
                        if (passwordOverlay) passwordOverlay.setAttribute('aria-hidden', 'true');
                        isUnlocked = true;
                      }, 500);

                    } else {
                      showPasswordError('Incorrect code! Hint: 1111 ✨');
                      if (pinDotsContainer) {
                        pinDotsContainer.classList.add('pwd-shake');
                        setTimeout(() => pinDotsContainer.classList.remove('pwd-shake'), 500);
                      }
                      setTimeout(() => {
                        handlePinClear();
                      }, 650);
                    }
                  }

                  function showPasswordError(msg) {
                    if (pwdError) {
                      pwdError.textContent = msg;
                      pwdError.style.opacity = '1';
                    }
                  }

                  if (pinKeypad) {
                    pinKeypad.addEventListener('click', (e) => {
                      const btn = e.target.closest('.keypad-btn');
                      if (!btn) return;
                      if (!isSongPlaying) {
                        playSong();
                      }
                      const key = btn.getAttribute('data-key');
                      if (key === 'clear') {
                        handlePinClear();
                      } else if (key === 'back') {
                        handlePinBack();
                      } else if (key) {
                        handlePinInput(key);
                      }
                    });
                  }

                  // Support mobile keyboard / typing in hidden input
                  if (pwdInput) {
                    pwdInput.addEventListener('input', () => {
                      const val = pwdInput.value.replace(/[^0-9]/g, '');
                      if (val.length > 0) {
                        for (let i = 0; i < val.length; i++) {
                          handlePinInput(val[i]);
                        }
                      }
                      pwdInput.value = '';
                    });
                  }

                  // Also support physical keyboard typing for PIN
                  window.addEventListener('keydown', (e) => {
                    if (isUnlocked) return;
                    if (/^[0-9]$/.test(e.key)) {
                      handlePinInput(e.key);
                    } else if (e.key === 'Backspace') {
                      handlePinBack();
                    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                      handlePinClear();
                    }
                  });

                  /* ==========================================================================
                     3. AUTOMATIC SCROLLING ENGINE
                     ========================================================================== */

                  function startAutoScroll() {
                    if (isAutoScrolling || prefersReducedMotion) return;
                    isAutoScrolling = true;
                    updateAutoScrollUI(true);

                    function step() {
                      if (!isAutoScrolling) return;

                      const currentY = window.pageYOffset || document.documentElement.scrollTop;
                      const endMarker = document.getElementById('letter-end-marker');
                      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

                      // Stop auto-scroll when reaching end marker
                      if (endMarker) {
                        const markerRect = endMarker.getBoundingClientRect();
                        if (markerRect.top <= window.innerHeight * 0.70 || currentY >= maxScrollY - 4) {
                          stopAutoScroll();
                          onReachedEndOfLetter();
                          return;
                        }
                      }

                      window.scrollBy({
                        top: scrollSpeed,
                        left: 0,
                        behavior: 'auto'
                      });

                      scrollAnimFrameId = requestAnimationFrame(step);
                    }

                    scrollAnimFrameId = requestAnimationFrame(step);
                  }

                  function pauseAutoScroll() {
                    if (!isAutoScrolling) return;
                    isAutoScrolling = false;
                    if (scrollAnimFrameId) {
                      cancelAnimationFrame(scrollAnimFrameId);
                      scrollAnimFrameId = null;
                    }
                    updateAutoScrollUI(false);
                  }

                  function stopAutoScroll() {
                    pauseAutoScroll();
                  }

                  function toggleAutoScroll() {
                    if (isAutoScrolling) {
                      pauseAutoScroll();
                    } else {
                      startAutoScroll();
                    }
                  }

                  function updateAutoScrollUI(active) {
                    if (active) {
                      autoScrollToggle.classList.add('is-active');
                      scrollPlayIcon.classList.add('is-hidden');
                      scrollPauseIcon.classList.remove('is-hidden');
                      scrollBtnLabel.textContent = 'Pause';
                    } else {
                      autoScrollToggle.classList.remove('is-active');
                      scrollPlayIcon.classList.remove('is-hidden');
                      scrollPauseIcon.classList.add('is-hidden');
                      scrollBtnLabel.textContent = 'Auto-Scroll';
                    }
                  }

                  function cycleSpeed() {
                    currentSpeedIdx = (currentSpeedIdx + 1) % speedLevels.length;
                    scrollSpeed = speedLevels[currentSpeedIdx];
                    speedLabel.textContent = speedLabels[currentSpeedIdx];
                    scrollSpeedBtn.setAttribute('aria-label', `Scroll Speed: ${speedLabels[currentSpeedIdx]}`);
                  }

                  function scrollToLetterTop() {
                    pauseAutoScroll();
                    if (letterParchment) {
                      letterParchment.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }

                  function onReachedEndOfLetter() {
                    const revealPrompt = document.getElementById('cake-reveal-prompt');
                    if (revealPrompt) {
                      revealPrompt.style.borderColor = 'var(--primary-pink-500)';
                      revealPrompt.classList.add('btn-glow');
                    }
                  }

                  // Tapping or clicking the letter pauses or resumes auto-scroll
                  if (letterParchment) {
                    letterParchment.addEventListener('click', (e) => {
                      if (
                        e.target.closest('button') ||
                        e.target.closest('a') ||
                        e.target.closest('.letter-pocket-section') ||
                        e.target.closest('.letter-highlight-box')
                      ) return;
                      const selection = window.getSelection();
                      if (selection && selection.toString().length > 0) return;

                      toggleAutoScroll();
                    });
                  }

                  // Gracefully pause auto-scroll when user manually scrolls
                  ['wheel', 'touchmove'].forEach((evt) => {
                    window.addEventListener(evt, () => {
                      if (isAutoScrolling) {
                        pauseAutoScroll();
                      }
                    }, { passive: true });
                  });

                  if (autoScrollToggle) autoScrollToggle.addEventListener('click', toggleAutoScroll);
                  if (scrollSpeedBtn) scrollSpeedBtn.addEventListener('click', cycleSpeed);
                  if (scrollTopBtn) scrollTopBtn.addEventListener('click', scrollToLetterTop);

                  if (btnOpenSurprise) {
                    btnOpenSurprise.addEventListener('click', (e) => {
                      e.preventDefault();
                      const letterSec = document.getElementById('letter-section');
                      if (letterSec) {
                        letterSec.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => {
                          startAutoScroll();
                        }, 800);
                      }
                    });
                  }

                  /* ==========================================================================
                     4. BIRTHDAY CAKE SURPRISE & CONFETTI
                     ========================================================================== */

                  function unlockAndShowCakeSection() {
                    if (!cakeSection) return;
                    cakeSection.classList.remove('is-hidden');
                    cakeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }

                  if (btnUnlockCake) {
                    btnUnlockCake.addEventListener('click', unlockAndShowCakeSection);
                  }

                  function celebrateBirthdayCake() {
                    if (cakeCelebrated) {
                      fireConfetti();
                      return;
                    }
                    cakeCelebrated = true;

                    // Blow candles
                    if (birthdayCake) {
                      birthdayCake.classList.add('candles-blown');
                    }

                    // Fire celebratory confetti shower!
                    fireConfetti();

                    // Reveal final heartfelt message
                    setTimeout(() => {
                      if (cakeMessageBox) {
                        cakeMessageBox.classList.remove('is-hidden');
                        cakeMessageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 700);
                  }

                  if (birthdayCake) {
                    birthdayCake.addEventListener('click', celebrateBirthdayCake);
                    birthdayCake.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        celebrateBirthdayCake();
                      }
                    });
                  }

                  // Knife Cut Action (Reference Video 00:09)
                  const btnKnifeCut = document.getElementById('btn-knife-cut');
                  const wishGrantedBadge = document.getElementById('wish-granted-badge');
                  const cakeTapHint = document.getElementById('cake-tap-hint');

                  function sliceCakeWithKnife() {
                    if (btnKnifeCut) {
                      btnKnifeCut.style.transform = 'scale(0.92)';
                      setTimeout(() => {
                        btnKnifeCut.style.display = 'none';
                      }, 350);
                    }
                    if (wishGrantedBadge) {
                      wishGrantedBadge.classList.remove('is-hidden');
                    }
                    if (cakeTapHint) {
                      cakeTapHint.innerHTML = '✨ Wish granted! Look at your special blessing below 🌸';
                    }
                    celebrateBirthdayCake();
                  }

                  if (btnKnifeCut) {
                    btnKnifeCut.addEventListener('click', sliceCakeWithKnife);
                  }

                  /* ==========================================================================
                     5. PHOTO MEMORIES LIGHTBOX MODAL
                     ========================================================================== */

                  const memoryCards = document.querySelectorAll('.memory-card');

                  memoryCards.forEach((card) => {
                    card.addEventListener('click', () => {
                      const photoSrc = card.getAttribute('data-photo');
                      const caption = card.getAttribute('data-caption') || '';
                      openLightbox(photoSrc, caption);
                    });

                    card.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const photoSrc = card.getAttribute('data-photo');
                        const caption = card.getAttribute('data-caption') || '';
                        openLightbox(photoSrc, caption);
                      }
                    });
                    card.setAttribute('tabindex', '0');
                    card.setAttribute('role', 'button');
                    card.setAttribute('aria-label', 'Open photo in large view');
                  });

                  function openLightbox(src, caption) {
                    if (!lightboxModal || !lightboxImg) return;
                    lightboxImg.src = src;
                    lightboxCaption.textContent = caption;
                    lightboxModal.removeAttribute('hidden');
                    lightboxCloseBtn.focus();
                    document.body.style.overflow = 'hidden';
                  }

                  function closeLightbox() {
                    if (!lightboxModal) return;
                    lightboxModal.setAttribute('hidden', 'true');
                    lightboxImg.src = '';
                    document.body.style.overflow = '';
                  }

                  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
                  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

                  window.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && lightboxModal && !lightboxModal.hasAttribute('hidden')) {
                      closeLightbox();
                    }
                  });

                  /* ==========================================================================
                     6. CONFETTI EFFECT (HTML5 Canvas Engine)
                     ========================================================================== */

                  function fireConfetti() {
                    if (!confettiCanvas) return;
                    const ctx = confettiCanvas.getContext('2d');
                    let width = (confettiCanvas.width = window.innerWidth);
                    let height = (confettiCanvas.height = window.innerHeight);

                    const particles = [];
                    const colors = ['#f472b6', '#ec4899', '#facc15', '#f59e0b', '#fbbf24', '#fbcfe8', '#ffffff'];
                    const totalParticles = 130;

                    for (let i = 0; i < totalParticles; i++) {
                      particles.push({
                        x: width / 2 + (Math.random() - 0.5) * 220,
                        y: height * 0.45,
                        vx: (Math.random() - 0.5) * 18,
                        vy: -Math.random() * 15 - 5,
                        size: Math.random() * 8 + 4,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        rotation: Math.random() * 360,
                        rotSpeed: (Math.random() - 0.5) * 12,
                        shape: Math.random() > 0.4 ? 'rect' : 'circle',
                        alpha: 1,
                        decay: Math.random() * 0.008 + 0.005
                      });
                    }

                    let confettiAnimId = null;

                    function renderConfetti() {
                      ctx.clearRect(0, 0, width, height);
                      let aliveCount = 0;

                      for (let i = 0; i < particles.length; i++) {
                        const p = particles[i];
                        if (p.alpha <= 0) continue;

                        aliveCount++;
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.36; // Gravity
                        p.vx *= 0.98; // Drag
                        p.rotation += p.rotSpeed;
                        p.alpha -= p.decay;

                        ctx.save();
                        ctx.globalAlpha = Math.max(0, p.alpha);
                        ctx.translate(p.x, p.y);
                        ctx.rotate((p.rotation * Math.PI) / 180);
                        ctx.fillStyle = p.color;

                        if (p.shape === 'rect') {
                          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                        } else {
                          ctx.beginPath();
                          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                          ctx.fill();
                        }
                        ctx.restore();
                      }

                      if (aliveCount > 0) {
                        confettiAnimId = requestAnimationFrame(renderConfetti);
                      } else {
                        ctx.clearRect(0, 0, width, height);
                        cancelAnimationFrame(confettiAnimId);
                      }
                    }

                    renderConfetti();
                  }

                  /* ==========================================================================
                     7. AMBIENT FLOATING SUNFLOWERS & HEARTS
                     ========================================================================== */

                  function initAmbientParticles() {
                    if (!ambientCanvas || prefersReducedMotion) return;
                    const ctx = ambientCanvas.getContext('2d');
                    let width = (ambientCanvas.width = window.innerWidth);
                    let height = (ambientCanvas.height = window.innerHeight);

                    window.addEventListener('resize', () => {
                      width = ambientCanvas.width = window.innerWidth;
                      height = ambientCanvas.height = window.innerHeight;
                    }, { passive: true });

                    const items = [];
                    const count = Math.min(16, Math.floor(width / 70));
                    const symbols = ['🌻', '💗', '🌸', '✨'];

                    for (let i = 0; i < count; i++) {
                      items.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        speedY: Math.random() * 0.4 + 0.2,
                        speedX: (Math.random() - 0.5) * 0.3,
                        symbol: symbols[Math.floor(Math.random() * symbols.length)],
                        size: Math.random() * 12 + 16,
                        alpha: Math.random() * 0.4 + 0.2
                      });
                    }

                    function drawAmbient() {
                      ctx.clearRect(0, 0, width, height);

                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        item.y -= item.speedY;
                        item.x += item.speedX;

                        if (item.y < -30) {
                          item.y = height + 30;
                          item.x = Math.random() * width;
                        }

                        ctx.font = `${item.size}px serif`;
                        ctx.globalAlpha = item.alpha;
                        ctx.fillText(item.symbol, item.x, item.y);
                      }

                      requestAnimationFrame(drawAmbient);
                    }

                    drawAmbient();
                  }

                  /* ==========================================================================
                     8. INTERACTIVE POCKET NOTE CONTROLLER
                     ========================================================================== */

                  const interactivePocket = document.getElementById('interactive-pocket');
                  const pocketPouch = document.getElementById('pocket-pouch');
                  const pocketCard = document.getElementById('pocket-card');
                  const pocketCardTab = document.getElementById('pocket-card-tab');
                  const btnTuckPocket = document.getElementById('btn-tuck-pocket');
                  const pocketLabelAction = document.getElementById('pocket-label-action');
                  let isPocketOpen = false;

                  function togglePocket(openState) {
                    if (!interactivePocket) return;

                    if (typeof openState === 'boolean') {
                      isPocketOpen = openState;
                    } else {
                      isPocketOpen = !isPocketOpen;
                    }

                    if (isPocketOpen) {
                      interactivePocket.classList.add('is-open');
                      if (pocketPouch) pocketPouch.setAttribute('aria-expanded', 'true');
                      if (pocketCard) pocketCard.removeAttribute('aria-hidden');
                      if (pocketLabelAction) {
                        pocketLabelAction.innerHTML = '<span class="hand-pointer">📥</span> Tap to Tuck Note Back';
                      }

                      // If auto-scroll is running, gently pause it so user can read the note comfortably
                      if (isAutoScrolling) {
                        pauseAutoScroll();
                      }

                      // Confetti celebration when opening the pocket
                      fireConfetti();
                    } else {
                      interactivePocket.classList.remove('is-open');
                      if (pocketPouch) pocketPouch.setAttribute('aria-expanded', 'false');
                      if (pocketCard) pocketCard.setAttribute('aria-hidden', 'true');
                      if (pocketLabelAction) {
                        pocketLabelAction.innerHTML = '<span class="hand-pointer">👆</span> Tap to Pull Out Note ✨';
                      }
                    }
                  }

                  if (pocketPouch) {
                    pocketPouch.addEventListener('click', (e) => {
                      e.stopPropagation();
                      togglePocket();
                    });

                    pocketPouch.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        togglePocket();
                      }
                    });
                  }

                  if (pocketCardTab) {
                    pocketCardTab.addEventListener('click', (e) => {
                      e.stopPropagation();
                      togglePocket();
                    });

                    pocketCardTab.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        togglePocket();
                      }
                    });
                  }

                  if (btnTuckPocket) {
                    btnTuckPocket.addEventListener('click', (e) => {
                      e.stopPropagation();
                      togglePocket(false);
                    });
                  }

                  /* ==========================================================================
                     9. BALLOON POPPING CONTROLLER (Reference Video 00:19)
                     ========================================================================== */

                  const balloonItems = document.querySelectorAll('.balloon-item');
                  const balloonRevealedPanel = document.getElementById('balloon-revealed-panel');
                  const balloonsLeftCount = document.getElementById('balloons-left-count');
                  const balloonsHintText = document.getElementById('balloons-hint-text');
                  let poppedCount = 0;

                  balloonItems.forEach((item) => {
                    function popThisBalloon() {
                      if (item.classList.contains('is-popped')) return;
                      item.classList.add('is-popped');
                      poppedCount++;

                      // Small confetti burst on pop
                      fireConfetti();

                      const remaining = balloonItems.length - poppedCount;
                      if (balloonsLeftCount) {
                        balloonsLeftCount.textContent = remaining;
                      }

                      if (remaining > 0) {
                        if (balloonsHintText) {
                          balloonsHintText.innerHTML = `<span>Pop the rest! &bull; <strong id="balloons-left-count">${remaining}</strong> remaining 🎈</span>`;
                        }
                      } else {
                        if (balloonsHintText) {
                          balloonsHintText.innerHTML = '<span>🎉 All balloons popped! Look at your special message below ✨</span>';
                        }
                        if (balloonRevealedPanel) {
                          balloonRevealedPanel.classList.remove('is-hidden');
                          balloonRevealedPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }
                    }

                    item.addEventListener('click', popThisBalloon);
                    item.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        popThisBalloon();
                      }
                    });
                  });

                  /* ==========================================================================
                     10. RETRO CAMERA INSTANT FILM DEVELOPING (Reference Video 00:14)
                     ========================================================================== */

                  const cameraShutterBtn = document.getElementById('camera-shutter-btn');
                  const cameraFlashOverlay = document.getElementById('camera-flash-overlay');
                  const cameraPolaroid = document.getElementById('camera-polaroid');
                  const cameraActionGuide = document.getElementById('camera-action-guide');

                  function triggerCameraSnap() {
                    // Flash effect
                    if (cameraFlashOverlay) {
                      cameraFlashOverlay.classList.add('is-flashing');
                      setTimeout(() => {
                        cameraFlashOverlay.classList.remove('is-flashing');
                      }, 200);
                    }

                    // Fire celebratory confetti!
                    fireConfetti();

                    // Slide out polaroid film from camera slot
                    if (cameraPolaroid) {
                      cameraPolaroid.classList.add('is-developed');
                    }

                    if (cameraActionGuide) {
                      cameraActionGuide.innerHTML = '<span>✨ Developed with endless love for Soul Sister 💓</span>';
                    }
                  }

                  if (cameraShutterBtn) {
                    cameraShutterBtn.addEventListener('click', triggerCameraSnap);
                  }

                  if (cameraPolaroid) {
                    cameraPolaroid.addEventListener('click', () => {
                      if (cameraPolaroid.classList.contains('is-developed')) {
                        const img = document.getElementById('polaroid-developed-img');
                        if (img) {
                          openLightbox(img.src, 'Unique, Blood-Independent Bond & Shared Laughter 💓');
                        }
                      }
                    });
                  }

                  // --- Initial Page Setup ---
                  window.addEventListener('DOMContentLoaded', () => {
                    initAmbientParticles();
                    if (pwdInput) {
                      setTimeout(() => pwdInput.focus(), 300);
                    }
                  });

                }) ();
