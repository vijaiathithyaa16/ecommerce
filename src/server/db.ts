import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { User, Product, Category, Brand, Order, AdminStats, OrderStatus } from '../types/index.ts';
import { PRODUCT_ILLUSTRATIONS } from '../utils/productImages.ts';

interface DbUser extends User {
  salt: string;
  passwordHash: string;
}

interface DatabaseSchema {
  users: DbUser[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  orders: Order[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

export function generateToken(user: User): string {
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, time: Date.now() })).toString('base64url');
  const signature = crypto.createHmac('sha256', 'atelier-secret-key-2026').update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; role: 'admin' | 'user' } | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', 'atelier-secret-key-2026').update(payload).digest('base64url');
    if (signature !== expectedSignature) return null;
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

function getInitialData(): DatabaseSchema {
  const adminAuth = hashPassword('admin123');
  const userAuth = hashPassword('user123');

  const categories: Category[] = [
    { id: 'cat-workspace', name: 'Workspace', slug: 'workspace', description: 'Ergonomic and tactile essentials for high-focus environments.' },
    { id: 'cat-audio', name: 'Audiophile', slug: 'audiophile', description: 'Studio-grade acoustic monitoring and analog hardware.' },
    { id: 'cat-ceramics', name: 'Ceramics & Tableware', slug: 'ceramics', description: 'Basalt and stoneware vessels for daily rituals.' },
    { id: 'cat-leather', name: 'Leather & Horology', slug: 'leather-horology', description: 'Vegetable-tanned goods and mechanical timepieces.' },
  ];

  const brands: Brand[] = [
    { id: 'brand-kanso', name: 'Kanso Studio', slug: 'kanso', origin: 'Kyoto, Japan' },
    { id: 'brand-master', name: 'Master Acoustic', slug: 'master-acoustic', origin: 'Stockholm, Sweden' },
    { id: 'brand-grove', name: 'Grovemade', slug: 'grovemade', origin: 'Portland, OR, USA' },
    { id: 'brand-hario', name: 'Hario Craft', slug: 'hario-craft', origin: 'Tokyo, Japan' },
    { id: 'brand-tanner', name: 'Tanner Goods', slug: 'tanner-goods', origin: 'Bend, OR, USA' },
  ];

  const products: Product[] = [
    {
      id: 'prod-headphones-01',
      title: 'Acoustic Precision Reference Headphones',
      description: 'Custom 45mm neodymium drivers encased in precision-milled titanium shells. Closed-back design with hand-stitched memory foam lambskin earcups for zero resonance fatigue.',
      price: 380,
      originalPrice: 420,
      categoryId: 'cat-audio',
      categoryName: 'Audiophile',
      brandId: 'brand-master',
      brandName: 'Master Acoustic',
      stock: 14,
      image: PRODUCT_ILLUSTRATIONS.headphones,
      featured: true,
      rating: 4.9,
      reviewsCount: 38,
      specs: {
        'Driver Size': '45mm Neodymium',
        'Impedance': '32 Ohms @ 1kHz',
        'Frequency': '10Hz – 40,000Hz',
        'Weight': '295g',
        'Cable': '1.8m Braided Oxygen-Free Copper',
      },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'prod-keyboard-02',
      title: 'Walnut & Cream Tactile 75% Mechanical Keyboard',
      description: 'Solid American black walnut casing paired with custom hand-lubricated tactile switches and PBT dye-sublimated retro keycaps. Gasket mounted for quiet, deep acoustic dampening.',
      price: 245,
      categoryId: 'cat-workspace',
      categoryName: 'Workspace',
      brandId: 'brand-kanso',
      brandName: 'Kanso Studio',
      stock: 9,
      image: PRODUCT_ILLUSTRATIONS.keyboard,
      featured: true,
      rating: 4.8,
      reviewsCount: 52,
      specs: {
        'Layout': '75% Compact (84 keys)',
        'Switches': 'Kanso Tactile Amber (58g force)',
        'Chassis': 'Solid CNC Walnut & Brass Weight',
        'Connectivity': 'USB-C / 2.4GHz / Bluetooth 5.2',
        'Battery': '4,000 mAh (Up to 180 hrs)',
      },
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'prod-pourover-03',
      title: 'Charcoal Basalt Pour-Over Coffee Set',
      description: 'Double-fired basalt stoneware dripper seated atop an 800ml heat-resistant borosilicate glass carafe. Designed with conical internal extraction ribs to balance acidity and body.',
      price: 95,
      originalPrice: 110,
      categoryId: 'cat-ceramics',
      categoryName: 'Ceramics & Tableware',
      brandId: 'brand-hario',
      brandName: 'Hario Craft',
      stock: 22,
      image: PRODUCT_ILLUSTRATIONS.pourover,
      featured: true,
      rating: 4.7,
      reviewsCount: 41,
      specs: {
        'Capacity': '800ml (2–4 Cups)',
        'Dripper Material': 'Basalt Stoneware',
        'Carafe Material': 'Borosilicate Lab Glass',
        'Dishwasher Safe': 'Yes (Hand wash recommended)',
      },
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: 'prod-deskmat-04',
      title: 'Vegetable-Tanned Saddle Leather Desk Blotter',
      description: 'Cut from 3.5mm thick full-grain harness leather with burnished beveled edges. Naturally patinas into a deep amber gloss over time while cushioning mechanical typing.',
      price: 130,
      categoryId: 'cat-leather',
      categoryName: 'Leather & Horology',
      brandId: 'brand-tanner',
      brandName: 'Tanner Goods',
      stock: 18,
      image: PRODUCT_ILLUSTRATIONS.deskmat,
      featured: true,
      rating: 5.0,
      reviewsCount: 29,
      specs: {
        'Dimensions': '90cm × 40cm (35.4" × 15.7")',
        'Thickness': '3.5mm Full-Grain',
        'Tannery': 'Wickett & Craig (Curwensville, PA)',
        'Finish': 'Natural Wax Treated',
      },
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: 'prod-lamp-05',
      title: 'Machined Brass Dome Ambient Task Light',
      description: 'Solid turned brass dome diffuser resting on a slender arch stem. Stepless optical rotary dimmer with warm 2400K–3000K circadian LED tuning.',
      price: 215,
      categoryId: 'cat-workspace',
      categoryName: 'Workspace',
      brandId: 'brand-grove',
      brandName: 'Grovemade',
      stock: 6,
      image: PRODUCT_ILLUSTRATIONS.lamp,
      featured: false,
      rating: 4.9,
      reviewsCount: 19,
      specs: {
        'Materials': 'Spun Brass, Weighted Steel Base',
        'Color Temp': '2700K Warm Filament Glow',
        'Luminance': '650 Lumens Max',
        'Control': 'Stepless Rotary Potentiometer',
      },
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: 'prod-mug-06',
      title: 'Iron-Glaze Stoneware Espresso Mug Pair',
      description: 'Hand-thrown textured stoneware finished with an iron oxide reduction glaze. Matte tactile exterior with glossy, stain-resistant interior.',
      price: 52,
      categoryId: 'cat-ceramics',
      categoryName: 'Ceramics & Tableware',
      brandId: 'brand-kanso',
      brandName: 'Kanso Studio',
      stock: 35,
      image: PRODUCT_ILLUSTRATIONS.mug,
      featured: false,
      rating: 4.8,
      reviewsCount: 64,
      specs: {
        'Quantity': 'Set of 2',
        'Volume': '240ml (8.1 oz)',
        'Weight': '210g each',
        'Microwave Safe': 'Yes',
      },
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 'prod-watch-07',
      title: 'Field Chronograph 38mm Mechanical Watch',
      description: 'Brushed surgical 316L stainless steel case housing a 24-jewel automatic movement with 42-hour power reserve. Anti-reflective domed sapphire crystal and oiled bridle leather strap.',
      price: 640,
      originalPrice: 720,
      categoryId: 'cat-leather',
      categoryName: 'Leather & Horology',
      brandId: 'brand-tanner',
      brandName: 'Tanner Goods',
      stock: 4,
      image: PRODUCT_ILLUSTRATIONS.watch,
      featured: true,
      rating: 4.9,
      reviewsCount: 16,
      specs: {
        'Movement': 'Miyota 9015 Automatic (28,800 bph)',
        'Case Diameter': '38.5mm',
        'Water Resistance': '10 ATM (100 meters)',
        'Glass': 'Double-Domed Sapphire with Inner AR',
      },
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: 'prod-stand-08',
      title: 'Solid American Walnut Display Monitor Riser',
      description: 'Milled from a continuous board of sustainably harvested American black walnut. Elevated with chamfered aluminum legs to store a 75% keyboard beneath.',
      price: 165,
      categoryId: 'cat-workspace',
      categoryName: 'Workspace',
      brandId: 'brand-grove',
      brandName: 'Grovemade',
      stock: 12,
      image: PRODUCT_ILLUSTRATIONS.stand,
      featured: false,
      rating: 4.7,
      reviewsCount: 31,
      specs: {
        'Dimensions': '110cm × 23cm × 11cm',
        'Max Load': '45kg (100 lbs)',
        'Wood Origin': 'Eastern Oregon Forestry',
        'Clearance': '8.5cm beneath platform',
      },
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  const users: DbUser[] = [
    {
      id: 'usr-admin-01',
      name: 'Elena Rostova (Admin)',
      email: 'admin@store.com',
      role: 'admin',
      phone: '+1 (555) 234-8901',
      address: '742 Evergreen Terrace',
      city: 'Portland',
      postalCode: '97201',
      passwordHash: adminAuth.hash,
      salt: adminAuth.salt,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'usr-customer-02',
      name: 'Marcus Vance',
      email: 'user@store.com',
      role: 'user',
      phone: '+1 (555) 891-2345',
      address: '1440 Mission St, Suite 3B',
      city: 'San Francisco',
      postalCode: '94103',
      passwordHash: userAuth.hash,
      salt: userAuth.salt,
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-88310',
      trackingNumber: 'ATL-883104',
      userId: 'usr-customer-02',
      userEmail: 'user@store.com',
      userName: 'Marcus Vance',
      items: [
        {
          productId: 'prod-headphones-01',
          title: 'Acoustic Precision Reference Headphones',
          price: 380,
          quantity: 1,
          image: PRODUCT_ILLUSTRATIONS.headphones,
        },
        {
          productId: 'prod-deskmat-04',
          title: 'Vegetable-Tanned Saddle Leather Desk Blotter',
          price: 130,
          quantity: 1,
          image: PRODUCT_ILLUSTRATIONS.deskmat,
        },
      ],
      subtotal: 510,
      tax: 40.80,
      shippingFee: 0,
      totalAmount: 550.80,
      status: 'Shipped',
      paymentMethod: 'credit_card',
      paymentStatus: 'Paid',
      shippingAddress: {
        fullName: 'Marcus Vance',
        phone: '+1 (555) 891-2345',
        addressLine: '1440 Mission St, Suite 3B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'United States',
      },
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          note: 'Order placed by customer via Card payment.',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
          note: 'Items picked and packaged at Oregon distribution center.',
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
          note: 'Dispatched via Priority Express. Carrier tracking synced.',
        },
      ],
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'ord-88311',
      trackingNumber: 'ATL-914280',
      userId: 'usr-customer-02',
      userEmail: 'user@store.com',
      userName: 'Marcus Vance',
      items: [
        {
          productId: 'prod-pourover-03',
          title: 'Charcoal Basalt Pour-Over Coffee Set',
          price: 95,
          quantity: 1,
          image: PRODUCT_ILLUSTRATIONS.pourover,
        },
      ],
      subtotal: 95,
      tax: 7.60,
      shippingFee: 15,
      totalAmount: 117.60,
      status: 'Processing',
      paymentMethod: 'cod',
      paymentStatus: 'Pending Cash on Delivery',
      shippingAddress: {
        fullName: 'Marcus Vance',
        phone: '+1 (555) 891-2345',
        addressLine: '1440 Mission St, Suite 3B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'United States',
      },
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
          note: 'Order confirmed with Cash on Delivery payment option.',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          note: 'Packaging fragile glassware with shock absorption padding.',
        },
      ],
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    },
  ];

  return { users, categories, brands, products, orders };
}

class StoreDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.readFromDisk();
  }

  private readFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, re-initializing...', err);
    }
    const initial = getInitialData();
    this.writeToDisk(initial);
    return initial;
  }

  private writeToDisk(data: DatabaseSchema): void {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public resetToDefault(): void {
    this.data = getInitialData();
    this.writeToDisk(this.data);
  }

  // --- Users ---
  public findUserByEmail(email: string): DbUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return safeUser;
  }

  public getAllUsers(): User[] {
    return this.data.users.map(({ passwordHash: _, salt: __, ...safeUser }) => safeUser);
  }

  public createUser(userData: { name: string; email: string; password: string; role?: 'admin' | 'user'; phone?: string; address?: string; city?: string; postalCode?: string }): User {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('A user with this email address already exists');
    }
    const { hash, salt } = hashPassword(userData.password);
    const newUser: DbUser = {
      id: `usr-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.writeToDisk(this.data);
    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  }

  // --- Products ---
  public getProducts(params?: { category?: string; brand?: string; search?: string; sort?: string; featured?: boolean }): Product[] {
    let result = [...this.data.products];

    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.categoryId === params.category || p.categoryName.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.brand && params.brand !== 'all') {
      result = result.filter(p => p.brandId === params.brand || p.brandName.toLowerCase() === params.brand?.toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q)
      );
    }

    if (params?.featured) {
      result = result.filter(p => p.featured);
    }

    if (params?.sort) {
      if (params.sort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (params.sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.writeToDisk(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    const updated = {
      ...this.data.products[index],
      ...updates,
      id, // protect id
    };
    this.data.products[index] = updated;
    this.writeToDisk(this.data);
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.writeToDisk(this.data);
      return true;
    }
    return false;
  }

  // --- Categories & Brands ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public createCategory(name: string, description: string): Category {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: `cat-${slug}-${Date.now().toString().slice(-4)}`,
      name,
      slug,
      description,
    };
    this.data.categories.push(newCat);
    this.writeToDisk(this.data);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    const prev = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== prev) {
      this.writeToDisk(this.data);
      return true;
    }
    return false;
  }

  public getBrands(): Brand[] {
    return this.data.brands;
  }

  public createBrand(name: string, origin: string): Brand {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newBrand: Brand = {
      id: `brand-${slug}-${Date.now().toString().slice(-4)}`,
      name,
      slug,
      origin,
    };
    this.data.brands.push(newBrand);
    this.writeToDisk(this.data);
    return newBrand;
  }

  public deleteBrand(id: string): boolean {
    const prev = this.data.brands.length;
    this.data.brands = this.data.brands.filter(b => b.id !== id);
    if (this.data.brands.length !== prev) {
      this.writeToDisk(this.data);
      return true;
    }
    return false;
  }

  // --- Orders ---
  public getOrders(userId?: string, role?: string): Order[] {
    if (role === 'admin') {
      return [...this.data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (userId) {
      return this.data.orders
        .filter(o => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [];
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.trackingNumber.toUpperCase() === id.toUpperCase());
  }

  public createOrder(orderInput: {
    userId: string;
    userEmail: string;
    userName: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'credit_card' | 'cod' | 'bank_transfer';
    shippingAddress: Order['shippingAddress'];
  }): Order {
    if (!orderInput.items || orderInput.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const orderItems: Order['items'] = [];
    let subtotal = 0;

    for (const item of orderInput.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} was not found in catalog`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.title}" (${product.stock} available)`);
      }
      // Deduct stock
      this.updateProduct(product.id, { stock: product.stock - item.quantity });

      orderItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      subtotal += product.price * item.quantity;
    }

    const shippingFee = subtotal >= 150 ? 0 : 15;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    const trackingNumber = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const paymentStatus = orderInput.paymentMethod === 'credit_card'
      ? 'Paid'
      : orderInput.paymentMethod === 'cod'
        ? 'Pending Cash on Delivery'
        : 'Awaiting Wire';

    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      trackingNumber,
      userId: orderInput.userId,
      userEmail: orderInput.userEmail,
      userName: orderInput.userName,
      items: orderItems,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      status: 'Pending',
      paymentMethod: orderInput.paymentMethod,
      paymentStatus,
      shippingAddress: orderInput.shippingAddress,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Order received. Payment method: ${orderInput.paymentMethod}. Verification in progress.`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.data.orders.unshift(newOrder);
    this.writeToDisk(this.data);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;

    if (status === 'Delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'Paid';
    }

    order.statusHistory.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status} by fulfillment system.`,
    });

    this.writeToDisk(this.data);
    return order;
  }

  // --- Admin Stats ---
  public getStats(): AdminStats {
    const totalRevenue = this.data.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = this.data.orders.length;
    const totalProducts = this.data.products.length;
    const totalUsers = this.data.users.length;
    const pendingOrders = this.data.orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const lowStockCount = this.data.products.filter(p => p.stock < 10).length;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      lowStockCount,
    };
  }
}

export const db = new StoreDatabase();
