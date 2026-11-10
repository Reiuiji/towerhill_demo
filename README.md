# Tower Hill Band — Website Prototyping Suite

Interactive prototypes and mobile device showcase for **Tower Hill**, a premier pop/rock cover band on the South Shore & Greater Boston, Massachusetts.

Official reference: `https://towerhillrocks.wixsite.com/tower-hill/info`  
**Asset Notice**: Uses 100% authentic band photography downloaded from official live shows. Zero AI-generated images.

---

## 🌐 Live Hosted Demo (GitHub Pages)

- 🚀 **[Version 1 Real Site Demo (`demov1`)](https://reiuiji.github.io/towerhill_demo/demov1/)** — Standalone production-ready candidate (Style A Midnight Stage Rock default + modular `themes.css`, live Google Calendar sync via `scripts/sync_calendar.py`, Cloudflare-style XOR contact bot protection, YouTube/SoundCloud embeds, Mailchimp-ready signup)
- 🎯 **[Prototype Simulator & Comparison Tool](https://reiuiji.github.io/towerhill_demo/)**

### Direct Links for Testing on Phones:
- 🎸 **[Style A: Midnight Stage Rock](https://reiuiji.github.io/towerhill_demo/prototype-stage-rock.html)**
- 🍺 **[Style B: South Shore Pub (Senior & Tech-Illiterate Friendly)](https://reiuiji.github.io/towerhill_demo/prototype-pub-friendly.html)**
- ⚡ **[Style C: Live Gig Hub (Shows First)](https://reiuiji.github.io/towerhill_demo/prototype-gig-hub.html)**
- 🏁 **[Style D: Modern Monochrome Clean](https://reiuiji.github.io/towerhill_demo/prototype-monochrome.html)**
- 📱 **[4-in-1 Mobile Showcase](https://reiuiji.github.io/towerhill_demo/all-phones-showcase.html)**

---

## 🚀 Running the Prototype Locally

Start a local static server from the project directory:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in any desktop or mobile browser.

---

## 🎨 Prototype Showcase & Files

### 1. Master Prototype Simulator & Comparison Matrix
- **`index.html`**: The primary review harness.
  - **Single View**: Toggle between all 4 styles with a single click.
  - **Device Simulator**: Preview inside realistic frames for **iPhone 18 / Pro (Dynamic Island)**, **Samsung Galaxy S25**, **Google Pixel 9**, and **Desktop 4K**, plus a **🔄 Rotate to Landscape** toggle.
  - **`👥 Compare Styles` (Split-Screen)**: Place any two styles or simulated devices side-by-side to compare in real time.
  - **Accessibility Font Scaler (`A- / Normal / A+`)**: Test readability for older eyes.
  - **Design Decisions Modal**: In-app guide explaining all solutions tailored for the band and family.

### 2. Standalone Fullscreen Pages (For Real Phones)
Share these direct URLs with band members or family to test directly on their physical phones without any simulator UI:
- **`prototype-stage-rock.html`**: *Style A: Midnight Stage Rock* — High-energy concert dark mode with fiery crimson glow and stage hero banner.
- **`prototype-pub-friendly.html`**: *Style B: South Shore Pub & Friendly* — Built for older/tech-illiterate fans with warm amber tones, 20px+ readable fonts, thick contrast borders, and oversized "Call Bob" buttons.
- **`prototype-gig-hub.html`**: *Style C: Live Gig Hub* — Tour-first layout where the upcoming show list is pinned **above the fold** in electric cyan.
- **`prototype-monochrome.html`**: *Style D: Modern Monochrome Clean* — Crisp platinum black-and-white theme directly matching the band's official emblem.

### 3. Review & Capture Tools
- **`phone-capture.html`**: Isolated phone mockup generator (`?style=rock|pub|gig|mono`).
- **`all-phones-showcase.html`**: Single-canvas 4-in-1 desktop showcase displaying all 4 phone mockups side-by-side.
- **`phone_mockups_export/`**: Pre-rendered high-resolution PNGs ready to text or email to family and the band:
  - `TowerHill_All_4_Styles_Side_by_Side_Comparison.png` (All 4 styles side-by-side)
  - `TowerHill_StyleA_Stage_Rock_iPhone.png`
  - `TowerHill_StyleB_South_Shore_Pub_iPhone.png`
  - `TowerHill_StyleC_Live_Gig_Hub_iPhone.png`
  - `TowerHill_StyleD_Modern_Monochrome_iPhone.png`

---

## 🎸 Core Design Features Implemented

1. **Top Navigation Bar Layout**:
   - **Left**: `[ 🗓️ Shows Nov 14 ]` quick jump button.
   - **Center**: Official Black & White Tower Hill emblem logo with smooth scroll-to-top.
   - **Right**: `[ ☰ MENU ]` button with both icon and text, opening a slide-down touch-friendly overlay with quick links and direct Bob dialer.
2. **Event List (Replacing Broken Wix Google Calendar)**:
   - Clean, high-contrast event cards with large date badges, venue info, and show category filters.
   - **📍 1-Click Directions**: Instant Google Maps navigation with venue pre-filled.
   - **📅 1-Click Add to Phone**: Generates a standard `.ics` calendar sync file for iPhone and Android.
3. **Bob Fallon Booking Front & Center**:
   - Dedicated booking card with 1-tap phone calling `(508) 326-4460` and 1-tap emailing `TowerHillRocks@gmail.com`.
   - Fast 3-field booking inquiry form with instant submission confirmation feedback.
4. **Music Listening Experience**:
   - Interactive audio player with hit setlist covers (Journey, Bon Jovi, Guns N' Roses, Adele, Van Morrison), animated waveforms, and interactive Web Audio synth preview.
5. **Meet the Band & Roster**:
   - Real band photo and member bios for Bob Fallon (Bass & Booking), Caroline Driscoll (Lead Vocals), Jay Driscoll (Lead Guitar), and Stormy Thorson (Drums).
6. **Social Media & Real Photo Gallery**:
   - Follow buttons for Facebook (`@TowerHillMusic`), Instagram, TikTok, and YouTube.
   - Embedded post cards and a live show photo gallery with zoom lightbox.
7. **Mobile Sticky Action Bar**:
   - Fixed bottom action bar on mobile viewports for 1-tap access to *Call Bob*, *Next Show*, and *Listen*.

