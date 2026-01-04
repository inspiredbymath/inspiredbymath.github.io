# MathFun Design System

This document outlines the design system implemented in Phase 7 of the SvelteKit migration.

## Overview

The MathFun design system provides a comprehensive set of design tokens, typography, colors, spacing, and components to ensure consistency and maintainability across the application.

## Design Tokens

All design tokens are defined in `src/lib/styles/tokens.css` and imported globally.

### Color System

#### Neutral Grays (Slate Scale)
- `--gray-50` to `--gray-900`: 9-step gray scale for text, backgrounds, and borders

#### Brand Colors
- **Teal**: `--teal-50` to `--teal-900` - Primary brand color for success states
- **Indigo**: `--indigo-50` to `--indigo-900` - Primary accent color
- **Blue**: `--blue-50` to `--blue-900` - Information and links
- **Rose**: `--rose-50` to `--rose-900` - Errors and warnings
- **Amber**: `--amber-50` to `--amber-900` - Warnings and highlights
- **Green**: `--green-50` to `--green-900` - Success states
- **Red**: `--red-50` to `--red-900` - Error states

#### Semantic Colors
```css
--color-primary: var(--gray-900)
--color-secondary: var(--gray-700)
--color-accent: var(--indigo-600)
--color-background: var(--gray-50)
--color-surface: #ffffff
--color-text-primary: var(--gray-800)
--color-text-secondary: var(--gray-500)
--color-border: var(--gray-200)
--color-success: var(--green-600)
--color-warning: var(--amber-600)
--color-error: var(--red-600)
```

### Typography

#### Font Families
- **Sans**: Inter (primary), system fallbacks
- **Serif**: Merriweather, Georgia
- **Mono**: SF Mono, Monaco, Cascadia Code

#### Font Sizes
```css
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
--text-5xl: 3rem (48px)
--text-6xl: 3.75rem (60px)
--text-7xl: 4.5rem (72px)
```

#### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

#### Line Heights
- None: 1
- Tight: 1.25
- Snug: 1.375
- Normal: 1.5
- Relaxed: 1.625
- Loose: 2

### Spacing Scale
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
--space-24: 6rem (96px)
```

### Border Radius
```css
--radius-sm: 0.25rem (4px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.25rem (20px)
--radius-full: 9999px
```

### Shadows (Elevation System)
```css
--shadow-sm: subtle shadow for cards
--shadow-base: default card shadow
--shadow-md: medium elevation
--shadow-lg: high elevation
--shadow-xl: very high elevation
--shadow-2xl: maximum elevation

/* Colored shadows for interactive elements */
--shadow-indigo: indigo glow for buttons
--shadow-teal: teal glow for success states
--shadow-blue: blue glow for links
```

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1)

/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Z-Index Scale
```css
--z-base: 0
--z-dropdown: 100
--z-sticky: 200 (navigation)
--z-fixed: 300
--z-modal: 400
--z-popover: 500
--z-tooltip: 600
```

## Component Enhancements

### Navigation
- Glassmorphism effect with backdrop blur
- Scroll-reactive shadow (increases on scroll)
- Animated underline on hover
- Active state with persistent underline
- Logo scales on hover

### Buttons
- Shine effect on hover (sliding gradient)
- Elevation changes on hover/active
- Focus-visible outline for accessibility
- Secondary variant with neutral colors

### Cards
- Smooth elevation changes on hover
- Animated top border expansion
- Focus-visible outline for keyboard navigation
- Consistent border radius

### Page Transitions
- Fade out on navigation
- Fly in from bottom with spring easing
- 400ms duration for smooth feel
- 150ms delay for exit animation

## Accessibility Features

1. **Focus States**: All interactive elements have visible focus indicators
2. **Color Contrast**: Semantic colors meet WCAG AA standards
3. **Font Rendering**: Optimized with font-smoothing and font features
4. **Transitions**: Respect prefers-reduced-motion (can be added)

## Typography Best Practices

- **Inter Font Features**: Enabled character variants (cv02, cv03, cv04, cv11) for optimal readability
- **Line Height**: Set to 1.5 (--leading-normal) for comfortable reading
- **Font Smoothing**: Antialiased rendering on all platforms

## Usage Examples

### Using Spacing
```css
padding: var(--space-4) var(--space-6);
margin-bottom: var(--space-8);
gap: var(--space-4);
```

### Using Colors
```css
background: var(--color-surface);
color: var(--color-text-primary);
border: 1px solid var(--color-border);
```

### Using Typography
```css
font-size: var(--text-lg);
font-weight: var(--font-semibold);
line-height: var(--leading-relaxed);
```

### Using Shadows
```css
box-shadow: var(--shadow-md);
/* On hover */
box-shadow: var(--shadow-xl);
```

### Using Transitions
```css
transition: all var(--transition-base);
transition: transform var(--transition-fast);
```

## File Structure

```
src/lib/styles/
├── tokens.css        # All design tokens
└── global.css        # Global styles using tokens
```

## Migration Notes

- Old CSS variables are mapped to new tokens for backward compatibility
- Components can gradually migrate to use tokens directly
- Design system is extensible - add new tokens as needed

## Performance

- **Build Size**: 880KB (includes Inter font files)
- **Font Loading**: Subset fonts loaded (Latin only)
- **CSS Bundle**: ~25KB (tokens + global styles)

## Future Enhancements

1. Dark mode support (color tokens ready)
2. Reduced motion support
3. Container queries for responsive components
4. Animation library for complex interactions
5. Component-specific design patterns
