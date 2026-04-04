const { MongoClient } = require('mongodb');
const { put } = require('@vercel/blob');

// Configuration
const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-charcoal-cushion:QQiAHPnya8G1jP8Y@atlas-charcoal-cushion.ame65nm.mongodb.net/?retryWrites=true&w=majority";
const BLOB_TOKEN = "vercel_blob_rw_5g7dDBhp0vsrzBu1_uXALqvAWT6FGDAxQxNbNaH4KswlAuD";

async function testConnections() {
  console.log('Testing connections...\n');

  // Test MongoDB connection
  try {
    console.log('1. Testing MongoDB connection...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('inventory-mongodb');
    const collections = await db.listCollections().toArray();
    
    console.log('✅ MongoDB connection successful');
    console.log(`   Database: inventory-mongodb`);
    console.log(`   Existing collections: ${collections.length}`);
    
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }

  // Test Vercel Blob storage
  try {
    console.log('\n2. Testing Vercel Blob storage...');
    
    const testContent = Buffer.from('Test file for RMT migration');
    const testFileName = `test-${Date.now()}.txt`;
    
    const blob = await put(testFileName, testContent, {
      access: 'public',
      token: BLOB_TOKEN,
    });
    
    console.log('✅ Vercel Blob storage connection successful');
    console.log(`   Test file uploaded: ${blob.url}`);
    
  } catch (error) {
    console.error('❌ Vercel Blob storage connection failed:', error.message);
  }

  console.log('\nConnection tests completed.');
}

testConnections();