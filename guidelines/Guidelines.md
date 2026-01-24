# UX Portfolio Design Guidelines

## 🎨 Color Palette

### Primary Colors
- **Background**: `#000000` - Pure black for maximum contrast
- **Primary Text**: `#FFFFFF` - White for headings and emphasis
- **Secondary Text**: `#A7A7A7` - Light gray for body text

### Supporting Colors
- **Card Background**: `#0A0A0A` - Subtle elevation
- **Border**: `rgba(255, 255, 255, 0.1)` - Delicate separators
- **Hover State**: `#1A1A1A` - Interactive feedback

---

## 📏 Spacing System

Use the **8px grid system** for all spacing:

- `8px` - Tight spacing (icons, inline elements)
- `16px` - Small spacing (between related items)
- `24px` - Medium spacing (paragraph separation)
- `32px` - Large spacing (section elements)
- `48px` - XL spacing (major components)
- `64px` - 2XL spacing (section padding)
- `96px` - 3XL spacing (hero sections)
- `128px` - 4XL spacing (major section breaks)

**Rule**: All margins, padding, and gaps should be multiples of 8px.

---

## 🔤 Typography

### Font Family
**Primary Font**: IBM Plex Mono (monospace)
```css
font-family: 'IBM Plex Mono', 'Courier New', Courier, monospace;
```

**CDN Import**:
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale
- **Hero (H1)**: 64px / Bold (700) / Line height 1.3 / Letter-spacing -0.02em
- **Section Title (H2)**: 40px / Semibold (600) / Line height 1.3 / Letter-spacing -0.02em
- **Subsection (H3)**: 32px / Semibold (600) / Line height 1.3 / Letter-spacing -0.02em
- **Card Title (H4)**: 24px / Semibold (600) / Line height 1.3 / Letter-spacing -0.02em
- **Body Large**: 18px / Regular (400) / Line height 1.7 / Letter-spacing 0
- **Body**: 16px / Regular (400) / Line height 1.7 / Letter-spacing 0
- **Small/Caption**: 14px / Regular (400) / Line height 1.6 / Letter-spacing 0.02em

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Letter Spacing (Monospace Adjustments)
Monospace fonts require careful letter-spacing adjustments for optimal readability:
- **Headings**: `-0.02em` (tighter for better visual density)
- **Body Text**: `0` (default monospace spacing)
- **Small Text/Captions**: `0.02em` (wider for clarity at small sizes)
- **Buttons/CTAs**: `0.02em` (wider for emphasis)

### Line Height
Monospace fonts need slightly more generous line-height:
- **Headings**: `1.3` (was 1.2 for sans-serif)
- **Body**: `1.7` (was 1.6 for sans-serif)

