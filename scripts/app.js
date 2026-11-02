/**
 * Tower Hill Band Website Prototyping - Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.search.includes('clean')) {
    document.body.classList.add('clean-mode');
  }
  initPrototypeControls();
  initBandNavigation();
  initEventsFilterAndCalendar();
  initAudioPlayer();
  initBookingAndMailing();
  initDesignNotesModal();
  initGalleryLightbox();
});

/* ==========================================================================
   1. PROTOTYPE CONTROLS (Theme Switcher, Device Simulator, Comparison Mode)
   ========================================================================== */
function initPrototypeControls() {
  const deviceWrapper = document.getElementById('deviceWrapper');
  const siteContainer = document.getElementById('siteContainer');
  const mainStage = document.getElementById('prototypeMainStage');
  const btnModeSingle = document.getElementById('btnModeSingle');
  const btnModeCompare = document.getElementById('btnModeCompare');
  const singleThemeGroup = document.getElementById('singleThemeGroup');
  const singleDeviceGroup = document.getElementById('singleDeviceGroup');

  const styleBadgeLabel = document.getElementById('styleBadgeLabel');
  const styleTitleLabel = document.getElementById('styleTitleLabel');
  const styleDescLabel = document.getElementById('styleDescLabel');

  const styleDescriptions = {
    'theme-rock-dark': {
      badge: 'STYLE A',
      title: 'Midnight Stage Rock (High Contrast Dark Mode)',
      desc: 'Authentic live concert tavern aesthetic with carbon-black backdrop, fiery stage glow, and bold rock headlines. Hero banner first.'
    },
    'theme-pub-clean': {
      badge: 'STYLE B',
      title: 'South Shore Pub (Senior & Tech-Illiterate Friendly)',
      desc: 'Warm tavern stone aesthetic with extra-large readable fonts, high-contrast borders, and prominent green "Call Bob" buttons. Zero clutter for older fans.'
    },
    'theme-gig-hub': {
      badge: 'STYLE C',
      title: 'Live Gig Hub (Tour & Event-First Layout)',
      desc: 'Tour-first layout where upcoming shows are placed immediately at the top above the fold. Features concert cyan accents and quick RSVP.'
    },
    'theme-monochrome-clean': {
      badge: 'STYLE D',
      title: 'Modern Monochrome (High-Contrast Platinum B&W)',
      desc: 'Crisp black-and-white minimalist design honoring the band\'s iconic emblem. High-contrast typography, platinum borders, and daylight legibility.'
    }
  };

  // Theme Buttons (Single View)
  const themeBtns = document.querySelectorAll('[data-theme-btn]');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.dataset.themeBtn;
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update theme classes
      if (siteContainer) {
        siteContainer.classList.remove('theme-rock-dark', 'theme-pub-clean', 'theme-gig-hub', 'theme-monochrome-clean');
        siteContainer.classList.add(targetTheme);
      }
      
      // Update explanation banner
      const info = styleDescriptions[targetTheme];
      if (info) {
        if (styleBadgeLabel) styleBadgeLabel.textContent = info.badge;
        if (styleTitleLabel) styleTitleLabel.textContent = info.title;
        if (styleDescLabel) styleDescLabel.textContent = info.desc;
      }
});
});

  // Device Simulator Buttons (Single View)
  const deviceBtns = document.querySelectorAll('[data-device-btn]');
  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.deviceBtn;
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (deviceWrapper) {
        deviceWrapper.className = 'device-wrapper';
        if (mode === 'desktop') {
          deviceWrapper.classList.add('mode-desktop');
        } else if (mode === 'iphone') {
          deviceWrapper.classList.add('mode-phone', 'phone-iphone');
        } else if (mode === 'samsung') {
          deviceWrapper.classList.add('mode-phone', 'phone-samsung');
        } else if (mode === 'pixel') {
          deviceWrapper.classList.add('mode-phone', 'phone-pixel');
        }
      }
});
});

  // Mode Switcher (Single View vs Side-by-Side Compare)
  if (btnModeSingle && btnModeCompare) {
    btnModeSingle.addEventListener('click', () => {
      btnModeSingle.classList.add('active');
      btnModeCompare.classList.remove('active');
      mainStage.classList.remove('comparison-active');
      if (singleThemeGroup) singleThemeGroup.style.display = 'flex';
      if (singleDeviceGroup) singleDeviceGroup.style.display = 'flex';
      if (styleBadgeLabel) styleBadgeLabel.textContent = 'STYLE A';
      if (styleTitleLabel) styleTitleLabel.textContent = 'Midnight Stage Rock (Single View)';
});

    btnModeCompare.addEventListener('click', () => {
      btnModeCompare.classList.add('active');
      btnModeSingle.classList.remove('active');
      mainStage.classList.add('comparison-active');
      if (singleThemeGroup) singleThemeGroup.style.display = 'none';
      if (singleDeviceGroup) singleDeviceGroup.style.display = 'none';
      if (styleBadgeLabel) styleBadgeLabel.textContent = 'COMPARISON MODE';
      if (styleTitleLabel) styleTitleLabel.textContent = 'Side-by-Side Showcase Comparison';
      if (styleDescLabel) styleDescLabel.textContent = 'Compare two styles or devices side-by-side. Use the dropdowns on each pane to change the style or simulated phone.';
      
      renderComparisonPanes();
});
  }

  // Comparison Panes Renderer
  let comparisonRendered = false;
  function renderComparisonPanes() {
    const frameLeft = document.getElementById('compareFrameLeft');
    const frameRight = document.getElementById('compareFrameRight');
    if (!frameLeft || !frameRight) return;

    if (!comparisonRendered) {
      // Clone left device
      const leftClone = deviceWrapper.cloneNode(true);
      leftClone.id = 'deviceWrapperLeft';
      frameLeft.innerHTML = '';
      frameLeft.appendChild(leftClone);

      // Clone right device
      const rightClone = deviceWrapper.cloneNode(true);
      rightClone.id = 'deviceWrapperRight';
      frameRight.innerHTML = '';
      frameRight.appendChild(rightClone);

      comparisonRendered = true;
      initPaneInteractions(leftClone);
      initPaneInteractions(rightClone);
    }

    applyPaneConfig('Left');
    applyPaneConfig('Right');
  }

  function applyPaneConfig(side) {
    const frameWrapper = document.getElementById(`deviceWrapper${side}`);
    const selectTheme = document.getElementById(`selectTheme${side}`);
    const selectDevice = document.getElementById(`selectDevice${side}`);
    if (!frameWrapper || !selectTheme || !selectDevice) return;

    // Apply device class
    frameWrapper.className = 'device-wrapper';
    const devMode = selectDevice.value;
    if (devMode === 'mode-desktop') {
      frameWrapper.classList.add('mode-desktop');
    } else {
      frameWrapper.classList.add('mode-phone', devMode);
    }

    // Apply theme to the viewport inside
    const viewport = frameWrapper.querySelector('.site-viewport');
    if (viewport) {
      viewport.classList.remove('theme-rock-dark', 'theme-pub-clean', 'theme-gig-hub', 'theme-monochrome-clean');
      viewport.classList.add(selectTheme.value);
    }
  }

  // Dropdown listeners for comparison panes
  ['Left', 'Right'].forEach(side => {
    const selTheme = document.getElementById(`selectTheme${side}`);
    const selDev = document.getElementById(`selectDevice${side}`);
    if (selTheme) selTheme.addEventListener('change', () => applyPaneConfig(side));
    if (selDev) selDev.addEventListener('change', () => applyPaneConfig(side));
});

  // Attach basic interactive handlers to cloned nodes
  function initPaneInteractions(wrapper) {
    const menuBtn = wrapper.querySelector('#bandMenuToggleBtn');
    const menuOverlay = wrapper.querySelector('#dropdownMenuOverlay');
    const closeBtn = wrapper.querySelector('#menuCloseBtn');
    const schedBtn = wrapper.querySelector('#navScheduleBtn');

    if (menuBtn && menuOverlay) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuOverlay.classList.contains('is-open');
        menuOverlay.classList.toggle('is-open', !isOpen);
        menuBtn.classList.toggle('active', !isOpen);
});
    }

    if (closeBtn && menuOverlay && menuBtn) {
      closeBtn.addEventListener('click', () => {
        menuOverlay.classList.remove('is-open');
        menuBtn.classList.remove('active');
});
    }

    if (schedBtn && menuOverlay) {
      schedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        menuOverlay.classList.remove('is-open');
        const shows = wrapper.querySelector('#shows');
        if (shows) shows.scrollIntoView({ behavior: 'smooth'   
});
});
    }

    const overlayLinks = wrapper.querySelectorAll('.overlay-link-card, .quick-dial-btn');
    overlayLinks.forEach(l => {
      l.addEventListener('click', () => {
        if (menuOverlay && menuBtn) {
          menuOverlay.classList.remove('is-open');
          menuBtn.classList.remove('active');
        }
});
});

    // Event filters inside cloned pane
    const filterBtns = wrapper.querySelectorAll('.event-filter-btn');
    const cards = wrapper.querySelectorAll('.event-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(c => {
          if (filter === 'all' || c.dataset.type === filter) c.style.display = 'flex';
          else c.style.display = 'none';
});
});
});
  }

  // Rotate Orientation
  const rotateBtn = document.getElementById('btnRotateDevice');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      if (deviceWrapper.classList.contains('mode-phone')) {
        deviceWrapper.classList.toggle('phone-landscape');
      }
});
  }

  // Text Scaling (Accessibility for tech-illiterate / seniors)
  let textScale = 1;
  const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
  const fontNormalBtn = document.getElementById('fontNormalBtn');
  const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
  
  function applyScale(scale) {
    textScale = scale;
    document.documentElement.style.setProperty('--text-scale', textScale);
  }
  
  if (fontDecreaseBtn) fontDecreaseBtn.addEventListener('click', () => applyScale(Math.max(0.85, textScale - 0.1)));
  if (fontNormalBtn) fontNormalBtn.addEventListener('click', () => applyScale(1));
  if (fontIncreaseBtn) fontIncreaseBtn.addEventListener('click', () => applyScale(Math.min(1.35, textScale + 0.1)));
}

