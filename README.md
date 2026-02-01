# Valentine Web Experience

A mobile-only Valentine's Day web experience with two interactive pages.

## Pages

### Page 1: Valentine Question (`index.html`)
- Playful entry screen asking "Will you be my Valentine?"
- **YES button** - redirects to Page 2
- **NO button** - evasively moves away when touched/hovered

### Page 2: Luna the Cat (`luna.html`)
- Interactive virtual pet experience
- Feed, pet, and play with Luna to increase her happiness
- Four happiness states: Shy → Comfortable → Happy → Final
- Final reveal with Valentine's Day message

## Features
- Mobile-first design (375px - 428px viewport)
- Touch-optimized interactions
- Soft pink pastel aesthetic
- Animated floating hearts
- Sound effects (optional)
- Cute SVG cat illustrations included

## Quick Start

1. Open `index.html` in a mobile browser or use Chrome DevTools device emulation
2. Click "Yes" to proceed to Luna's page
3. Interact with Luna using the Feed, Pet, and Play buttons
4. Reach maximum happiness to see the Valentine's Day message

## Optional: Add Sound Effects

Add these files to `assets/sounds/` for audio feedback:
- `purr.mp3` - plays when petting Luna
- `chime.mp3` - plays when feeding or playing
- `reveal.mp3` - plays during the final reveal

## File Structure

```
val/
├── index.html              # Page 1 - Valentine question
├── luna.html               # Page 2 - Cat pet experience
├── css/
│   └── styles.css          # Shared styles (mobile-first)
├── js/
│   ├── page1.js            # Evasive button logic
│   └── page2.js            # Cat state management
├── assets/
│   ├── images/
│   │   ├── luna-shy.svg        # Shy/nervous expression
│   │   ├── luna-comfortable.svg # Relaxed expression
│   │   ├── luna-happy.svg      # Happy/excited expression
│   │   └── luna-final.svg      # Holding a heart (final)
│   └── sounds/             # Optional sound effects
└── README.md
```

## Cat States

| State | Happiness Level | Description |
|-------|-----------------|-------------|
| Shy | 0-1 | Luna is nervous and timid |
| Comfortable | 2-3 | Luna feels safe with you |
| Happy | 4-5 | Luna is very happy |
| Final | 6+ | Valentine's message revealed |

## Customization

### Replace Cat Images
You can replace the SVG files with your own PNG/SVG artwork. Just keep the same filenames or update the paths in `js/page2.js`.

### Change Messages
Edit the speech arrays in `js/page2.js` under `CAT_STATES` to customize what Luna says.

### Adjust Colors
All colors are defined as CSS custom properties in `css/styles.css` under `:root`.

## Browser Support

- iOS Safari
- Chrome for Android
- Chrome DevTools (mobile emulation)

Best viewed at 375px - 428px width (iPhone/Android phone sizes).
