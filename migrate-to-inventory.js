const { MongoClient } = require('mongodb');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Configuration
const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-charcoal-cushion:QQiAHPnya8G1jP8Y@atlas-charcoal-cushion.ame65nm.mongodb.net/?retryWrites=true&w=majority";
const BLOB_TOKEN = "vercel_blob_rw_5g7dDBhp0vsrzBu1_uXALqvAWT6FGDAxQxNbNaH4KswlAuD";
const DATA_DIR = '/Users/ashokverma/Documents/TechRover/rmt/data';
const UPLOADS_DIR = '/Users/ashokverma/Documents/TechRover/rmt/public/uploads';

class RMTMigrator {
  constructor() {
    this.client = null;
    this.db = null;
    this.uploadedImages = new Map();
  }

  async connect() {
    this.client = new MongoClient(MONGODB_URI);
    await this.client.connect();
    this.db = this.client.db('inventory-mongodb');
    console.log('Connected to MongoDB');
  }

  async uploadImageToBlob(imagePath) {
    try {
      if (this.uploadedImages.has(imagePath)) {
        return this.uploadedImages.get(imagePath);
      }

      const fullPath = path.join(UPLOADS_DIR, imagePath.replace('/uploads/', ''));
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`Image not found: ${fullPath}`);
        return imagePath; // Return original path if file doesn't exist
      }

      const fileBuffer = fs.readFileSync(fullPath);
      const fileName = path.basename(imagePath);
      const fileExtension = path.extname(fileName);
      const timestamp = Date.now();
      const blobFileName = `rmt-${timestamp}-${fileName}`;

      const blob = await put(blobFileName, fileBuffer, {
        access: 'public',
        token: BLOB_TOKEN,
      });

      this.uploadedImages.set(imagePath, blob.url);
      console.log(`Uploaded: ${imagePath} -> ${blob.url}`);
      return blob.url;
    } catch (error) {
      console.error(`Error uploading ${imagePath}:`, error);
      return imagePath; // Return original path on error
    }
  }

  async processImageUrls(obj) {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.processImageUrls(item)));
    }
    
    if (obj && typeof obj === 'object') {
      const processed = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.startsWith('/uploads/')) {
          processed[key] = await this.uploadImageToBlob(value);
        } else if (key === 'images' && Array.isArray(value)) {
          processed[key] = await Promise.all(
            value.map(img => typeof img === 'string' && img.startsWith('/uploads/') 
              ? this.uploadImageToBlob(img) 
              : img
            )
          );
        } else {
          processed[key] = await this.processImageUrls(value);
        }
      }
      return processed;
    }
    
    return obj;
  }

  async migrateProducts() {
    console.log('Migrating products...');
    const productsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
    
    const processedProducts = await this.processImageUrls(productsData.products);
    
    const collection = this.db.collection('rmt_products');
    await collection.deleteMany({}); // Clear existing data
    
    if (processedProducts.length > 0) {
      await collection.insertMany(processedProducts);
      console.log(`Migrated ${processedProducts.length} products`);
    }
  }

  async migrateCategories() {
    console.log('Migrating categories...');
    const categoriesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));
    
    const collection = this.db.collection('rmt_categories');
    await collection.deleteMany({});
    
    if (categoriesData.categories.length > 0) {
      await collection.insertMany(categoriesData.categories);
      console.log(`Migrated ${categoriesData.categories.length} categories`);
    }
  }

  async migrateGallery() {
    console.log('Migrating gallery...');
    const galleryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gallery.json'), 'utf8'));
    
    // Migrate gallery categories
    const processedCategories = await this.processImageUrls(galleryData.galleryCategories);
    const categoriesCollection = this.db.collection('rmt_gallery_categories');
    await categoriesCollection.deleteMany({});
    if (processedCategories.length > 0) {
      await categoriesCollection.insertMany(processedCategories);
    }

    // Migrate gallery items
    const processedItems = await this.processImageUrls(galleryData.galleryItems);
    const itemsCollection = this.db.collection('rmt_gallery_items');
    await itemsCollection.deleteMany({});
    if (processedItems.length > 0) {
      await itemsCollection.insertMany(processedItems);
    }

    console.log(`Migrated ${processedCategories.length} gallery categories and ${processedItems.length} gallery items`);
  }

  async migrateMedia() {
    console.log('Migrating media...');
    const mediaData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'media.json'), 'utf8'));
    
    const processedMedia = await this.processImageUrls(mediaData.media);
    
    const collection = this.db.collection('rmt_media');
    await collection.deleteMany({});
    
    if (processedMedia.length > 0) {
      await collection.insertMany(processedMedia);
      console.log(`Migrated ${processedMedia.length} media items`);
    }
  }

  async migrateCertificates() {
    console.log('Migrating certificates...');
    const certificatesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'certificates.json'), 'utf8'));
    
    const processedCertificates = await this.processImageUrls(certificatesData.certificates);
    
    const collection = this.db.collection('rmt_certificates');
    await collection.deleteMany({});
    
    if (processedCertificates.length > 0) {
      await collection.insertMany(processedCertificates);
      console.log(`Migrated ${processedCertificates.length} certificates`);
    }
  }

  async migrateInfrastructure() {
    console.log('Migrating infrastructure...');
    const infrastructureData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'infrastructure.json'), 'utf8'));
    
    const processedItems = await this.processImageUrls(infrastructureData.items);
    
    const collection = this.db.collection('rmt_infrastructure');
    await collection.deleteMany({});
    
    if (processedItems.length > 0) {
      await collection.insertMany(processedItems);
      console.log(`Migrated ${processedItems.length} infrastructure items`);
    }
  }

  async migrateContacts() {
    console.log('Migrating contacts...');
    const contactsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'contacts.json'), 'utf8'));
    
    const collection = this.db.collection('rmt_contacts');
    await collection.deleteMany({});
    
    if (contactsData.contacts.length > 0) {
      await collection.insertMany(contactsData.contacts);
      console.log(`Migrated ${contactsData.contacts.length} contacts`);
    }
  }

  async migrateAdmin() {
    console.log('Migrating admin...');
    const adminData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'admin.json'), 'utf8'));
    
    const collection = this.db.collection('rmt_admin');
    await collection.deleteMany({});
    await collection.insertOne(adminData.admin);
    console.log('Migrated admin data');
  }

  async createIndexes() {
    console.log('Creating indexes...');
    
    // Products indexes
    await this.db.collection('rmt_products').createIndex({ slug: 1 }, { unique: true });
    await this.db.collection('rmt_products').createIndex({ category: 1 });
    await this.db.collection('rmt_products').createIndex({ isFeatured: 1 });
    await this.db.collection('rmt_products').createIndex({ order: 1 });

    // Categories indexes
    await this.db.collection('rmt_categories').createIndex({ slug: 1 }, { unique: true });
    await this.db.collection('rmt_categories').createIndex({ displayOrder: 1 });

    // Gallery indexes
    await this.db.collection('rmt_gallery_categories').createIndex({ slug: 1 }, { unique: true });
    await this.db.collection('rmt_gallery_items').createIndex({ categoryId: 1 });
    await this.db.collection('rmt_gallery_items').createIndex({ displayOrder: 1 });

    console.log('Indexes created');
  }

  async migrate() {
    try {
      await this.connect();
      
      await this.migrateProducts();
      await this.migrateCategories();
      await this.migrateGallery();
      await this.migrateMedia();
      await this.migrateCertificates();
      await this.migrateInfrastructure();
      await this.migrateContacts();
      await this.migrateAdmin();
      
      await this.createIndexes();
      
      console.log('\n=== Migration Summary ===');
      console.log(`Total images uploaded to blob storage: ${this.uploadedImages.size}`);
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      if (this.client) {
        await this.client.close();
      }
    }
  }
}

// Run migration
const migrator = new RMTMigrator();
migrator.migrate();