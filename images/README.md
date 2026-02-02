# CampPointe Images Directory

This directory contains documentation and links to images used on the CampPointe Lake Texoma RV Park website.

## Current Image Sources

All images are currently sourced from the original CampPointe website hosted on Wix. These are high-quality, professional images that showcase the actual facilities and location.

### Image Mapping

| Local Filename | Wix URL | Usage | Description |
|---------------|---------|--------|-------------|
| `hero-lake-texoma-rv-park.jpg` | `https://static.wixstatic.com/media/e155e8_3b35663a9275438da928518570a2d1d6~mv2.jpg` | Homepage hero section | Main hero image showing RV park facilities |
| `rv-sites-lake-texoma.jpg` | `https://static.wixstatic.com/media/e155e8_c3fe3594fe964392828c11d86c351d38~mv2.jpg` | Homepage services, Services page | RV sites and camping facilities |
| `lake-texoma-map-location.jpg` | `https://static.wixstatic.com/media/e155e8_06044217265e48ceb4907717734501bc~mv2.jpg` | Homepage location, About page, Contact page | Lake Texoma location and area map |
| `camppointe-history.jpg` | `https://static.wixstatic.com/media/e155e8_d8a6e0a0e2344b449bed7ee7b8a2b8c2~mv2.jpg` | About page | Historical/about section image |
| `camppointe-office-checkin.jpg` | `https://static.wixstatic.com/media/e155e8_e466b663ae8e48d5a5be3533c8b0d621~mv2.jpg` | Rates page, Contact page | Office and check-in area |

### Image Categories

#### **Facility Images**
- RV sites and hookups
- Office and check-in areas
- Park amenities and facilities

#### **Location Images**  
- Lake Texoma views and maps
- Area attractions and activities
- Regional location context

#### **Activity Images**
- Water sports and recreation
- Fishing and boating
- Family and group activities

## Image Optimization

All images use:
- **Lazy loading** for performance (except hero image)
- **Responsive sizing** through Wix CDN parameters
- **SEO-optimized alt text** for accessibility
- **WebP/AVIF formats** when supported by Wix CDN

## Future Image Additions

For adding new images:
1. Use high-resolution originals (minimum 1920px width)
2. Optimize for web (compress while maintaining quality)
3. Follow naming convention: `category-description.jpg`
4. Update this README with new mappings
5. Ensure proper alt text for accessibility

## Local Development

For local development, you may want to download and host these images locally:
```bash
# Create images directory structure
mkdir -p images/{facilities,location,activities}

# Download images using curl or wget
# Example: wget -O images/hero-lake-texoma-rv-park.jpg "https://static.wixstatic.com/media/e155e8_3b35663a9275438da928518570a2d1d6~mv2.jpg"
```

## Performance Notes

The current implementation uses Wix CDN URLs which provide:
- ✅ Automatic format optimization (WebP/AVIF)
- ✅ Dynamic resizing based on device
- ✅ Global CDN delivery
- ✅ Consistent availability

Consider migrating to a dedicated image hosting solution (like Cloudinary or AWS S3 + CloudFront) for production if you want more control over image delivery and optimization.