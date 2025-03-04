---
title: Web Animation Easing & Timing
provenance: This is based on two chapters from https://animations.dev/
description: Create effective web animations using appropriate duration and easing functions for different UI interactions
bump: 6
---
# Web Animation Easing & Timing Cheatsheet

## Duration Guidelines

| Animation Type | Recommended Duration | Notes |
|----------------|---------------------|-------|
| Hover transitions | 150ms | Faster because user is already focused on element |
| Modal/Popover (enter) | 200ms | Combined with appropriate easing |
| Modal/Popover (exit) | 150ms | Exits are generally faster than entrances |
| Color/Opacity changes | Shorter durations | Eyes are sensitive to color changes |
| Large view changes | Up to 1000ms | Longer for significant transformations |
| Default animation | 200-300ms | Sweet spot based on human reaction time (215ms) |

> **Important**: Keep animations under 700ms in most cases to maintain perceived performance.

## Easing Types & When To Use Them

### `ease-out` 🌟
- **Best for**: Enter/exit animations, user-initiated interactions
- **Why**: Starts fast and slows down, giving a feeling of responsiveness
- **Use cases**: Opening modals, dropdown menus, components appearing
- **Note**: The most commonly used easing for UI work

### `ease-in-out`
- **Best for**: Elements moving to new positions or morphing
- **Why**: Starts slow, speeds up, then slows down - creates natural motion
- **Use cases**: Elements repositioning on screen, transformations
- **Note**: Most satisfying curve visually

### `ease-in` ⚠️
- **Best for**: Avoid in most cases
- **Why**: Slow start makes interfaces feel sluggish
- **Use cases**: Sometimes used for exit animations (though ease-out is often better)
- **Note**: Can make interfaces feel less responsive

### `linear`
- **Best for**: Continuous animations with no start/end
- **Why**: Constant speed works for ongoing motion
- **Use cases**: Loading spinners, marquees, continuous animations
- **Note**: Avoid for most UI interactions as it feels robotic

### `ease` (Default CSS)
- **Best for**: Simple hover effects
- **Why**: Subtle acceleration curve
- **Use cases**: Color changes, background transitions
- **Note**: Default timing function in CSS

### Custom Easing
- **Best for**: When standard curves don't provide enough personality
- **Why**: Offers precise control over acceleration
- **Example**: Custom sheet animation for Vaul (mimics iOS)
- **Note**: Custom easings often have stronger acceleration than built-ins

## When to Animate (and When Not To)

### Do Animate:
- To add context or explain functionality
- For state changes that need to be noticed
- Enter/exit transitions of important elements
- Where animation enriches information

### Avoid Animating:
- Frequently used elements (becomes tiring)
- Keyboard interactions (feels mechanical)
- Where instant feedback is preferred
- When animations would slow perceived performance

## Animation Philosophy

1. **Purpose**: Animation should add context, not just decoration
2. **Frequency**: Consider how often users will see the animation
3. **Perception**: Duration and easing affect perceived performance
4. **Balance**: Use expected animations (enter/exit) broadly, special animations sparingly

> "Animation is rarely delightful on its own; however, when used considerately alongside all the other pieces of the interface, the whole experience becomes delightful."