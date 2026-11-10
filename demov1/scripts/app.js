/**
 * Tower Hill Band Website (demov1) - Interactive Engine
 * Features:
 *  - Cloudflare-style XOR hex anti-bot contact decoder
 *  - Dynamic Google Calendar (th.2.web@gmail.com) JSON event renderer + .ics export
 *  - Solid slide-down menu, working A-/Normal/A+ font scaler, modular theme switcher
 *  - Lightbox gallery, Mailchimp-ready VIP signup, and direct booking composer
 */

document.addEventListener('DOMContentLoaded', () => {
  const contact = decodeProtectedContacts();
  initNavigationAndControls();
  initShowsSchedule(contact);
  initBookingAndMailchimp(contact);
  initGalleryLightbox();
});

/* ==========================================================================
   1. CLOUDFLARE-STYLE ANTI-BOT XOR HEX DECODER
   ========================================================================== */
function decodeCfHex(hexStr) {
  if (!hexStr || hexStr.length < 4) return '';
  const key = parseInt(hexStr.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < hexStr.length; i += 2) {
    const byte = parseInt(hexStr.slice(i, i + 2), 16);
    out += String.fromCharCode(byte ^ key);
  }
  return out;
}

function decodeProtectedContacts() {
  // Encoded values so static HTML never exposes raw phone numbers or email addresses to bots
  const ENC_PHONE_DISPLAY = '5a726f6a62737a69686c776e6e6c6a';
  const ENC_PHONE_RAW = '5a6f6a6269686c6e6e6c6a';
  const ENC_EMAIL = '5a2e352d3f283233363628353931291a3d373b333674393537';

  const phoneDisplay = decodeCfHex(ENC_PHONE_DISPLAY);
  const phoneRaw = decodeCfHex(ENC_PHONE_RAW);
  const email = decodeCfHex(ENC_EMAIL);

  document.querySelectorAll('[data-cf-phone]').forEach((el) => {
    const val = decodeCfHex(el.getAttribute('data-cf-phone')) || phoneDisplay;
    el.textContent = val;
  });

  document.querySelectorAll('[data-cf-tel]').forEach((el) => {
    const raw = decodeCfHex(el.getAttribute('data-cf-tel')) || phoneRaw;
    el.setAttribute('href', `tel:${raw}`);
  });

  document.querySelectorAll('[data-cf-sms]').forEach((el) => {
    const raw = decodeCfHex(el.getAttribute('data-cf-sms')) || phoneRaw;
    el.setAttribute('href', `sms:${raw}`);
  });

  document.querySelectorAll('[data-cf-email]').forEach((el) => {
    const addr = decodeCfHex(el.getAttribute('data-cf-email')) || email;
    if (el.tagName === 'A') {
      el.setAttribute('href', `mailto:${addr}?subject=${encodeURIComponent('Tower Hill Band Booking Inquiry')}`);
    }
    if (el.hasAttribute('data-cf-show-text')) {
      el.textContent = addr;
    }
  });

  return { phoneDisplay, phoneRaw, email };
}

/* ==========================================================================
   2. NAVIGATION, SLIDE-DOWN MENU, TEXT SCALER & MODULAR THEME SWITCHER
   ========================================================================== */
