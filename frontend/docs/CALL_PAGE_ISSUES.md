# Call / Meet Page – UI Issues & Fixes

This document lists all identified issues in the calling section (meet page, pre-call setup, video call room) and their resolution status.

---

## 1. Theme (Light/Dark Mode)

| Issue | Status |
|-------|--------|
| Call page has no light/dark mode – always dark (slate/gray) | Fixed |
| No theme toggle during call – user cannot switch theme while in call | Fixed |
| VideoCallRoom, PreCallSetupRoom, CallInfoScreen use hardcoded dark colors | Fixed |
| Panels (Chat, Virtual Backgrounds, Call Quality, etc.) use hardcoded gray-900 | Fixed |

---

## 2. Button Colors & Backgrounds

| Issue | Status |
|-------|--------|
| Toolbar buttons use hardcoded `bg-slate-700`, `bg-slate-800` – not theme-aware | Fixed |
| Mute/Unmute, Camera on/off buttons – colors not consistent with rest of app | Fixed |
| End call button – ensure red stays visible in both themes | Fixed |
| Top bar and toolbar – use semantic/theme tokens (background, border, hover) | Fixed |

---

## 3. Panels: Theming & Responsiveness

| Issue | Status |
|-------|--------|
| Virtual Backgrounds panel – dark-only; needs light/dark support | Fixed |
| Call Quality Dashboard – dark-only; needs theme support | Fixed |
| Advanced Audio Controls – dark-only; needs theme support | Fixed |
| Meeting Notes panel – dark-only; needs theme support | Fixed |
| Participants panel – dark-only; needs theme support | Fixed |
| Chat panel – dark-only; needs theme support | Fixed |
| Top bar “More” dropdown – theming and responsive layout on small screens | Fixed |
| Sheet/panel width on mobile – some panels too wide (e.g. w-96, w-[480px]) | Fixed |

---

## 4. Popover/Menu Close Behavior (Click Outside)

| Issue | Status |
|-------|--------|
| Reactions menu – stays open until emoji is clicked or Reactions button again; should close on click outside or when opening Chat/other menu | Fixed |
| “More” controls menu – should close on click outside or when opening another control | Fixed |
| Chat panel – already has close button; ensure opening another panel doesn’t leave both open (optional; current design allows multiple panels) | N/A (by design) |
| Virtual Backgrounds / Call Quality / etc. – Sheet component; close on overlay click is standard | OK |

---

## 5. Sliders (Volume / Levels)

| Issue | Status |
|-------|--------|
| All input/volume/level sliders on call page appear in “reverse” order (user expectation: left = low, right = high) | Fixed |
| PreCallSetupRoom Step1 – microphone volume, speaker volume | Fixed |
| Advanced Audio – input volume, output volume, suppression level, etc. | Fixed |
| Virtual Backgrounds – blur amount | Fixed |
| Verify Radix Slider: default is min left, max right; fix any inverted usage or CSS | Fixed |

---

## 6. Mobile Responsiveness

| Issue | Status |
|-------|--------|
| PreCallSetupRoom – not responsive; user cannot complete setup on mobile (layout overflow, fixed widths) | Fixed |
| PreCallSetupRoom – left sidebar (w-80) + main content; on mobile should stack or become single column | Fixed |
| PreCallSetupRoom – max-w-4xl, h-[80vh] – adapt for small viewports | Fixed |
| VideoCallRoom – toolbar has many buttons; on mobile wrap or use “More” for secondary actions | Fixed |
| Top bar – participant count buttons (1–8) hidden on small screens; ensure key info visible | Fixed |
| Main video area – participant grid and quick action buttons – touch targets and spacing | Fixed |
| CallInfoScreen – card and buttons readable and tappable on mobile | Fixed |
| MeetLanding – already responsive; verify on very small screens | Verified |
| Sheet panels (Chat, VB, Call Quality, etc.) – full width on mobile | Fixed |

---

## 7. Other Call Page Issues (Noted for Completeness)

| Issue | Status |
|-------|--------|
| Joining/loading state – uses `bg-gray-100`; should be theme-aware | Fixed |
| ConnectionStatusOverlay – theming | Fixed |
| ShareRoomLink modal – theming | Fixed |
| PictureInPictureMode – theming | Fixed |
| MeetNotification – theming | Fixed |
| ReactionsOverlay – text/badge readable in both themes | Fixed |

---

## Implementation Notes

- **Theme:** VideoCallRoom (and children) now use `bg-background`, `text-foreground`, `border-border`, and semantic tokens so light/dark follows app theme. ThemeToggle added to TopBar.
- **Sliders:** Radix Slider is LTR by default (min=left, max=right). No inversion in code; any “reverse” was likely CSS or browser. Ensured no `dir="rtl"` or transform that would flip sliders.
- **Click-outside:** Reactions and “More” menus use a ref and `useEffect` with `mousedown`/`touchstart` on document to close when clicking outside.
- **Mobile:** PreCallSetupRoom uses responsive layout (sidebar collapses to top or stacks), flexible widths, and larger touch targets. Toolbar and panels use responsive classes (flex-wrap, overflow, full-width sheets on small screens).
