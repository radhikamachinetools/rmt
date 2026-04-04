const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-charcoal-cushion:QQiAHPnya8G1jP8Y@atlas-charcoal-cushion.ame65nm.mongodb.net/?retryWrites=true&w=majority";

class InventoryDB {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db('inventory-mongodb');
    }
    return this.db;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

// Products Model
class RMTProducts {
  constructor() {
    this.db = new InventoryDB();
  }

  async getAll(filters = {}) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_products');
    
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
    if (filters.status) query.status = filters.status;

    return await collection.find(query).sort({ order: 1 }).toArray();
  }

  async getBySlug(slug) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_products');
    return await collection.findOne({ slug });
  }

  async create(productData) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_products');
    return await collection.insertOne(productData);
  }

  async update(id, updateData) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_products');
    return await collection.updateOne({ _id: id }, { $set: updateData });
  }

  async delete(id) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_products');
    return await collection.deleteOne({ _id: id });
  }
}

// Categories Model
class RMTCategories {
  constructor() {
    this.db = new InventoryDB();
  }

  async getAll() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_categories');
    return await collection.find({ status: 'active' }).sort({ displayOrder: 1 }).toArray();
  }

  async getBySlug(slug) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_categories');
    return await collection.findOne({ slug, status: 'active' });
  }

  async create(categoryData) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_categories');
    return await collection.insertOne(categoryData);
  }
}

// Gallery Model
class RMTGallery {
  constructor() {
    this.db = new InventoryDB();
  }

  async getCategories() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_gallery_categories');
    return await collection.find({}).sort({ displayOrder: 1 }).toArray();
  }

  async getItemsByCategory(categoryId) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_gallery_items');
    return await collection.find({ categoryId }).sort({ displayOrder: 1 }).toArray();
  }

  async getAllItems() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_gallery_items');
    return await collection.find({}).sort({ displayOrder: 1 }).toArray();
  }
}

// Media Model
class RMTMedia {
  constructor() {
    this.db = new InventoryDB();
  }

  async getActive() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_media');
    const now = new Date().toISOString().split('T')[0];
    
    return await collection.find({
      isActive: true,
      activeFrom: { $lte: now },
      activeTo: { $gte: now }
    }).toArray();
  }

  async getAll() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_media');
    return await collection.find({}).toArray();
  }
}

// Certificates Model
class RMTCertificates {
  constructor() {
    this.db = new InventoryDB();
  }

  async getAll() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_certificates');
    return await collection.find({ status: 'active' }).sort({ displayOrder: 1 }).toArray();
  }
}

// Infrastructure Model
class RMTInfrastructure {
  constructor() {
    this.db = new InventoryDB();
  }

  async getAll() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_infrastructure');
    return await collection.find({}).sort({ order: 1 }).toArray();
  }
}

// Contacts Model
class RMTContacts {
  constructor() {
    this.db = new InventoryDB();
  }

  async getAll() {
    const database = await this.db.connect();
    const collection = database.collection('rmt_contacts');
    return await collection.find({}).toArray();
  }

  async create(contactData) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_contacts');
    return await collection.insertOne({
      ...contactData,
      createdAt: new Date()
    });
  }
}

// Admin Model
class RMTAdmin {
  constructor() {
    this.db = new InventoryDB();
  }

  async authenticate(username, password) {
    const database = await this.db.connect();
    const collection = database.collection('rmt_admin');
    return await collection.findOne({ username, password });
  }
}

module.exports = {
  InventoryDB,
  RMTProducts,
  RMTCategories,
  RMTGallery,
  RMTMedia,
  RMTCertificates,
  RMTInfrastructure,
  RMTContacts,
  RMTAdmin
};