function initNavigationAndControls() {
  const navBar = document.getElementById('bandTopBar');
  const menuBtn = document.getElementById('bandMenuToggleBtn');
  const menuOverlay = document.getElementById('dropdownMenuOverlay');
  const closeBtn = document.getElementById('menuCloseBtn');
  const scheduleBtn = document.getElementById('navScheduleBtn');

  function syncNavHeight() {
    if (!navBar) return;
    const rect = navBar.getBoundingClientRect();
    document.documentElement.style.setProperty('--nav-height', `${Math.max(44, Math.round(rect.bottom))}px`);
  }

  const overlayLinks = document.querySelectorAll('.overlay-link-card');
  const trackedSections = ['shows', 'music', 'band', 'social', 'contact', 'newsletter']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveMenuLink(sectionId) {
    overlayLinks.forEach((link) => {
      const target = (link.getAttribute('href') || '').replace('#', '');
      const isMatch = target === sectionId;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function detectActiveSectionFromScroll() {
    if (!trackedSections.length) return;
    const offset = (navBar ? navBar.getBoundingClientRect().height : 60) + 120;
    let currentId = trackedSections[0].id;
    trackedSections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = sec.id;
      }
    });
    setActiveMenuLink(currentId);
  }

  function openMenu() {
    if (!menuOverlay || !menuBtn) return;
    syncNavHeight();
    detectActiveSectionFromScroll();
    menuOverlay.classList.add('is-open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!menuOverlay || !menuBtn) return;
    menuOverlay.classList.remove('is-open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  window.addEventListener('resize', () => {
    if (menuOverlay && menuOverlay.classList.contains('is-open')) syncNavHeight();
  });

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuOverlay && menuOverlay.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  overlayLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        setActiveMenuLink(targetId);
        closeMenu();
        if (targetEl) {
          requestAnimationFrame(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      } else {
        closeMenu();
      }
    });
  });

  document.querySelectorAll('.quick-dial-btn, .quick-text-btn').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  detectActiveSectionFromScroll();

  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      const showsEl = document.getElementById('shows');
      if (showsEl) showsEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.addEventListener('click', (e) => {
    if (menuOverlay && menuOverlay.classList.contains('is-open')) {
      if (!menuOverlay.contains(e.target) && (!menuBtn || !menuBtn.contains(e.target))) {
        closeMenu();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      const lb = document.getElementById('galleryLightbox');
      if (lb) lb.classList.remove('is-active');
    }
  });

  // Working Font Size Scaler (A- / Normal / A+)
  let textScale = parseFloat(localStorage.getItem('th_text_scale') || '1');
  if (Number.isNaN(textScale) || textScale < 0.85 || textScale > 1.45) textScale = 1;

  const fontDec = document.getElementById('fontDecreaseBtn');
  const fontNorm = document.getElementById('fontNormalBtn');
  const fontInc = document.getElementById('fontIncreaseBtn');

  function applyScale(scale) {
    textScale = Math.round(scale * 100) / 100;
    document.documentElement.style.setProperty('--text-scale', textScale);
    document.documentElement.style.fontSize = `${16 * textScale}px`;
    localStorage.setItem('th_text_scale', String(textScale));

    if (fontDec) fontDec.classList.toggle('active', textScale < 0.98);
    if (fontNorm) fontNorm.classList.toggle('active', Math.abs(textScale - 1) <= 0.02);
    if (fontInc) fontInc.classList.toggle('active', textScale > 1.02);
    if (menuOverlay && menuOverlay.classList.contains('is-open')) syncNavHeight();
  }

  applyScale(textScale);
  if (fontDec) fontDec.addEventListener('click', () => applyScale(Math.max(0.85, textScale - 0.15)));
  if (fontNorm) fontNorm.addEventListener('click', () => applyScale(1));
  if (fontInc) fontInc.addEventListener('click', () => applyScale(Math.min(1.45, textScale + 0.15)));

  // Modular Theme Switcher (Default: Style A 'theme-rock-dark')
  const validThemes = ['theme-rock-dark', 'theme-pub-clean', 'theme-gig-hub', 'theme-monochrome-clean'];
  const savedTheme = localStorage.getItem('th_theme');
  const initialTheme = validThemes.includes(savedTheme) ? savedTheme : 'theme-rock-dark';
  const themeButtons = document.querySelectorAll('[data-set-theme]');

  function applyTheme(themeClass) {
    validThemes.forEach((cls) => document.body.classList.remove(cls));
    document.body.classList.add(themeClass);
    localStorage.setItem('th_theme', themeClass);
    themeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setTheme === themeClass);
    });
  }

  applyTheme(initialTheme);
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.setTheme));
  });
}

/* ==========================================================================
   3. SHOWS SCHEDULE RENDERER (Synced from th.2.web@gmail.com)
   ========================================================================== */
