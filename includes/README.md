# Header Include System

## Overview
This directory contains shared HTML components that are dynamically loaded across multiple pages to eliminate code duplication and simplify maintenance.

## Files

### header.html
Contains the complete header navigation structure including:
- Logo and branding
- Main navigation menu
- Dropdown menus
- Mobile hamburger menu
- Call-to-action buttons (Phone & Book Now)

## Implementation

### How It Works
1. Each HTML page includes a placeholder div: `<div id="header-placeholder"></div>`
2. The `js/main.js` file contains a `loadHeader()` function that fetches and inserts the header
3. The script automatically sets the active class on the current page's nav link
4. Mobile menu functionality is initialized after the header is loaded

### Usage in HTML Pages
Replace the entire `<header>` block with:
```html
<body>
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Header Placeholder -->
    <div id="header-placeholder"></div>

    <main id="main-content">
        <!-- Page content here -->
    </main>
</body>
```

## Benefits
1. **Single Source of Truth**: Update navigation in one place, applies to all pages
2. **Reduced Code Duplication**: No need to maintain header in 20+ HTML files
3. **Easier Maintenance**: Add/remove menu items once instead of editing every file
4. **Consistency**: Ensures all pages have identical navigation structure
5. **Faster Updates**: Menu changes take seconds instead of hours

## Pages Updated
- ✅ index.html
- ✅ contact.html
- ✅ location.html
- ⏳ Other pages pending...

## Future Enhancements
Consider creating additional includes for:
- `footer.html` - Common footer across all pages
- `meta-tags.html` - Shared meta tags and SEO elements
- `scripts.html` - Common JavaScript includes

## Technical Notes
- Uses Fetch API for loading includes (requires modern browser)
- Falls back gracefully if JavaScript is disabled
- Server must allow CORS for includes directory
- Works with any standard web server (Apache, Nginx, Python HTTP server, etc.)