### Guidelines
- Use white (#FFFFFF) for all headings
- Use gray (#A7A7A7) for body text
- Maintain generous line-height (1.6-1.7) for readability with monospace
- Limit line length to 60-70 characters (shorter than sans-serif due to monospace width)
- Use tighter letter-spacing on headings to reduce visual gaps
- Consider slightly smaller font sizes on mobile to compensate for monospace width

### Monospace Font Considerations
IBM Plex Mono is a carefully designed monospace font that:
- Has excellent readability at all sizes
- Maintains technical/developer aesthetic
- Works well for both headings and body text
- Has clear distinction between similar characters (0/O, 1/l/I)
- Supports multiple weights for hierarchy

**Pro Tip**: Monospace fonts take up more horizontal space. Consider:
- Reducing max-width of text containers slightly
- Using shorter headlines when possible
- Breaking long words with hyphens on mobile
- Testing readability across different devices

---

## 🎯 Layout Structure

### Container
- Max width: `1440px`
- Padding: `64px` on desktop, `24px` on tablet, `16px` on mobile
- Center-aligned

### Grid System
- **2-column grid**: Desktop works section
- **3-column grid**: Studio experiments
- **1-column**: Mobile (all sections)
- Gap: `32px` between grid items

### Section Padding
- Desktop: `128px` top/bottom
- Tablet: `96px` top/bottom
- Mobile: `64px` top/bottom

---

## 🎭 Interactive Elements

### Hover States
- **Links**: Opacity reduces to 70%
- **Cards**: Translate up 4px + shadow
- **Images in cards**: Scale to 105%
- **Buttons**: Translate up 2px + shadow

### Transitions
- Fast: `150ms` - Micro-interactions
- Base: `250ms` - Standard interactions
- Slow: `350ms` - Image scaling

### Buttons
- **Primary**: White background, black text, rounded full
- **Outline**: Transparent bg, white border, white text
- Padding: `16px 32px`
- Font size: `16px`
- Border radius: `999px` (fully rounded)
- Letter spacing: `0.02em` (wider for emphasis)

---

## 🖼️ Component Guidelines

### Navigation Header
- Fixed/sticky positioning
- Height: `80px`
- Logo: Left-aligned
- Menu: Center-aligned (letter-spacing: `0.02em`)
- CTA buttons: Right-aligned
- Background: Transparent with backdrop blur on scroll

### Project Cards
- Aspect ratio: 16:9 or 3:2
- Border radius: `12px`
- Image: Full width, auto height
- Overlay on hover: Dark gradient from bottom
- Title: White, 24px, semibold, letter-spacing: `-0.02em`
- Description: Gray, 16px, 2 lines max, letter-spacing: `0`
- Padding: `24px`

### Studio Grid
- Mixed sizes: 1x1, 2x1, 1x2 variations
- Masonry or CSS Grid layout
- Minimal captions (visible on hover)
- Play icons for videos/animations

### Article Cards
- Date: Gray, 14px, top, letter-spacing: `0.02em`
- Title: White, 24px, semibold, letter-spacing: `-0.02em`
- Excerpt: Gray, 16px, 3 lines max, line-height: `1.7`
- Read time: Gray, 14px, letter-spacing: `0.02em`
- Divider: 1px solid border color

### Video Cards
- Aspect ratio: 16:9
- Thumbnail: Full width
- Play button: Centered overlay
- Duration: Bottom-right badge
- Title: Below thumbnail

---

## 📱 Responsive Breakpoints
```
Desktop: 1440px+
Laptop: 1024px - 1439px
Tablet: 768px - 1023px
Mobile: 320px - 767px
```

### Mobile Adaptations
- Single column layout
- Hamburger menu for navigation
- Stack header elements vertically
- Reduce heading sizes (40px max for H1)
- Reduce body text to 16px (from 18px) for better mobile readability
- Increase touch target sizes (min 44px)
- Reduce section padding
- Consider tighter letter-spacing on very small screens if text wraps awkwardly

---

## ♿ Accessibility

### Focus States
- Visible outline: 2px solid white
- Offset: 4px from element
- Never remove focus indicators

### Color Contrast
- Background to primary text: 21:1 (AAA)
- Background to secondary text: 6.6:1 (AA)

### Touch Targets
- Minimum size: 44px × 44px
- Adequate spacing between clickable elements

### Alt Text
- All images must have descriptive alt text
- Decorative images: `alt=""`

### Readability
- Monospace fonts can be harder to read at length
- Use adequate line-height (1.7 for body text)
- Maintain proper letter-spacing
- Consider max-width of 60-70ch for text blocks

---

## 🎬 Animation Guidelines

### Scroll Animations
- Fade in + translate up 20px
- Trigger: When element is 20% in viewport
- Duration: 350ms ease-out
- Stagger child elements by 50ms

### Micro-interactions
- Button hover: Scale 1.02 + shadow
- Link hover: Opacity 0.7
- Card hover: Translate Y -4px + shadow

### Page Transitions
- Fade in: 300ms
- Slide content: 400ms ease-out

**Rule**: Keep animations subtle. Never distract from content.

---

## 📐 Design Patterns

### Hero Section
- Full viewport height or 80vh
- Large heading (64px, letter-spacing: `-0.02em`)
- Short introduction (2-3 lines, line-height: `1.7`)
- Centered or left-aligned
- Optional: Scroll indicator at bottom

### Section Headers
- Title: 40px, semibold, white, letter-spacing: `-0.02em`
- Optional subtitle: 18px, gray, line-height: `1.7`
- Bottom margin: 64px

### Footer
- Background: Slightly lighter black (#0A0A0A)
- Padding: 64px vertical
- Social icons: 24px, horizontal layout
- Copyright: 14px, gray, center-aligned, letter-spacing: `0.02em`

---

## 🛠️ Technical Implementation

### CSS Organization
1. Font imports (IBM Plex Mono from Google Fonts)
2. Variables (colors, spacing, typography)
3. Reset & base styles
4. Typography (with monospace adjustments)
5. Layout (container, grid)
6. Components (buttons, cards)
7. Utilities
8. Responsive (media queries)

### Font Loading
```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Performance
- Use `font-display: swap` for FOIT prevention
- Lazy load images below the fold
- Use WebP format with fallbacks
- Optimize video thumbnails
- Implement skeleton loaders
- Compress assets
- Consider subsetting IBM Plex Mono if only using specific weights

### Best Practices
- Use semantic HTML5 tags
- Implement proper heading hierarchy
- Add meta tags for SEO
- Test on multiple devices
- Validate HTML/CSS
- Check accessibility with tools
- Test monospace readability on various screen sizes

---

## 🚀 Development Workflow

1. **Design in Figma**: Create high-fidelity mockups with IBM Plex Mono
2. **Export assets**: Use SVG for icons, WebP for images
3. **Build mobile-first**: Start with smallest viewport (test monospace wrapping)
4. **Test thoroughly**: Multiple browsers and devices
5. **Optimize**: Compress, minify, lazy load
6. **Deploy**: Use CDN for assets

---

## ✅ Pre-Launch Checklist

- [ ] IBM Plex Mono font loads correctly
- [ ] All images have alt text
- [ ] Focus states are visible
- [ ] Touch targets are 44px minimum
- [ ] Color contrast passes WCAG AA
- [ ] Monospace text is readable at all sizes
- [ ] Letter-spacing is properly adjusted
- [ ] Line-height provides adequate readability
- [ ] Responsive on all breakpoints
- [ ] Text doesn't wrap awkwardly on mobile
- [ ] Smooth scroll behavior works
- [ ] Loading states implemented
- [ ] 404 page designed
- [ ] Meta tags added
- [ ] Favicon included
- [ ] Performance optimized (Lighthouse score 90+)
- [ ] Font subset if needed (check file size)

---

## 🎨 Design Philosophy

**Technical Aesthetic**: IBM Plex Mono brings a developer/designer hybrid feel - technical yet approachable.

**Minimalism**: Remove everything that doesn't serve a purpose.

**Clarity**: Content first, decoration second.

**Consistency**: Reuse patterns and maintain rhythm.

**Whitespace**: Let the content breathe (especially important with monospace).

**Performance**: Fast is a feature.

**Accessibility**: Design for everyone.

**Readability**: Extra attention to line-height and letter-spacing with monospace fonts.

---

## 🔤 IBM Plex Mono Character

IBM Plex Mono brings:
- **Technical credibility** - Suggests code, terminal, developer mindset
- **Unique personality** - Stands out from typical designer portfolios
- **Strong hierarchy** - Bold weights create excellent contrast
- **Retro-modern feel** - Nostalgic yet contemporary
- **Versatility** - Works for both technical and creative content

This choice positions your portfolio as both design-forward and technically sophisticated.

---

*Last updated: December 2025*
*Font: IBM Plex Mono by IBM*