async function initShowsSchedule(contact) {
  const listEl = document.getElementById('eventsList');
  const calWrap = document.getElementById('googleCalendarWrap');
  const filterBtns = document.querySelectorAll('.event-filter-btn');
  const navBadge = document.getElementById('navNextShowBadge');
  const menuNextShowText = document.getElementById('menuNextShowDesc');
  const ribbonDateEl = document.getElementById('ribbonNextShowDate');
  const ribbonVenueEl = document.getElementById('ribbonNextShowVenue');
  const ribbonMapsBtn = document.getElementById('ribbonDirectionsBtn');
  const ribbonCalBtn = document.getElementById('ribbonAddCalBtn');

  const FALLBACK_SHOWS = [
    {
      id: '69hm6p9jcgrmcb9p6crmcb9k6os62b9p61gmcb9ic9gm2c1p6lh3ge9pck@google.com',
      isoStart: '2026-11-21T20:00:00-05:00',
      isoEnd: '2026-11-21T23:00:00-05:00',
      icalStart: '20261122T010000Z',
      icalEnd: '20261122T040000Z',
      year: 2026,
      monthShort: 'NOV',
      monthName: 'November',
      dayNum: '21',
      dayPadded: '21',
      weekdayShort: 'SAT',
      weekdayFull: 'Saturday',
      dateFormatted: 'Sat, Nov 21, 2026',
      badgeShort: 'Nov 21',
      timeRange: '8:00 PM \u2013 11:00 PM',
      venue: 'Randolph Amvets Post 51',
      city: 'Randolph, MA',
      address: '9 Amvets Ln, Randolph, MA 02368',
      note: 'Live at Randolph Amvets Post 51 \u2022 Dancing & classic rock',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Randolph+Amvets+Post+51%2C+9+Amvets+Ln%2C+Randolph%2C+MA+02368%2C+USA',
      isNewYearsEve: false
    },
    {
      id: '70s68cr66kp6abb6cphj0b9kc9hjibb26dhj4bb66hhm4p1i69j30p9ncg@google.com',
      isoStart: '2026-12-19T20:00:00-05:00',
      isoEnd: '2026-12-19T23:59:00-05:00',
      icalStart: '20261220T010000Z',
      icalEnd: '20261220T045900Z',
      year: 2026,
      monthShort: 'DEC',
      monthName: 'December',
      dayNum: '19',
      dayPadded: '19',
      weekdayShort: 'SAT',
      weekdayFull: 'Saturday',
      dateFormatted: 'Sat, Dec 19, 2026',
      badgeShort: 'Dec 19',
      timeRange: '8:00 PM \u2013 12:00 AM',
      venue: 'Westgate Lanes',
      city: 'Brockton, MA',
      address: 'Route 27, 65 Westgate Dr. Brockton, MA 02301',
      note: 'Live at Westgate Pub & Lanes \u2022 Great food, drinks & rock covers',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Westgate+Lanes%2C+Route+27%2C+65+Westgate+Dr.+Brockton%2C+MA+02301',
      isNewYearsEve: false
    },
    {
      id: '6th32p9l60r34bb16gsmcb9k6th68b9o6cs3ib9jc8q64d1m61i6cohhcc@google.com',
      isoStart: '2026-12-31T21:00:00-05:00',
      isoEnd: '2027-01-01T00:30:00-05:00',
      icalStart: '20270101T020000Z',
      icalEnd: '20270101T053000Z',
      year: 2026,
      monthShort: 'DEC',
      monthName: 'December',
      dayNum: '31',
      dayPadded: '31',
      weekdayShort: 'THU',
      weekdayFull: 'Thursday',
      dateFormatted: 'Thu, Dec 31, 2026',
      badgeShort: 'Dec 31',
      timeRange: '9:00 PM \u2013 12:30 AM',
      venue: 'Randolph Amvets Post 51',
      city: 'Randolph, MA',
      address: '9 Amvets Ln, Randolph, MA 02368',
      note: "New Year's Eve Bash \u2022 Ring in the New Year with live rock!",
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Randolph+Amvets+Post+51%2C+9+Amvets+Ln%2C+Randolph%2C+MA+02368%2C+USA',
      isNewYearsEve: true
    }
  ];

  let shows = FALLBACK_SHOWS;
  let activeMode = 'upcoming';
  let calendarEmbedUrl =
    'https://calendar.google.com/calendar/embed?height=610&wkst=1&ctz=America%2FNew_York&mode=MONTH&showTitle=1&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&src=th.2.web%40gmail.com&color=%23E21C21';

  const calFrame = document.getElementById('googleCalendarIframe');
  if (calFrame && !calFrame.getAttribute('src')) {
    calFrame.setAttribute('src', calendarEmbedUrl);
  }

  function updateHeaderAndRibbon() {
    const now = new Date();
    const upcomingShows = shows.filter((s) => new Date(s.isoEnd) >= now);
    const nextShow = upcomingShows[0] || shows[shows.length - 1] || null;
    if (nextShow) {
      if (navBadge) navBadge.textContent = nextShow.badgeShort;
      if (menuNextShowText) menuNextShowText.textContent = `Next: ${nextShow.dateFormatted} • ${nextShow.venue} (${nextShow.city})`;
      if (ribbonDateEl) ribbonDateEl.textContent = `${nextShow.weekdayFull}, ${nextShow.monthName} ${nextShow.dayNum} • ${nextShow.timeRange}`;
      if (ribbonVenueEl) ribbonVenueEl.textContent = `${nextShow.venue} • ${nextShow.address || nextShow.city}`;
      if (ribbonMapsBtn) ribbonMapsBtn.setAttribute('href', nextShow.mapsUrl);
      if (ribbonCalBtn) {
        ribbonCalBtn.onclick = () => generateIcsFile(nextShow, contact);
      }
    }
    return { now, upcomingShows, nextShow };
  }

  function renderShowCards(mode) {
    activeMode = mode;
    if (!listEl) return;
    if (mode === 'calendar') {
      listEl.style.display = 'none';
      if (calWrap) calWrap.classList.add('is-visible');
      return;
    }

    listEl.style.display = 'flex';
    if (calWrap) calWrap.classList.remove('is-visible');

    const { now, upcomingShows, nextShow } = updateHeaderAndRibbon();
    const dataset = mode === 'all' ? shows : upcomingShows;
    if (!dataset.length) {
      listEl.innerHTML = `
        <div class="event-card">
          <div class="event-info">
            <h3 class="event-venue-name">New 2027 Dates Coming Soon!</h3>
            <p class="event-notes">We are actively booking pubs, clubs, and private events. Check Google Calendar or contact Bob Fallon to book Tower Hill.</p>
          </div>
          <div class="event-action-buttons">
            <a href="#contact" class="btn-compact btn-primary">📞 Contact Bob</a>
          </div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = '';
    dataset.forEach((show, idx) => {
      const isPast = new Date(show.isoEnd) < now;
      const isNext = nextShow && show.id === nextShow.id;

      const card = document.createElement('article');
      card.className = `event-card${isNext || show.isNewYearsEve ? ' featured-gig' : ''}${isPast ? ' is-past-show' : ''}`;

      let pillHtml = '<span class="event-tag-pill tag-upcoming">Upcoming</span>';
      if (isPast) {
        pillHtml = '<span class="event-tag-pill tag-past">Played</span>';
      } else if (show.isNewYearsEve) {
        pillHtml = '<span class="event-tag-pill tag-nye">New Year\'s Eve</span>';
      } else if (idx === 0 && mode === 'upcoming') {
        pillHtml = '<span class="event-tag-pill tag-upcoming">Next Show</span>';
      }

      const venueTitle = document.createElement('h3');
      venueTitle.className = 'event-venue-name';
      venueTitle.textContent = `${show.venue} `;
      venueTitle.insertAdjacentHTML('beforeend', pillHtml);

      card.innerHTML = `
        <div class="event-date-badge">
          <span class="event-date-month">${show.monthShort} ${String(show.year).slice(-2)}</span>
          <span class="event-date-day">${show.dayNum}</span>
          <span class="event-date-weekday">${show.weekdayShort}</span>
        </div>
        <div class="event-info">
          <div class="event-venue-slot"></div>
          <div class="event-location-time">
            <span>📍 ${show.address || show.city}</span>
            <span>⏰ ${show.timeRange}</span>
          </div>
          <p class="event-notes">${show.note || ''}</p>
        </div>
        <div class="event-action-buttons">
          <a href="${show.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-compact btn-secondary">
            <span>📍 Directions</span>
          </a>
          <button type="button" class="btn-compact btn-primary add-cal-btn">
            <span>📅 Add to Phone</span>
          </button>
        </div>
      `;
      card.querySelector('.event-venue-slot').appendChild(venueTitle);
      card.querySelector('.add-cal-btn').addEventListener('click', () => generateIcsFile(show, contact));
      listEl.appendChild(card);
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderShowCards(btn.dataset.filter || 'upcoming');
    });
  });

  renderShowCards('upcoming');

  try {
    const resp = await fetch('data/shows.json', { cache: 'no-cache' });
    if (resp.ok) {
      const payload = await resp.json();
      if (Array.isArray(payload.shows) && payload.shows.length) {
        shows = payload.shows;
      }
      if (payload.calendarEmbedUrl && calFrame) {
        calendarEmbedUrl = payload.calendarEmbedUrl;
        calFrame.setAttribute('src', calendarEmbedUrl);
      }
      renderShowCards(activeMode);
    }
  } catch (err) {
    console.warn('Using bundled show snapshot (data/shows.json unreachable):', err);
  }
}

function generateIcsFile(show, contact) {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tower Hill Band//Live Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:Tower Hill Live at ${show.venue}`,
    `LOCATION:${show.address || show.city}`,
    `DESCRIPTION:Live rock and pop covers with Tower Hill! Booking info: Bob Fallon ${contact.phoneDisplay}`,
    `DTSTART:${show.icalStart}`,
    `DTEND:${show.icalEnd || show.icalStart}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TowerHill_${show.venue.replace(/[^a-zA-Z0-9]+/g, '_')}_${show.monthShort}${show.dayPadded}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   4. BOOKING COMPOSER & MAILCHIMP VIP SIGNUP
   ========================================================================== */
function initBookingAndMailchimp(contact) {
  const bookingForm = document.getElementById('quickBookingForm');
  const bookingSuccess = document.getElementById('bookingSuccessAlert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('clientName')?.value || '').trim();
      const clientContact = (document.getElementById('clientContact')?.value || '').trim();
      const eventDate = document.getElementById('eventDate')?.value || 'Flexible / TBD';
      const eventDetails = (document.getElementById('eventDetails')?.value || '').trim();

      const subject = encodeURIComponent(`Booking Request: ${name} (${eventDate})`);
      const body = encodeURIComponent(
        `Hi Bob,\n\nI'd like to inquire about booking Tower Hill.\n\n` +
        `Name: ${name}\n` +
        `Phone / Email: ${clientContact}\n` +
        `Target Date: ${eventDate}\n` +
        `Venue / Event Notes: ${eventDetails || 'N/A'}\n`
      );

      // Launch user's email app pre-addressed to decoded booking email
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

      if (bookingSuccess) {
        bookingSuccess.style.display = 'block';
        bookingSuccess.innerHTML =
          `✅ Ready to send! Your email app should open addressed to <strong>${contact.email}</strong>. ` +
          `Prefer texting or calling? Reach Bob directly at <strong>${contact.phoneDisplay}</strong>.`;
      }
    });
  }

  // Mailchimp configuration: replace MAILCHIMP_ACTION_URL with the band's real Mailchimp embed post URL
  const MAILCHIMP_ACTION_URL = '';
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    if (MAILCHIMP_ACTION_URL) {
      newsletterForm.setAttribute('action', MAILCHIMP_ACTION_URL);
      newsletterForm.setAttribute('method', 'post');
      newsletterForm.setAttribute('target', '_blank');
    } else {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('mce-EMAIL');
        const val = emailInput ? emailInput.value.trim() : '';
        if (val && newsletterFeedback) {
          newsletterFeedback.style.display = 'block';
          newsletterFeedback.textContent =
            `🎸 Preview Confirmed for ${val}! Once your Mailchimp List Action URL is connected, subscribers go straight into your Mailchimp audience for 1-click gig blasts.`;
          newsletterForm.reset();
        }
      });
    }
  }
}

/* ==========================================================================
   5. PHOTO GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  document.querySelectorAll('.gallery-thumbnail img').forEach((img) => {
    img.parentElement.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.textContent = img.alt || 'Tower Hill Live';
      lightbox.classList.add('is-active');
    });
  });

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => lightbox.classList.remove('is-active'));
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('is-active');
    });
  }
}
