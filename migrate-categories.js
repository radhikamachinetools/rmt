const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-charcoal-cushion:QQiAHPnya8G1jP8Y@atlas-charcoal-cushion.ame65nm.mongodb.net/?retryWrites=true&w=majority";

async function migrateCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('inventory-mongodb');
    const collection = db.collection('rmt_categories');
    
    // Check if categories already exist
    const existingCount = await collection.countDocuments();
    console.log(`Existing categories in MongoDB: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('Categories already exist in MongoDB. Skipping migration.');
      return;
    }
    
    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'categories.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('No categories.json file found. Creating sample categories...');
      
      const sampleCategories = [
        {
          name: "Granite Cutting Machine",
          slug: "granite-cutting-machine",
          status: "active",
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Granite Polishing Machine", 
          slug: "granite-polishing-machine",
          status: "active",
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Edge Cutting Machine",
          slug: "edge-cutting-machine", 
          status: "active",
          displayOrder: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Handling Cranes",
          slug: "handling-cranes",
          status: "active", 
          displayOrder: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Others",
          slug: "others",
          status: "active",
          displayOrder: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      const result = await collection.insertMany(sampleCategories);
      console.log(`Inserted ${result.insertedCount} sample categories`);
      return;
    }
    
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const { categories } = JSON.parse(jsonData);
    
    if (!categories || categories.length === 0) {
      console.log('No categories found in JSON file');
      return;
    }
    
    // Transform categories for MongoDB
    const mongoCategories = categories.map(cat => ({
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: cat.status || 'active',
      displayOrder: parseInt(cat.displayOrder) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const result = await collection.insertMany(mongoCategories);
    console.log(`Successfully migrated ${result.insertedCount} categories to MongoDB`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await client.close();
  }
}

// Run migration
migrateCategories().then(() => {
  console.log('Migration completed');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});