/* ==========================================================================
   2. BAND TOP BAR & SLIDE-OVER DROPDOWN MENU
   ========================================================================== */
function initBandNavigation() {
  const menuBtn = document.getElementById('bandMenuToggleBtn');
  const menuOverlay = document.getElementById('dropdownMenuOverlay');
  const closeBtn = document.getElementById('menuCloseBtn');
  const scheduleBtn = document.getElementById('navScheduleBtn');
  
  function toggleMenu() {
    const isOpen = menuOverlay.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    menuOverlay.classList.add('is-open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuOverlay.classList.remove('is-open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
});
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close when clicking any menu link
  const menuLinks = document.querySelectorAll('.overlay-link-card, .quick-dial-btn');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
});
});

  // Schedule Quick Button
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      const showsSection = document.getElementById('shows');
      if (showsSection) {
        showsSection.scrollIntoView({ behavior: 'smooth'   
});
      }
});
  }

  // Close when clicking outside on desktop
  document.addEventListener('click', (e) => {
    if (menuOverlay && menuOverlay.classList.contains('is-open')) {
      if (!menuOverlay.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    }
});
}

/* ==========================================================================
   3. EVENT LIST FILTERING & 1-CLICK CALENDAR (.ICS) GENERATOR
   ========================================================================== */
