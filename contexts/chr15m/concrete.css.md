---
title: Concrete CSS
description: Embed classless CSS for automatic dark mode and semantic styling with Concrete.css.
---
# Concrete CSS

Concrete.css is a lightweight, classless CSS stylesheet focused on simplicity. It provides automatic dark theme support and serves as an excellent foundation for basic websites.

## Key Features
- Classless styling - just use semantic HTML elements
- Automatic dark mode support
- Centered layout with max-width 640px using `<main>`
- Clean typography and basic element styling
- Minimal footprint

## Usage

Add to HTML:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/concrete.css/3.0.0/concrete.min.css">
```

Or install via npm:
```bash
npm install concrete.css
```
Then import:
```javascript
import 'concrete.css'
```

## Structure Examples

Basic page layout:
```html
<body>
  <header>
    <h1>Page Title</h1>
  </header>
  
  <main>
    <section>
      <h2>Section Title</h2>
      <p>Content goes here...</p>
    </section>
  </main>

  <footer>
    <p>Footer content</p>
  </footer>
</body>
```

Navigation:
```html
<nav>
  <ul>
    <li>ProjectName</li>
    <li><a href="#home">Home</a></li>
    <li><a href="#docs">Docs</a></li>
  </ul>
</nav>
```

Forms:
```html
<form>
  <label for="name">Name:</label>
  <input type="text" id="name">
  
  <label for="os">Operating System:</label>
  <select id="os">
    <option>Linux</option>
    <option>MacOS</option>
    <option>Windows</option>
  </select>
  
  <button type="submit">Submit</button>
</form>
```

## concrete.css notes

- Please don't customize the CSS colors uneccessarily as concrete.css provides sensible defaults in both light and dark mode.
- If you need to add colours to something bear in mind they should work against both light and dark backgrounds.
- Concrete has CSS variables `var(--fg)` and `var(--bg)` which you can use to set the foreground and background colors for elements.
- Basic centering and flexbox or grid layouts are fine if you need to position things.
- You can extra colours or embellishments when creating UIs that go beyond the basic concrete styles. Try to keep with the minimalist aesthetic.
