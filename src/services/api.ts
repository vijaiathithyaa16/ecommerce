import type { User, Product, Category, Brand, Order, AdminStats, OrderStatus, PaymentMethod } from '../types/index.ts';

const TOKEN_KEY = 'atelier_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async register(data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string; postalCode?: string }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  logout(): void {
    removeStoredToken();
  },

  // Products
  async getProducts(params?: { category?: string; brand?: string; search?: string; sort?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.brand && params.brand !== 'all') query.set('brand', params.brand);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.featured) query.set('featured', 'true');

    const qs = query.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  async getProduct(id: string): Promise<Product> {
    return request<Product>(`/api/products/${id}`);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories & Brands
  async getCategories(): Promise<Category[]> {
    return request<Category[]>('/api/categories');
  },

  async createCategory(name: string, description: string): Promise<Category> {
    return request<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async getBrands(): Promise<Brand[]> {
    return request<Brand[]>('/api/brands');
  },

  async createBrand(name: string, origin: string): Promise<Brand> {
    return request<Brand>('/api/brands', {
      method: 'POST',
      body: JSON.stringify({ name, origin }),
    });
  },

  async deleteBrand(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/brands/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return request<Order[]>('/api/orders');
  },

  async getOrder(id: string): Promise<Order> {
    return request<Order>(`/api/orders/${id}`);
  },

  async createOrder(payload: {
    items: { productId: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    shippingAddress: Order['shippingAddress'];
    guestInfo?: { name: string; email: string; phone?: string };
  }): Promise<Order> {
    return request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    return request<Order>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  // Admin
  async getStats(): Promise<AdminStats> {
    return request<AdminStats>('/api/stats');
  },

  async getUsers(): Promise<User[]> {
    return request<User[]>('/api/users');
  },

  async resetSeed(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/seed', {
      method: 'POST',
    });
  },
};
