const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-charcoal-cushion:QQiAHPnya8G1jP8Y@atlas-charcoal-cushion.ame65nm.mongodb.net/?retryWrites=true&w=majority";

async function verifyMigration() {
  console.log('🔍 Verifying RMT Migration Results...\n');

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('inventory-mongodb');

    const collections = [
      'rmt_products',
      'rmt_categories', 
      'rmt_gallery_categories',
      'rmt_gallery_items',
      'rmt_media',
      'rmt_certificates',
      'rmt_infrastructure',
      'rmt_contacts',
      'rmt_admin'
    ];

    console.log('📊 Collection Statistics:');
    console.log('========================');

    let totalDocuments = 0;
    let totalBlobUrls = 0;

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      totalDocuments += count;

      // Sample document to check blob URLs
      const sample = await collection.findOne({});
      let blobUrlCount = 0;
      
      if (sample) {
        const jsonStr = JSON.stringify(sample);
        const blobMatches = jsonStr.match(/https:\/\/[^"]*\.vercel-storage\.com[^"]*/g);
        blobUrlCount = blobMatches ? blobMatches.length : 0;
        totalBlobUrls += blobUrlCount;
      }

      console.log(`${collectionName.padEnd(25)} | ${count.toString().padStart(5)} docs | ${blobUrlCount.toString().padStart(3)} blob URLs`);
    }

    console.log('========================');
    console.log(`Total Documents: ${totalDocuments}`);
    console.log(`Total Blob URLs: ${totalBlobUrls}`);

    // Detailed verification
    console.log('\n🔍 Detailed Verification:');
    console.log('=========================');

    // Check products
    const products = await db.collection('rmt_products').find({}).toArray();
    const featuredProducts = products.filter(p => p.isFeatured).length;
    console.log(`✅ Products: ${products.length} total, ${featuredProducts} featured`);

    // Check categories
    const categories = await db.collection('rmt_categories').find({}).toArray();
    const activeCategories = categories.filter(c => c.status === 'active').length;
    console.log(`✅ Categories: ${categories.length} total, ${activeCategories} active`);

    // Check gallery
    const galleryCategories = await db.collection('rmt_gallery_categories').countDocuments();
    const galleryItems = await db.collection('rmt_gallery_items').countDocuments();
    console.log(`✅ Gallery: ${galleryCategories} categories, ${galleryItems} items`);

    // Check media
    const media = await db.collection('rmt_media').find({}).toArray();
    const activeMedia = media.filter(m => m.isActive).length;
    console.log(`✅ Media: ${media.length} total, ${activeMedia} active`);

    // Check certificates
    const certificates = await db.collection('rmt_certificates').find({}).toArray();
    const activeCertificates = certificates.filter(c => c.status === 'active').length;
    console.log(`✅ Certificates: ${certificates.length} total, ${activeCertificates} active`);

    // Check infrastructure
    const infrastructure = await db.collection('rmt_infrastructure').countDocuments();
    console.log(`✅ Infrastructure: ${infrastructure} items`);

    // Check admin
    const admin = await db.collection('rmt_admin').findOne({});
    console.log(`✅ Admin: ${admin ? 'Configured' : 'Missing'}`);

    // Check indexes
    console.log('\n📋 Index Verification:');
    console.log('======================');
    
    const productIndexes = await db.collection('rmt_products').indexes();
    const categoryIndexes = await db.collection('rmt_categories').indexes();
    
    console.log(`Products indexes: ${productIndexes.length}`);
    console.log(`Categories indexes: ${categoryIndexes.length}`);

    // Sample data verification
    console.log('\n🔬 Sample Data Verification:');
    console.log('============================');

    const sampleProduct = await db.collection('rmt_products').findOne({});
    if (sampleProduct) {
      console.log(`✅ Sample Product: ${sampleProduct.name}`);
      console.log(`   - Slug: ${sampleProduct.slug}`);
      console.log(`   - Category: ${sampleProduct.category}`);
      console.log(`   - Images: ${sampleProduct.images ? sampleProduct.images.length : 0}`);
      
      if (sampleProduct.imageUrl && sampleProduct.imageUrl.includes('vercel-storage.com')) {
        console.log(`   - Main image migrated to blob storage ✅`);
      }
    }

    const sampleCategory = await db.collection('rmt_categories').findOne({});
    if (sampleCategory) {
      console.log(`✅ Sample Category: ${sampleCategory.name}`);
      console.log(`   - Slug: ${sampleCategory.slug}`);
      console.log(`   - Status: ${sampleCategory.status}`);
    }

    console.log('\n🎉 Migration Verification Complete!');
    console.log('===================================');

    if (totalDocuments > 0) {
      console.log('✅ Migration appears successful');
      console.log(`✅ ${totalDocuments} documents migrated`);
      console.log(`✅ ${totalBlobUrls} images uploaded to blob storage`);
    } else {
      console.log('❌ No documents found - migration may have failed');
    }

    await client.close();

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyMigration();