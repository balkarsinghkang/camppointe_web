# 🚀 SEO Crawler Quick Start

## What is it?

An automated SEO crawler that analyzes your website on every commit and provides actionable recommendations to improve your search engine rankings.

## How does it work?

1. **Automatic Analysis**: Every time you commit changes to your website, a GitHub Actions workflow automatically:
   - Builds your Jekyll site
   - Analyzes all HTML pages for SEO issues
   - Generates a comprehensive report
   - Posts a summary in your pull request

2. **Comprehensive Checks**: The crawler examines:
   - Title tags and meta descriptions
   - Heading structure (H1-H6)
   - Image alt attributes
   - Canonical URLs
   - Structured data (Schema.org)
   - Open Graph tags for social media
   - Content quality and length
   - Duplicate content detection
   - Technical SEO factors

3. **Actionable Recommendations**: Get prioritized recommendations:
   - 🔴 **Critical** - Fix immediately (missing titles, meta descriptions)
   - 🟠 **High** - Address soon (missing canonical URLs, alt tags)
   - 🟡 **Medium** - Improve when possible (Open Graph tags, content length)
   - 🔵 **Low** - Nice to have (minor technical improvements)

## Quick Examples

### ✅ Good SEO
```html
<title>CampPointe Lake Texoma RV Park | Full Hookup Sites Texas</title>
<meta name="description" content="Experience premier RV camping at Lake Texoma with full hookups, modern amenities, and lakefront sites. Book your spot today!">
<h1>Welcome to CampPointe Lake Texoma</h1>
<img src="site.jpg" alt="Lakefront RV site with full hookups at CampPointe">
```

### ❌ Common Issues
```html
<!-- Missing meta description -->
<title>CampPointe</title> <!-- Too short -->
<h1>Welcome</h1>
<h1>Our Services</h1> <!-- Multiple H1s -->
<img src="site.jpg"> <!-- Missing alt text -->
```

## Running Locally

```bash
# Install dependencies
npm install

# Run audit (after building Jekyll site)
npm run seo:audit
```

## Viewing Results

### In GitHub
- **Actions Tab**: View full audit reports
- **Pull Requests**: See automatic comments with SEO summary
- **Artifacts**: Download detailed reports and Lighthouse results

### Locally
- Check `seo-report.md` after running the audit

## Understanding Your Score

- **90-100**: 🟢 Excellent - Strong SEO fundamentals
- **70-89**: 🟡 Good - Minor improvements needed
- **50-69**: 🟠 Needs Attention - Several issues to fix
- **0-49**: 🔴 Critical - Immediate action required

## Common Fixes

### Fix Missing Title Tags
```html
<!-- Before -->
<head>
</head>

<!-- After -->
<head>
  <title>Page Name | CampPointe Lake Texoma RV Park</title>
</head>
```

### Fix Missing Meta Descriptions
```html
<!-- Before -->
<head>
  <title>Amenities</title>
</head>

<!-- After -->
<head>
  <title>Amenities | CampPointe Lake Texoma RV Park</title>
  <meta name="description" content="Discover modern RV park amenities at CampPointe Lake Texoma including full hookups, WiFi, laundry, and more. Reserve your site today!">
</head>
```

### Fix Missing Alt Tags
```html
<!-- Before -->
<img src="pool.jpg">

<!-- After -->
<img src="pool.jpg" alt="Heated swimming pool at CampPointe RV Park">
```

### Fix Multiple H1 Tags
```html
<!-- Before -->
<h1>Welcome to CampPointe</h1>
<h1>Our Amenities</h1>

<!-- After -->
<h1>Welcome to CampPointe</h1>
<h2>Our Amenities</h2>
```

## Need Help?

- 📖 Full documentation: [SEO_CRAWLER.md](SEO_CRAWLER.md)
- 🐛 Issues: Open a GitHub issue
- 💡 Questions: Check the workflow logs in GitHub Actions

## Pro Tips

1. **Fix Critical Issues First**: Start with red 🔴 issues as they have the biggest SEO impact
2. **Unique Content**: Make sure every page has a unique title and description
3. **Descriptive Text**: Write titles and descriptions for humans, not just search engines
4. **Test Regularly**: Run the audit after making significant changes
5. **Monitor Trends**: Track your SEO score over time to see improvements

---

**Happy Optimizing! 🚀**
