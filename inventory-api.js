// Example API routes for the migrated RMT inventory system
// These can be used in Next.js API routes or Express.js

const {
  RMTProducts,
  RMTCategories,
  RMTGallery,
  RMTMedia,
  RMTCertificates,
  RMTInfrastructure,
  RMTContacts,
  RMTAdmin
} = require('./inventory-models');

// Products API
class ProductsAPI {
  static async getProducts(req, res) {
    try {
      const products = new RMTProducts();
      const { category, featured, status } = req.query;
      
      const filters = {};
      if (category) filters.category = category;
      if (featured) filters.isFeatured = featured === 'true';
      if (status) filters.status = status;

      const result = await products.getAll(filters);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getProductBySlug(req, res) {
    try {
      const products = new RMTProducts();
      const { slug } = req.params;
      
      const result = await products.getBySlug(slug);
      if (!result) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Categories API
class CategoriesAPI {
  static async getCategories(req, res) {
    try {
      const categories = new RMTCategories();
      const result = await categories.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getCategoryBySlug(req, res) {
    try {
      const categories = new RMTCategories();
      const { slug } = req.params;
      
      const result = await categories.getBySlug(slug);
      if (!result) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Gallery API
class GalleryAPI {
  static async getGalleryCategories(req, res) {
    try {
      const gallery = new RMTGallery();
      const result = await gallery.getCategories();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getGalleryItems(req, res) {
    try {
      const gallery = new RMTGallery();
      const { categoryId } = req.query;
      
      let result;
      if (categoryId) {
        result = await gallery.getItemsByCategory(categoryId);
      } else {
        result = await gallery.getAllItems();
      }
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Media API
class MediaAPI {
  static async getActiveMedia(req, res) {
    try {
      const media = new RMTMedia();
      const result = await media.getActive();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllMedia(req, res) {
    try {
      const media = new RMTMedia();
      const result = await media.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Certificates API
class CertificatesAPI {
  static async getCertificates(req, res) {
    try {
      const certificates = new RMTCertificates();
      const result = await certificates.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Infrastructure API
class InfrastructureAPI {
  static async getInfrastructure(req, res) {
    try {
      const infrastructure = new RMTInfrastructure();
      const result = await infrastructure.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Contacts API
class ContactsAPI {
  static async getContacts(req, res) {
    try {
      const contacts = new RMTContacts();
      const result = await contacts.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createContact(req, res) {
    try {
      const contacts = new RMTContacts();
      const result = await contacts.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Admin API
class AdminAPI {
  static async authenticate(req, res) {
    try {
      const admin = new RMTAdmin();
      const { username, password } = req.body;
      
      const result = await admin.authenticate(username, password);
      if (!result) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      
      // In a real application, you would generate a JWT token here
      res.status(200).json({ 
        success: true, 
        message: 'Authentication successful',
        user: { username: result.username }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

// Example Express.js routes setup
function setupRoutes(app) {
  // Products routes
  app.get('/api/rmt/products', ProductsAPI.getProducts);
  app.get('/api/rmt/products/:slug', ProductsAPI.getProductBySlug);

  // Categories routes
  app.get('/api/rmt/categories', CategoriesAPI.getCategories);
  app.get('/api/rmt/categories/:slug', CategoriesAPI.getCategoryBySlug);

  // Gallery routes
  app.get('/api/rmt/gallery/categories', GalleryAPI.getGalleryCategories);
  app.get('/api/rmt/gallery/items', GalleryAPI.getGalleryItems);

  // Media routes
  app.get('/api/rmt/media/active', MediaAPI.getActiveMedia);
  app.get('/api/rmt/media', MediaAPI.getAllMedia);

  // Certificates routes
  app.get('/api/rmt/certificates', CertificatesAPI.getCertificates);

  // Infrastructure routes
  app.get('/api/rmt/infrastructure', InfrastructureAPI.getInfrastructure);

  // Contacts routes
  app.get('/api/rmt/contacts', ContactsAPI.getContacts);
  app.post('/api/rmt/contacts', ContactsAPI.createContact);

  // Admin routes
  app.post('/api/rmt/admin/auth', AdminAPI.authenticate);
}

module.exports = {
  ProductsAPI,
  CategoriesAPI,
  GalleryAPI,
  MediaAPI,
  CertificatesAPI,
  InfrastructureAPI,
  ContactsAPI,
  AdminAPI,
  setupRoutes
};