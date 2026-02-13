#!/usr/bin/env node

/**
 * SEO Crawler for CampPointe Website
 * 
 * This script crawls the built Jekyll site and performs comprehensive SEO analysis.
 * It checks for:
 * - Title tags and meta descriptions
 * - Heading structure (H1-H6)
 * - Image alt attributes
 * - Canonical URLs
 * - Structured data (Schema.org)
 * - Open Graph tags
 * - Internal linking
 * - Content quality metrics
 * 
 * Usage:
 *   node scripts/seo-crawler.js [site-directory]
 * 
 * Example:
 *   node scripts/seo-crawler.js _site
 */

const fs = require('fs');
const path = require('path');

// Check if jsdom is available, if not provide instructions
let JSDOM;
try {
  JSDOM = require('jsdom').JSDOM;
} catch (e) {
  console.error('Error: jsdom is not installed.');
  console.error('Please install it with: npm install jsdom');
  process.exit(1);
}

// Configuration
const SITE_DIR = process.argv[2] || '_site';
const OUTPUT_FILE = 'seo-report.md';

// SEO scoring weights
const ISSUE_WEIGHTS = {
  critical: 10,
  high: 5,
  medium: 3,
  low: 1
};

class SEOCrawler {
  constructor(siteDir, outputFile) {
    this.siteDir = siteDir;
    this.outputFile = outputFile;
    this.results = {
      pages: [],
      summary: {
        total_pages: 0,
        critical_issues: 0,
        high_issues: 0,
        medium_issues: 0,
        low_issues: 0,
        total_issues: 0
      }
    };
    this.seenTitles = new Map(); // title -> [files]
    this.seenDescriptions = new Map(); // description -> [files]
    this.internalLinks = new Map(); // from -> [to]
    this.pageUrls = new Set();
  }
  
  async crawl() {
    console.log('🔍 Starting SEO Audit...');
    console.log(`📂 Site directory: ${this.siteDir}\n`);
    
    if (!fs.existsSync(this.siteDir)) {
      console.error(`❌ Error: Directory ${this.siteDir} does not exist.`);
      console.error('Please build your Jekyll site first with: bundle exec jekyll build');
      process.exit(1);
    }
    
    const htmlFiles = this.findHTMLFiles(this.siteDir);
    this.results.summary.total_pages = htmlFiles.length;
    
    console.log(`Found ${htmlFiles.length} HTML pages to analyze\n`);
    
    // First pass: collect all page data
    for (const file of htmlFiles) {
      console.log(`📄 Analyzing: ${file}`);
      const analysis = await this.analyzePage(file);
      this.results.pages.push(analysis);
      
      // Track page URL
      this.pageUrls.add(analysis.url);
      
      // Update summary
      this.results.summary.critical_issues += analysis.issues.critical.length;
      this.results.summary.high_issues += analysis.issues.high.length;
      this.results.summary.medium_issues += analysis.issues.medium.length;
      this.results.summary.low_issues += analysis.issues.low.length;
    }
    
    this.results.summary.total_issues = 
      this.results.summary.critical_issues +
      this.results.summary.high_issues +
      this.results.summary.medium_issues +
      this.results.summary.low_issues;
    
    // Check for duplicate content
    this.checkDuplicates();
    
    console.log('\n📊 Generating report...');
    this.generateReport();
    console.log(`✅ SEO Audit Complete! Report saved to: ${this.outputFile}\n`);
    
    // Print summary
    this.printSummary();
    
    // Exit with error code if critical issues found
    if (this.results.summary.critical_issues > 0) {
      process.exit(1);
    }
  }
  
  findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.findHTMLFiles(filePath, fileList);
      } else if (file.endsWith('.html')) {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  }
  
  async analyzePage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    const analysis = {
      file: filePath.replace(this.siteDir + '/', ''),
      url: this.getPageURL(filePath),
      issues: {
        critical: [],
        high: [],
        medium: [],
        low: []
      },
      metadata: {},
      seo_score: 100
    };
    
    // Extract metadata
    analysis.metadata.title = this.getTitle(document);
    analysis.metadata.description = this.getMetaDescription(document);
    analysis.metadata.canonical = this.getCanonical(document);
    analysis.metadata.h1_count = document.querySelectorAll('h1').length;
    analysis.metadata.h1_text = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim());
    analysis.metadata.word_count = this.getWordCount(document);
    analysis.metadata.images_total = document.querySelectorAll('img').length;
    analysis.metadata.images_without_alt = this.getImagesWithoutAlt(document);
    analysis.metadata.internal_links = this.getInternalLinks(document, analysis.url);
    analysis.metadata.external_links = this.getExternalLinks(document);
    
    // Run SEO checks
    this.checkTitle(document, analysis);
    this.checkMetaDescription(document, analysis);
    this.checkH1Tags(document, analysis);
    this.checkCanonical(document, analysis);
    this.checkImages(document, analysis);
    this.checkStructuredData(document, analysis);
    this.checkOpenGraph(document, analysis);
    this.checkTwitterCard(document, analysis);
    this.checkLangAttribute(document, analysis);
    this.checkHeadingHierarchy(document, analysis);
    this.checkContentLength(document, analysis);
    this.checkMetaKeywords(document, analysis);
    this.checkRobotsMeta(document, analysis);
    
    // Calculate page SEO score
    analysis.seo_score = this.calculatePageScore(analysis);
    
    return analysis;
  }
  
  getPageURL(filePath) {
    let url = filePath.replace(this.siteDir, '').replace(/\\/g, '/');
    if (url.endsWith('/index.html')) {
      url = url.replace('/index.html', '/');
    } else if (url.endsWith('.html')) {
      url = url.replace('.html', '');
    }
    return url || '/';
  }
  
  getTitle(document) {
    const title = document.querySelector('title');
    return title ? title.textContent.trim() : null;
  }
  
  getMetaDescription(document) {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.getAttribute('content').trim() : null;
  }
  
  getCanonical(document) {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.getAttribute('href') : null;
  }
  
  getWordCount(document) {
    const body = document.querySelector('body');
    if (!body) return 0;
    
    // Remove script and style tags
    const clone = body.cloneNode(true);
    Array.from(clone.querySelectorAll('script, style, nav, footer, header')).forEach(el => el.remove());
    
    const text = clone.textContent.replace(/\s+/g, ' ').trim();
    return text.split(' ').filter(word => word.length > 0).length;
  }
  
  getImagesWithoutAlt(document) {
    const images = document.querySelectorAll('img');
    return Array.from(images).filter(img => {
      const alt = img.getAttribute('alt');
      return !alt || alt.trim() === '';
    }).length;
  }
  
  getInternalLinks(document, currentUrl) {
    const links = document.querySelectorAll('a[href]');
    const internalLinks = [];
    
    Array.from(links).forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
        internalLinks.push(href);
      }
    });
    
    return internalLinks;
  }
  
  getExternalLinks(document) {
    const links = document.querySelectorAll('a[href]');
    return Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && (href.startsWith('http://') || href.startsWith('https://'));
    }).length;
  }
  
  checkTitle(document, analysis) {
    const title = this.getTitle(document);
    
    if (!title) {
      analysis.issues.critical.push({
        rule: 'missing_title',
        message: 'Page is missing a title tag - essential for SEO'
      });
    } else {
      // Track titles for duplicate detection
      if (!this.seenTitles.has(title)) {
        this.seenTitles.set(title, []);
      }
      this.seenTitles.get(title).push(analysis.file);
      
      // Check length
      if (title.length > 60) {
        analysis.issues.high.push({
          rule: 'title_too_long',
          message: `Title is ${title.length} characters (recommended: 50-60). Title may be truncated in search results.`
        });
      } else if (title.length < 30) {
        analysis.issues.medium.push({
          rule: 'title_too_short',
          message: `Title is ${title.length} characters (recommended: 50-60). Consider adding more descriptive text for better CTR.`
        });
      }
      
      // Check for keyword-stuffing patterns
      const words = title.toLowerCase().split(/\s+/);
      const wordCount = {};
      words.forEach(word => {
        if (word.length > 3) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
      
      const repeated = Object.entries(wordCount).filter(([word, count]) => count > 2);
      if (repeated.length > 0) {
        analysis.issues.medium.push({
          rule: 'title_keyword_stuffing',
          message: `Possible keyword stuffing detected in title. Words repeated: ${repeated.map(([w]) => w).join(', ')}`
        });
      }
    }
  }
  
  checkMetaDescription(document, analysis) {
    const description = this.getMetaDescription(document);
    
    if (!description) {
      analysis.issues.critical.push({
        rule: 'missing_meta_description',
        message: 'Page is missing a meta description - critical for search result CTR'
      });
    } else {
      // Track descriptions for duplicate detection
      if (!this.seenDescriptions.has(description)) {
        this.seenDescriptions.set(description, []);
      }
      this.seenDescriptions.get(description).push(analysis.file);
      
      // Check length
      if (description.length > 160) {
        analysis.issues.high.push({
          rule: 'meta_desc_too_long',
          message: `Meta description is ${description.length} characters (recommended: 150-160). Description may be truncated in search results.`
        });
      } else if (description.length < 120) {
        analysis.issues.medium.push({
          rule: 'meta_desc_too_short',
          message: `Meta description is ${description.length} characters (recommended: 150-160). Consider adding more details to improve CTR.`
        });
      }
    }
  }
  
  checkH1Tags(document, analysis) {
    const h1Count = analysis.metadata.h1_count;
    
    if (h1Count === 0) {
      analysis.issues.critical.push({
        rule: 'missing_h1',
        message: 'Page is missing an H1 tag - critical for page hierarchy and SEO'
      });
    } else if (h1Count > 1) {
      analysis.issues.medium.push({
        rule: 'multiple_h1',
        message: `Page has ${h1Count} H1 tags (recommended: 1). Multiple H1s can dilute page focus. H1 texts: "${analysis.metadata.h1_text.join('", "')}"`
      });
    }
    
    // Check if H1 matches or is similar to title
    if (h1Count === 1 && analysis.metadata.title) {
      const h1 = analysis.metadata.h1_text[0].toLowerCase();
      const title = analysis.metadata.title.toLowerCase();
      
      if (!h1.includes(title.split('|')[0].trim().toLowerCase()) && 
          !title.includes(h1)) {
        analysis.issues.low.push({
          rule: 'h1_title_mismatch',
          message: 'H1 and title tag are very different. Consider aligning them for better SEO.'
        });
      }
    }
  }
  
  checkCanonical(document, analysis) {
    if (!this.getCanonical(document)) {
      analysis.issues.high.push({
        rule: 'missing_canonical',
        message: 'Page is missing a canonical URL - important for avoiding duplicate content issues'
      });
    }
  }
  
  checkImages(document, analysis) {
    const imagesWithoutAlt = analysis.metadata.images_without_alt;
    const totalImages = analysis.metadata.images_total;
    
    if (totalImages > 0 && imagesWithoutAlt > 0) {
      const severity = (imagesWithoutAlt / totalImages) > 0.5 ? 'high' : 'medium';
      analysis.issues[severity].push({
        rule: 'missing_alt_tags',
        message: `${imagesWithoutAlt} of ${totalImages} image(s) missing alt attributes (accessibility and SEO issue)`
      });
    }
    
    // Check for oversized images
    const images = document.querySelectorAll('img[src]');
    Array.from(images).forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('//')) {
        const imagePath = path.join(this.siteDir, src);
        if (fs.existsSync(imagePath)) {
          const stats = fs.statSync(imagePath);
          const sizeMB = stats.size / (1024 * 1024);
          
          if (sizeMB > 0.5) {
            analysis.issues.medium.push({
              rule: 'large_image',
              message: `Image "${src}" is ${sizeMB.toFixed(2)}MB (recommended: < 500KB). Consider optimizing.`
            });
          }
        }
      }
    });
  }
  
  checkStructuredData(document, analysis) {
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (structuredData.length === 0) {
      analysis.issues.medium.push({
        rule: 'missing_structured_data',
        message: 'Page is missing structured data (Schema.org JSON-LD). Recommended for rich snippets.'
      });
    } else {
      // Validate JSON-LD
      structuredData.forEach((script, index) => {
        try {
          JSON.parse(script.textContent);
        } catch (e) {
          analysis.issues.high.push({
            rule: 'invalid_structured_data',
            message: `Structured data block ${index + 1} contains invalid JSON: ${e.message}`
          });
        }
      });
    }
  }
  
  checkOpenGraph(document, analysis) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    
    const missing = [];
    if (!ogTitle) missing.push('og:title');
    if (!ogDescription) missing.push('og:description');
    if (!ogImage) missing.push('og:image');
    if (!ogUrl) missing.push('og:url');
    if (!ogType) missing.push('og:type');
    
    if (missing.length > 0) {
      analysis.issues.medium.push({
        rule: 'missing_og_tags',
        message: `Missing Open Graph tags for social sharing: ${missing.join(', ')}`
      });
    }
  }
  
  checkTwitterCard(document, analysis) {
    const twitterCard = document.querySelector('meta[name="twitter:card"], meta[property="twitter:card"]');
    
    if (!twitterCard) {
      analysis.issues.low.push({
        rule: 'missing_twitter_card',
        message: 'Missing Twitter Card meta tag. Recommended for better Twitter sharing.'
      });
    }
  }
  
  checkLangAttribute(document, analysis) {
    const html = document.querySelector('html');
    if (!html || !html.getAttribute('lang')) {
      analysis.issues.low.push({
        rule: 'missing_lang_attr',
        message: 'HTML tag is missing lang attribute (accessibility and SEO best practice)'
      });
    }
  }
  
  checkHeadingHierarchy(document, analysis) {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    const issues = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (previousLevel > 0 && level - previousLevel > 1) {
        issues.push(`H${previousLevel} → H${level}`);
      }
      
      previousLevel = level;
    });
    
    if (issues.length > 0) {
      analysis.issues.low.push({
        rule: 'heading_hierarchy',
        message: `Heading hierarchy is not sequential: ${issues.join(', ')}. This affects accessibility and SEO.`
      });
    }
  }
  
  checkContentLength(document, analysis) {
    const wordCount = analysis.metadata.word_count;
    
    if (wordCount < 300) {
      analysis.issues.medium.push({
        rule: 'thin_content',
        message: `Page has only ${wordCount} words. Consider adding more content (recommended: 300+ words for better SEO).`
      });
    }
  }
  
  checkMetaKeywords(document, analysis) {
    const keywords = document.querySelector('meta[name="keywords"]');
    
    if (keywords) {
      analysis.issues.low.push({
        rule: 'meta_keywords_obsolete',
        message: 'Meta keywords tag is present but obsolete. Search engines ignore it. Consider removing.'
      });
    }
  }
  
  checkRobotsMeta(document, analysis) {
    const robots = document.querySelector('meta[name="robots"]');
    
    if (robots) {
      const content = robots.getAttribute('content').toLowerCase();
      
      if (content.includes('noindex')) {
        analysis.issues.critical.push({
          rule: 'noindex_meta',
          message: 'Page has "noindex" in robots meta tag - it will not be indexed by search engines!'
        });
      }
      
      if (content.includes('nofollow')) {
        analysis.issues.high.push({
          rule: 'nofollow_meta',
          message: 'Page has "nofollow" in robots meta tag - search engines won\'t follow links on this page.'
        });
      }
    }
  }
  
  checkDuplicates() {
    // Check for duplicate titles
    this.seenTitles.forEach((files, title) => {
      if (files.length > 1) {
        files.forEach(file => {
          const page = this.results.pages.find(p => p.file === file);
          if (page) {
            page.issues.critical.push({
              rule: 'duplicate_title',
              message: `Duplicate title "${title}" found on ${files.length} pages: ${files.join(', ')}`
            });
            this.results.summary.critical_issues++;
            this.results.summary.total_issues++;
          }
        });
      }
    });
    
    // Check for duplicate descriptions
    this.seenDescriptions.forEach((files, description) => {
      if (files.length > 1) {
        files.forEach(file => {
          const page = this.results.pages.find(p => p.file === file);
          if (page) {
            page.issues.high.push({
              rule: 'duplicate_description',
              message: `Duplicate meta description found on ${files.length} pages: ${files.join(', ')}`
            });
            this.results.summary.high_issues++;
            this.results.summary.total_issues++;
          }
        });
      }
    });
  }
  
  calculatePageScore(analysis) {
    let score = 100;
    
    score -= analysis.issues.critical.length * ISSUE_WEIGHTS.critical;
    score -= analysis.issues.high.length * ISSUE_WEIGHTS.high;
    score -= analysis.issues.medium.length * ISSUE_WEIGHTS.medium;
    score -= analysis.issues.low.length * ISSUE_WEIGHTS.low;
    
    return Math.max(0, score);
  }
  
  printSummary() {
    console.log('═══════════════════════════════════════');
    console.log('📊 SEO AUDIT SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Total Pages Analyzed: ${this.results.summary.total_pages}`);
    console.log(`Total Issues Found: ${this.results.summary.total_issues}`);
    console.log('');
    console.log(`🔴 Critical Issues: ${this.results.summary.critical_issues}`);
    console.log(`🟠 High Priority: ${this.results.summary.high_issues}`);
    console.log(`🟡 Medium Priority: ${this.results.summary.medium_issues}`);
    console.log(`🔵 Low Priority: ${this.results.summary.low_issues}`);
    console.log('');
    
    // Calculate overall score
    const maxScore = this.results.summary.total_pages * 100;
    const deductions = 
      (this.results.summary.critical_issues * ISSUE_WEIGHTS.critical) +
      (this.results.summary.high_issues * ISSUE_WEIGHTS.high) +
      (this.results.summary.medium_issues * ISSUE_WEIGHTS.medium) +
      (this.results.summary.low_issues * ISSUE_WEIGHTS.low);
    const score = Math.max(0, Math.round((1 - (deductions / maxScore)) * 100));
    
    console.log(`🎯 Overall SEO Score: ${score}/100`);
    console.log('═══════════════════════════════════════');
    
    if (score >= 90) {
      console.log('✅ Excellent! Your site has strong SEO fundamentals.');
    } else if (score >= 70) {
      console.log('⚠️  Good, but needs improvement.');
    } else if (score >= 50) {
      console.log('🔶 Needs attention - several issues to fix.');
    } else {
      console.log('🚨 Critical - immediate action required!');
    }
    console.log('');
  }
  
  generateReport() {
    let report = '# 🔍 SEO Audit Report\n\n';
    report += `**Generated:** ${new Date().toISOString()}\n\n`;
    report += `**Site Directory:** ${this.siteDir}\n\n`;
    
    // Summary with score
    const maxScore = this.results.summary.total_pages * 100;
    const deductions = 
      (this.results.summary.critical_issues * ISSUE_WEIGHTS.critical) +
      (this.results.summary.high_issues * ISSUE_WEIGHTS.high) +
      (this.results.summary.medium_issues * ISSUE_WEIGHTS.medium) +
      (this.results.summary.low_issues * ISSUE_WEIGHTS.low);
    const score = Math.max(0, Math.round((1 - (deductions / maxScore)) * 100));
    
    report += '## 📊 Summary\n\n';
    report += `### 🎯 Overall SEO Score: ${score}/100\n\n`;
    
    if (score >= 90) {
      report += '✅ **Excellent!** Your site has strong SEO fundamentals.\n\n';
    } else if (score >= 70) {
      report += '⚠️ **Good, but needs improvement.** Address the issues below to boost your SEO.\n\n';
    } else if (score >= 50) {
      report += '🔶 **Needs attention.** Several important SEO issues need to be fixed.\n\n';
    } else {
      report += '🚨 **Critical issues found.** Immediate action required to improve SEO.\n\n';
    }
    
    report += `- **Total Pages Analyzed:** ${this.results.summary.total_pages}\n`;
    report += `- **Total Issues Found:** ${this.results.summary.total_issues}\n`;
    report += `  - 🔴 Critical: ${this.results.summary.critical_issues}\n`;
    report += `  - 🟠 High: ${this.results.summary.high_issues}\n`;
    report += `  - 🟡 Medium: ${this.results.summary.medium_issues}\n`;
    report += `  - 🔵 Low: ${this.results.summary.low_issues}\n\n`;
    
    // Issues by severity
    if (this.results.summary.critical_issues > 0) {
      report += '## 🔴 Critical Issues (Fix Immediately)\n\n';
      report += 'These issues severely impact SEO and must be fixed as soon as possible.\n\n';
      
      this.results.pages.forEach(page => {
        if (page.issues.critical.length > 0) {
          report += `### ${page.file}\n\n`;
          report += `**URL:** ${page.url}\n\n`;
          page.issues.critical.forEach(issue => {
            report += `- **${issue.rule}**: ${issue.message}\n`;
          });
          report += '\n';
        }
      });
    }
    
    if (this.results.summary.high_issues > 0) {
      report += '## 🟠 High Priority Issues\n\n';
      report += 'These issues significantly impact SEO and should be addressed soon.\n\n';
      
      this.results.pages.forEach(page => {
        if (page.issues.high.length > 0) {
          report += `### ${page.file}\n\n`;
          report += `**URL:** ${page.url}\n\n`;
          page.issues.high.forEach(issue => {
            report += `- **${issue.rule}**: ${issue.message}\n`;
          });
          report += '\n';
        }
      });
    }
    
    if (this.results.summary.medium_issues > 0) {
      report += '## 🟡 Medium Priority Issues\n\n';
      report += 'These issues impact SEO performance and should be addressed when possible.\n\n';
      
      this.results.pages.forEach(page => {
        if (page.issues.medium.length > 0) {
          report += `### ${page.file}\n\n`;
          report += `**URL:** ${page.url}\n\n`;
          page.issues.medium.forEach(issue => {
            report += `- **${issue.rule}**: ${issue.message}\n`;
          });
          report += '\n';
        }
      });
    }
    
    // Recommendations
    report += '## 💡 Recommendations\n\n';
    
    if (this.results.summary.critical_issues > 0) {
      report += '### ⚠️ Immediate Actions Required:\n\n';
      report += '1. **Add missing title tags** to all pages without them\n';
      report += '2. **Add missing meta descriptions** to all pages\n';
      report += '3. **Ensure every page has exactly one H1 tag**\n';
      report += '4. **Fix duplicate titles** - each page needs a unique title\n';
      report += '5. **Remove noindex tags** from pages that should be indexed\n\n';
    }
    
    if (this.results.summary.high_issues > 0) {
      report += '### 🎯 High Priority Optimizations:\n\n';
      report += '1. **Add canonical URLs** to all pages to prevent duplicate content issues\n';
      report += '2. **Add alt attributes** to all images for accessibility and SEO\n';
      report += '3. **Optimize title and meta description lengths** for better visibility\n';
      report += '4. **Ensure unique meta descriptions** for each page\n';
      report += '5. **Fix nofollow tags** if they were added unintentionally\n\n';
    }
    
    if (this.results.summary.medium_issues > 0) {
      report += '### 📈 Medium Priority Enhancements:\n\n';
      report += '1. **Add Open Graph tags** (og:title, og:description, og:image) for better social sharing\n';
      report += '2. **Implement Schema.org structured data** (LocalBusiness, RVPark) for rich snippets\n';
      report += '3. **Review pages with multiple H1 tags** and consolidate where appropriate\n';
      report += '4. **Add more content** to thin pages (aim for 300+ words on key pages)\n';
      report += '5. **Optimize large images** to improve page load speed\n\n';
    }
    
    // Page details table
    report += '## 📄 Detailed Page Analysis\n\n';
    report += '| Page | Title | Words | H1s | Images | Issues | Score |\n';
    report += '|------|-------|-------|-----|--------|--------|-------|\n';
    
    this.results.pages.forEach(page => {
      const totalIssues = 
        page.issues.critical.length +
        page.issues.high.length +
        page.issues.medium.length +
        page.issues.low.length;
      
      const titleShort = page.metadata.title 
        ? (page.metadata.title.length > 40 ? page.metadata.title.substring(0, 37) + '...' : page.metadata.title)
        : 'Missing';
      
      const scoreEmoji = page.seo_score >= 90 ? '🟢' : page.seo_score >= 70 ? '🟡' : page.seo_score >= 50 ? '🟠' : '🔴';
      
      report += `| ${page.file} | ${titleShort} | ${page.metadata.word_count} | ${page.metadata.h1_count} | ${page.metadata.images_total} | ${totalIssues} | ${scoreEmoji} ${page.seo_score} |\n`;
    });
    
    report += '\n';
    
    // SEO Best Practices
    report += '---\n\n';
    report += '## 🎯 SEO Best Practices Guide\n\n';
    
    report += '### Title Tags\n';
    report += '- **Length:** 50-60 characters\n';
    report += '- **Uniqueness:** Every page should have a unique title\n';
    report += '- **Keywords:** Include primary keyword near the beginning\n';
    report += '- **Branding:** Consider adding brand name at the end\n\n';
    
    report += '### Meta Descriptions\n';
    report += '- **Length:** 150-160 characters\n';
    report += '- **Uniqueness:** Every page should have a unique description\n';
    report += '- **Keywords:** Include target keywords naturally\n';
    report += '- **Call-to-Action:** Encourage users to click\n\n';
    
    report += '### Headings\n';
    report += '- **H1:** One per page, main page heading\n';
    report += '- **Hierarchy:** Use sequential headings (H1 → H2 → H3)\n';
    report += '- **Keywords:** Include relevant keywords naturally\n\n';
    
    report += '### Images\n';
    report += '- **Alt Text:** All images must have descriptive alt attributes\n';
    report += '- **File Size:** Optimize images (aim for < 500KB)\n';
    report += '- **Formats:** Use modern formats (WebP) when possible\n\n';
    
    report += '### Structured Data\n';
    report += '- **Schema.org:** Implement relevant schema types\n';
    report += '- **JSON-LD:** Use JSON-LD format (recommended)\n';
    report += '- **Validation:** Test with Google\'s Rich Results Test\n\n';
    
    report += '---\n\n';
    report += `**Report End** | Pages: ${this.results.summary.total_pages} | Score: ${score}/100\n`;
    
    // Write report
    fs.writeFileSync(this.outputFile, report);
  }
}

// Main execution
if (require.main === module) {
  const crawler = new SEOCrawler(SITE_DIR, OUTPUT_FILE);
  
  crawler.crawl().catch(error => {
    console.error('\n❌ Error running SEO crawler:', error);
    process.exit(1);
  });
}

module.exports = { SEOCrawler };
