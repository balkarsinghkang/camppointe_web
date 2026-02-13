# SEO Crawler & Audit System

This repository includes an automated SEO crawler that analyzes your website and provides actionable recommendations on every commit.

## 🚀 Features

The SEO crawler automatically checks:

- ✅ **Title Tags** - Length, uniqueness, keyword optimization
- ✅ **Meta Descriptions** - Length, uniqueness, compelling copy
- ✅ **Heading Structure** - H1-H6 hierarchy and best practices
- ✅ **Image Optimization** - Alt tags, file sizes, accessibility
- ✅ **Canonical URLs** - Duplicate content prevention
- ✅ **Structured Data** - Schema.org JSON-LD validation
- ✅ **Open Graph Tags** - Social media optimization
- ✅ **Twitter Cards** - Twitter sharing optimization
- ✅ **Content Quality** - Word count, thin content detection
- ✅ **Technical SEO** - Lang attributes, robots meta tags
- ✅ **Duplicate Detection** - Identifies duplicate titles and descriptions across pages
- ✅ **SEO Scoring** - Overall site score with actionable insights

## 📊 How It Works

### Automated on Every Commit

The SEO crawler runs automatically via GitHub Actions whenever you:
- Push changes to `main`, `develop`, or any `copilot/**` branch
- Open or update a pull request

The workflow will:
1. Build your Jekyll site
2. Run the SEO crawler on all HTML pages
3. Generate a comprehensive SEO audit report
4. Post a summary in PR comments
5. Upload the full report as an artifact

### Manual Usage

You can also run the SEO crawler manually:

```bash
# Install dependencies
npm install

# Build the Jekyll site
bundle exec jekyll build

# Run SEO audit
npm run seo:audit

# Or do both in one command
npm run seo:build-and-audit
```

The crawler will generate a `seo-report.md` file with detailed findings.

## 📋 Understanding the Report

### SEO Score

Each page and the overall site receives a score from 0-100:

- **90-100**: 🟢 Excellent - Strong SEO fundamentals
- **70-89**: 🟡 Good - Minor improvements needed
- **50-69**: 🟠 Needs Attention - Several issues to fix
- **0-49**: 🔴 Critical - Immediate action required

### Issue Severity Levels

Issues are categorized by priority:

#### 🔴 Critical Issues (10 points each)
- Missing title tags
- Missing meta descriptions
- Missing H1 tags
- Duplicate titles across pages
- Noindex tags on important pages

#### 🟠 High Priority (5 points each)
- Missing canonical URLs
- Missing image alt attributes
- Title/description length issues
- Duplicate meta descriptions
- Nofollow tags

#### 🟡 Medium Priority (3 points each)
- Missing Open Graph tags
- Missing structured data
- Multiple H1 tags
- Thin content (< 300 words)
- Image size issues

#### 🔵 Low Priority (1 point each)
- Missing lang attribute
- Heading hierarchy issues
- Missing Twitter cards
- Obsolete meta keywords tag

## 🛠️ GitHub Actions Workflow

The SEO audit workflow (`.github/workflows/seo-audit.yml`) includes:

### 1. Jekyll Build
- Builds your site with Jekyll
- Uses the same configuration as production

### 2. SEO Crawler
- Analyzes all HTML pages
- Checks 15+ SEO factors
- Generates detailed report

### 3. Lighthouse CI
- Runs Google Lighthouse audits
- Checks performance, accessibility, and SEO
- Generates visual reports

### 4. Link Checker
- Validates internal links
- Identifies broken links

### 5. PR Comments
- Posts SEO summary in pull requests
- Highlights critical issues
- Provides action items

### 6. Artifacts
- Full SEO report (Markdown)
- Lighthouse HTML reports
- Lighthouse JSON data

## 📥 Accessing Reports

### In Pull Requests
The SEO summary is automatically posted as a comment on your PR.

