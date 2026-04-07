# RMT to Inventory MongoDB Migration

This migration script transfers all RMT data from local JSON files to the new MongoDB inventory database with Vercel blob storage integration for images.

## Configuration

- **MongoDB URI**: set `MONGODB_URI` in `.env.local`
- **Blob Token**: set `BLOB_READ_WRITE_TOKEN` in `.env.local`
- **Database Name**: `inventory-mongodb`

## Website Setup

1. Make sure `.env.local` exists with the MongoDB and Blob values.
2. Run `npm install`.
3. Start the site with `npm run dev`.
4. Open `http://localhost:3000`.

If you use the contact form, also add `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` to `.env.local`.

## Collections Created

All collections are prefixed with `rmt_`:

1. **rmt_products** - Product catalog with specifications, images, and technical information
2. **rmt_categories** - Product categories with display order
3. **rmt_gallery_categories** - Gallery category structure
4. **rmt_gallery_items** - Gallery images and videos
5. **rmt_media** - Media items with active date ranges
6. **rmt_certificates** - Company certificates and awards
7. **rmt_infrastructure** - Infrastructure images and videos
8. **rmt_contacts** - Contact form submissions
9. **rmt_admin** - Admin authentication data

## Features

- **Image Migration**: All images are uploaded to Vercel blob storage with public access
- **URL Mapping**: Original `/uploads/` paths are replaced with blob storage URLs
- **Data Integrity**: Maintains all relationships and data structure
- **Indexing**: Creates appropriate indexes for performance
- **Error Handling**: Continues migration even if individual images fail

## Installation

```bash
cd /Users/ashokverma/Documents/TechRover/rmt
npm install
```

## Usage

### 1. Test Connections
```bash
npm run test-connection
```

### 2. Run Migration
```bash
npm run migrate
```

## Migration Process

1. **Connect** to MongoDB and verify blob storage access
2. **Upload Images** to Vercel blob storage and map URLs
3. **Migrate Data** to respective collections with updated image URLs
4. **Create Indexes** for optimal query performance
5. **Generate Summary** of migration results

## API Models

The `inventory-models.js` file provides MongoDB models for:
- Products management
- Categories handling
- Gallery operations
- Media management
- Certificates display
- Infrastructure showcase
- Contact form handling
- Admin authentication

## API Routes

The `inventory-api.js` file includes example API endpoints:
- `GET /api/rmt/products` - Get all products with filters
- `GET /api/rmt/products/:slug` - Get product by slug
- `GET /api/rmt/categories` - Get all categories
- `GET /api/rmt/gallery/categories` - Get gallery categories
- `GET /api/rmt/gallery/items` - Get gallery items
- `GET /api/rmt/media/active` - Get active media
- `GET /api/rmt/certificates` - Get certificates
- `GET /api/rmt/infrastructure` - Get infrastructure items
- `POST /api/rmt/contacts` - Create contact submission
- `POST /api/rmt/admin/auth` - Admin authentication

## Data Structure

### Products
- Complete product information with technical specifications
- Multiple images uploaded to blob storage
- Category relationships maintained
- Featured products flagged
- SEO-friendly slugs

### Gallery
- Categorized gallery system
- Support for both images and videos
- Display order preserved
- Header images for categories

### Media
- Time-based active media system
- Support for promotional content
- Date range filtering

## Error Handling

- Missing images are logged but don't stop migration
- Failed uploads fall back to original paths
- Database connection errors are caught and reported
- Individual collection failures don't affect others

## Post-Migration

After successful migration:
1. Update your application's database connection to use the new MongoDB URI
2. Replace image serving logic to use blob storage URLs
3. Update API endpoints to use the new collection names
4. Test all functionality with the migrated data

## Verification

Check migration success by:
1. Verifying collection counts in MongoDB
2. Testing image URLs in blob storage
3. Running API endpoints with sample queries
4. Validating data integrity and relationships