function initEventsFilterAndCalendar() {
  const filterBtns = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('.event-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      eventCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (card.dataset.type === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
});
});
});

  // Calendar .ics download generator
  const calBtns = document.querySelectorAll('[data-cal-export]');
  calBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.eventTitle || 'Tower Hill Live Performance';
      const venue = btn.dataset.eventVenue || 'Venue';
      const dateStr = btn.dataset.eventDate || '20261114T203000';
      
      generateIcsFile(title, venue, dateStr);
});
});
}

function generateIcsFile(title, venue, startStr) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tower Hill Band//Live Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title} - Tower Hill Rock Band`,
    `LOCATION:${venue}`,
    `DESCRIPTION:Live Rock and Pop with Tower Hill! High energy dancing and singing. Contact Bob Fallon: 508-326-4460`,
    `DTSTART:${startStr}`,
    `DTEND:${startStr.replace('203000', '235900')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8'   
});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TowerHill_${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   4. INTERACTIVE AUDIO PREVIEW ENGINE (Web Audio API Rock Synthesizer)
   ========================================================================== */
function initAudioPlayer() {
  const playerCard = document.getElementById('musicPlayerCard');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const nowPlayingTitle = document.getElementById('nowPlayingTitle');
  const nowPlayingArtist = document.getElementById('nowPlayingArtist');
  const playlistItems = document.querySelectorAll('.playlist-item');
  const prevBtn = document.getElementById('prevTrackBtn');
  const nextBtn = document.getElementById('nextTrackBtn');

  const tracks = [
    { title: "Don't Stop Believin'", original: "Journey Cover", duration: "3:45", tempo: 118, key: "E" },
    { title: "Livin' on a Prayer", original: "Bon Jovi Cover", duration: "4:05", tempo: 122, key: "Em" },
    { title: "Sweet Child O' Mine", original: "Guns N' Roses Cover", duration: "4:12", tempo: 125, key: "D" },
    { title: "Rolling in the Deep", original: "Adele Rock Cover", duration: "3:48", tempo: 105, key: "Cm" },
    { title: "Brown Eyed Girl", original: "Van Morrison Cover", duration: "3:20", tempo: 148, key: "G" }
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  function loadTrack(idx) {
    currentTrackIdx = idx;
    playlistItems.forEach((item, i) => {
      item.classList.toggle('active', i === idx);
});
    if (nowPlayingTitle) nowPlayingTitle.textContent = tracks[idx].title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = `Tower Hill Live (${tracks[idx].original})`;
  }

  function togglePlay() {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }

  function startAudio() {
    isPlaying = true;
    playerCard.classList.add('is-playing');
    playPauseBtn.textContent = '⏸';
    playPauseBtn.setAttribute('title', 'Pause preview');

    // Initialize Web Audio synth for authentic rock power chords preview
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playRockPreviewRiff(tracks[currentTrackIdx].tempo);
    } catch (e) {
      console.log('Audio Context notice:', e);
    }
  }

  function stopAudio() {
    isPlaying = false;
    playerCard.classList.remove('is-playing');
    playPauseBtn.textContent = '▶';
    playPauseBtn.setAttribute('title', 'Play preview');
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  // Play a musical rhythm of rock chord tones
  function playRockPreviewRiff(tempo) {
    if (synthInterval) clearInterval(synthInterval);
    const chordFrequencies = [
      [164.81, 246.94, 329.63], // E power chord
      [220.00, 329.63, 440.00], // A power chord
      [146.83, 220.00, 293.66], // D power chord
      [196.00, 293.66, 392.00]  // G power chord
    ];
    let step = 0;

    function triggerChord() {
      if (!isPlaying || !audioCtx) return;
      const notes = chordFrequencies[step % chordFrequencies.length];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = i === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
});
      step++;
    }

    triggerChord();
    const beatInterval = (60 / tempo) * 1000;
    synthInterval = setInterval(triggerChord, beatInterval);
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let next = currentTrackIdx - 1;
      if (next < 0) next = tracks.length - 1;
      loadTrack(next);
      if (isPlaying) startAudio();
});
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let next = (currentTrackIdx + 1) % tracks.length;
      loadTrack(next);
      if (isPlaying) startAudio();
});
  }

  playlistItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      loadTrack(idx);
      startAudio();
});
});
}

/* ==========================================================================
   5. BOOKING FORM & MAILING LIST HANDLERS
   ========================================================================== */
function initBookingAndMailing() {
  const bookingForm = document.getElementById('quickBookingForm');
  const bookingSuccess = document.getElementById('bookingSuccessAlert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending to Bob...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        bookingForm.reset();
        if (bookingSuccess) {
          bookingSuccess.style.display = 'block';
          bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest'   
});
        }
        setTimeout(() => {
          submitBtn.textContent = 'Send Request to Bob';
          submitBtn.disabled = false;
        }, 3000);
      }, 700);
});
  }

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();
      if (email) {
        newsletterFeedback.style.display = 'block';
        newsletterFeedback.textContent = `🎸 You're on the list! We'll email ${email} when the next South Shore gig is announced.`;
        newsletterForm.reset();
      }
});
  }
}

/* ==========================================================================
   6. DESIGN NOTES & RATIONALE MODAL
   ========================================================================== */
function initDesignNotesModal() {
  const modal = document.getElementById('designNotesModal');
  const openBtn = document.getElementById('btnOpenDesignNotes');
  const closeBtn = document.getElementById('btnCloseNotes');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('is-active');
});
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-active');
});
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-active');
      }
});
  }
}

/* ==========================================================================
   7. GALLERY LIGHTBOX ZOOM (For viewing real show photos)
   ========================================================================== */
function initGalleryLightbox() {
  const thumbnails = document.querySelectorAll('.gallery-thumbnail img');
  if (!thumbnails.length) return;

  // Create lightbox element if not present
  let lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    lightbox.className = 'gallery-lightbox-backdrop';
    lightbox.innerHTML = `
      <div class="gallery-lightbox-content">
        <button class="lightbox-close-btn" aria-label="Close photo">✕</button>
        <img src="" alt="Enlarged Band Photo" class="lightbox-img">
        <p class="lightbox-caption">Tower Hill Live on South Shore Stages</p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');

  thumbnails.forEach(img => {
    img.parentElement.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('is-active');
});
});

  function closeLightbox() {
    lightbox.classList.remove('is-active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close-btn')) {
      closeLightbox();
    }
});
}