### In GitHub Actions
1. Go to **Actions** tab in your repository
2. Click on the latest **SEO Audit on Commit** workflow run
3. Scroll down to **Artifacts**
4. Download `seo-audit-report`

## 🎯 Best Practices

### Title Tags
```html
<!-- Good -->
<title>CampPointe Lake Texoma RV Park | Full Hookup Sites Texas</title>

<!-- Bad - Too short -->
<title>CampPointe</title>

<!-- Bad - Too long -->
<title>CampPointe Lake Texoma RV Park with Full Hookup Sites and Amenities in Texas Near Sherman Denison</title>
```

### Meta Descriptions
```html
<!-- Good -->
<meta name="description" content="Experience premier RV camping at CampPointe Lake Texoma. Full hookups, modern amenities, and lakefront sites in Gordonville, TX. Book now!">

<!-- Bad - Too short -->
<meta name="description" content="RV park in Texas.">

<!-- Bad - Missing -->
<!-- No meta description tag -->
```

### H1 Tags
```html
<!-- Good - One H1 per page -->
<h1>Welcome to CampPointe Lake Texoma RV Park</h1>

<!-- Bad - Multiple H1s -->
<h1>Welcome</h1>
<h1>Our Services</h1>
```

### Image Alt Tags
```html
<!-- Good -->
<img src="site.jpg" alt="Lakefront RV site with full hookups at CampPointe">

<!-- Bad - Missing alt -->
<img src="site.jpg">

<!-- Bad - Generic alt -->
<img src="site.jpg" alt="image">
```

### Structured Data
```html
<!-- Good -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RVPark",
  "name": "CampPointe Lake Texoma RV Park",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21847 Farm to Market Rd 901",
    "addressLocality": "Gordonville",
    "addressRegion": "TX",
    "postalCode": "76245"
  },
  "telephone": "940-277-3435"
}
</script>
```

## 🔧 Configuration

### Customize the Crawler

Edit `scripts/seo-crawler.js` to:
- Adjust scoring weights
- Add custom checks
- Modify reporting format
- Change output location

### Customize the Workflow

Edit `.github/workflows/seo-audit.yml` to:
- Change trigger branches
- Adjust Lighthouse thresholds
- Modify artifact retention
- Add custom steps

## 📈 Continuous Improvement

### Monthly SEO Review

1. Review the SEO report from your latest commit
2. Address critical and high-priority issues
3. Track your SEO score over time
4. Monitor organic traffic in Google Analytics

### SEO Checklist for New Pages

Before creating a new page, ensure:

- [ ] Unique, descriptive title (50-60 characters)
- [ ] Unique, compelling meta description (150-160 characters)
- [ ] One H1 tag with primary keyword
- [ ] Sequential heading hierarchy (H1 → H2 → H3)
- [ ] All images have descriptive alt text
- [ ] Canonical URL is set
- [ ] Open Graph tags for social sharing
- [ ] At least 300 words of quality content
- [ ] Structured data if applicable (for location pages, amenities, etc.)

## 🐛 Troubleshooting

### Crawler Fails to Run

```bash
# Ensure Node.js is installed
node --version

# Install dependencies
npm install

# Check if _site directory exists
ls -la _site/

# Build Jekyll site first
bundle exec jekyll build
```

### Low SEO Score

1. Check the report for critical issues
2. Fix issues in order of severity (Critical → High → Medium → Low)
3. Run the crawler again to verify fixes
4. Commit changes and let GitHub Actions validate

### GitHub Actions Fails

1. Check the workflow logs for errors
2. Verify Jekyll builds successfully
3. Ensure all dependencies are installed
4. Check if there are syntax errors in HTML

## 📚 Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)
- [Open Graph Protocol](https://ogp.me/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)

## 🤝 Contributing

To improve the SEO crawler:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run seo:audit`
5. Submit a pull request

## 📝 License

This SEO audit tool is part of the CampPointe website project and follows the same license.

---

**Last Updated:** 2026-02-13

For questions or issues, please open a GitHub issue in the repository.
