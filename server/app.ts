import express, { Request, Response, NextFunction } from 'express';
import { db, verifyPassword, generateToken, verifyToken } from './db.ts';
import type { OrderStatus } from '../src/types/index.ts';

export const backendApp = express();

backendApp.use(express.json({ limit: '10mb' }));
backendApp.use(express.urlencoded({ extended: true }));

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}

// Authentication Middleware
export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privileges required' });
  }
  next();
}

backendApp.use(authMiddleware);

// Health check
backendApp.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Atelier Commerce Backend API', timestamp: new Date().toISOString() });
});

// --- Auth Endpoints ---
backendApp.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, city, postalCode } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = db.createUser({
      name,
      email,
      password,
      role: 'user',
      phone,
      address,
      city,
      postalCode,
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

backendApp.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const rawUser = db.findUserByEmail(email);
    if (!rawUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = verifyPassword(password, rawUser.salt, rawUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { passwordHash: _, salt: __, ...user } = rawUser;
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

backendApp.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// --- Products Endpoints ---
backendApp.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, brand, search, sort, featured } = req.query;
    const products = db.getProducts({
      category: category as string,
      brand: brand as string,
      search: search as string,
      sort: sort as string,
      featured: featured === 'true',
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

backendApp.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

backendApp.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, description, price, originalPrice, categoryId, categoryName, brandId, brandName, stock, image, featured, specs } = req.body;
    if (!title || price === undefined || !categoryId || !brandId) {
      return res.status(400).json({ error: 'Title, price, category, and brand are required' });
    }

    const newProduct = db.createProduct({
      title,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      categoryId,
      categoryName: categoryName || 'Uncategorized',
      brandId,
      brandName: brandName || 'Generic',
      stock: Number(stock) || 0,
      image: image || '',
      featured: Boolean(featured),
      rating: 5.0,
      reviewsCount: 1,
      specs: specs || {},
    });
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

backendApp.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

backendApp.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// --- Categories & Brands ---
backendApp.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

backendApp.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const category = db.createCategory(name, description || '');
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

backendApp.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

backendApp.get('/api/brands', (_req: Request, res: Response) => {
  res.json(db.getBrands());
});

backendApp.post('/api/brands', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, origin } = req.body;
    if (!name) return res.status(400).json({ error: 'Brand name is required' });
    const brand = db.createBrand(name, origin || 'International');
    res.status(201).json(brand);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

backendApp.delete('/api/brands/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteBrand(req.params.id);
  if (!success) return res.status(404).json({ error: 'Brand not found' });
  res.json({ success: true });
});

// --- Orders Endpoints ---
backendApp.get('/api/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getOrders(req.user!.id, req.user!.role);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

backendApp.get('/api/orders/:id', (req: AuthenticatedRequest, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (req.user && req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(order);
});

backendApp.post('/api/orders', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, paymentMethod, shippingAddress, guestInfo } = req.body;

    let userId = req.user?.id;
    let userEmail = req.user?.email;
    let userName = '';

    if (req.user) {
      const u = db.findUserById(req.user.id);
      userName = u?.name || 'Customer';
    } else if (guestInfo && guestInfo.email && guestInfo.name) {
      let existing = db.findUserByEmail(guestInfo.email);
      if (!existing) {
        const guestUser = db.createUser({
          name: guestInfo.name,
          email: guestInfo.email,
          password: `guest_${Date.now()}`,
          phone: guestInfo.phone || '',
          address: shippingAddress?.addressLine || '',
          city: shippingAddress?.city || '',
          postalCode: shippingAddress?.postalCode || '',
        });
        userId = guestUser.id;
        userEmail = guestUser.email;
        userName = guestUser.name;
      } else {
        userId = existing.id;
        userEmail = existing.email;
        userName = existing.name;
      }
    } else {
      return res.status(401).json({ error: 'User must be signed in or provide checkout credentials' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = db.createOrder({
      userId: userId!,
      userEmail: userEmail!,
      userName,
      items,
      paymentMethod: paymentMethod || 'credit_card',
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to place order' });
  }
});

backendApp.put('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateOrderStatus(req.params.id, status as OrderStatus, note);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update order status' });
  }
});

// --- Admin Stats & Users ---
backendApp.get('/api/stats', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getStats());
});

backendApp.get('/api/users', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getAllUsers());
});

backendApp.post('/api/seed', (_req: Request, res: Response) => {
  db.resetToDefault();
  res.json({ success: true, message: 'Database reset to demo state' });
});
