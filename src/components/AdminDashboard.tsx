import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { api } from '../services/api.ts';
import type { Product, Order, Category, Brand, User, AdminStats, OrderStatus } from '../types/index.ts';
import { PRODUCT_ILLUSTRATIONS } from '../utils/productImages.ts';
import {
  Shield, Package, ShoppingCart, Users, Tag, Plus, Edit2, Trash2,
  TrendingUp, AlertTriangle, CheckCircle, RefreshCw, X, ArrowUpRight
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'orders' | 'taxonomy' | 'users';

export const AdminDashboard: React.FC = () => {
  const { user, categories, brands, refreshTaxonomy, quickSwitchRole, setActiveView } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats & Entities
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderModalOrder, setOrderModalOrder] = useState<Order | null>(null);

  // Taxonomy forms
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandOrigin, setNewBrandOrigin] = useState('');

  // Product Form Data
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    categoryId: '',
    brandId: '',
    imageKey: 'headphones',
    featured: false,
    specKey: 'Materials',
    specValue: 'Solid Walnut & Brass',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, prodsData, ordersData, usersData] = await Promise.all([
        api.getStats(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers(),
      ]);
      setStats(statsData);
      setProducts(prodsData);
      setOrders(ordersData);
      setUsersList(usersData);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  // If not admin, provide convenient switch button
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900">Admin Privileges Required</h2>
        <p className="text-xs text-stone-500">
          This portal allows management of inventory, taxonomy, orders, and user access.
        </p>
        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => quickSwitchRole('admin')}
            className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
          >
            Authenticate as Admin (Elena Rostova)
          </button>
          <button
            onClick={() => setActiveView('catalog')}
            className="w-full py-2.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Handle Product Save (Create / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === productForm.categoryId) || categories[0];
    const br = brands.find(b => b.id === productForm.brandId) || brands[0];

    const payload: Partial<Product> = {
      title: productForm.title,
      description: productForm.description,
      price: parseFloat(productForm.price) || 0,
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      stock: parseInt(productForm.stock, 10) || 0,
      categoryId: cat.id,
      categoryName: cat.name,
      brandId: br.id,
      brandName: br.name,
      image: PRODUCT_ILLUSTRATIONS[productForm.imageKey] || PRODUCT_ILLUSTRATIONS.headphones,
      featured: productForm.featured,
      specs: {
        [productForm.specKey || 'Origin']: productForm.specValue || 'Artisan Small-Batch',
      },
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    const firstSpecKey = Object.keys(p.specs || {})[0] || 'Specification';
    const firstSpecVal = (p.specs && p.specs[firstSpecKey]) || '';

    setProductForm({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      brandId: p.brandId,
      imageKey: 'headphones',
      featured: p.featured,
      specKey: firstSpecKey,
      specValue: firstSpecVal,
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const note = prompt(`Enter fulfillment dispatch note for ${newStatus}:`, `Order status verified and updated to ${newStatus}.`);
    if (note === null) return;
    try {
      await api.updateOrderStatus(orderId, newStatus, note);
      await loadData();
      if (orderModalOrder && orderModalOrder.id === orderId) {
        const updated = await api.getOrder(orderId);
        setOrderModalOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  // Handle Taxonomy Create
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await api.createCategory(newCatName.trim(), newCatDesc.trim());
    setNewCatName('');
    setNewCatDesc('');
    await refreshTaxonomy();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await api.deleteCategory(id);
    await refreshTaxonomy();
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    await api.createBrand(newBrandName.trim(), newBrandOrigin.trim());
    setNewBrandName('');
    setNewBrandOrigin('');
    await refreshTaxonomy();
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    await api.deleteBrand(id);
    await refreshTaxonomy();
  };

  const handleResetSeed = async () => {
    if (!confirm('Reset entire catalog and database to pristine factory demo seed?')) return;
    await api.resetSeed();
    await refreshTaxonomy();
    await loadData();
    alert('Database successfully restored to demo baseline.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Administrative Control Center
            </span>
            <span className="text-xs text-stone-500">Logged in as {user.name}</span>
          </div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 mt-1">
            Store Operations & CMS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSeed}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
            title="Reset database to original demo fixtures"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={() => setActiveView('catalog')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <span>View Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'taxonomy' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Categories & Brands</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'users' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({usersList.length})</span>
        </button>
      </div>

      {/* --- TAB 1: OVERVIEW / METRICS --- */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">Gross Revenue</span>
              <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums mt-1">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 inline-block">100% verified settlement</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">Total Orders</span>
              <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {stats.totalOrders}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 inline-block">
                {stats.pendingOrders} currently in transit / fulfillment
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">Catalog Products</span>
              <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {stats.totalProducts}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 inline-block">
                {stats.lowStockCount} items below threshold
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">Registered Accounts</span>
              <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {stats.totalUsers}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 inline-block">Customers & Administrators</span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">Recent Customer Dispatches</h3>
                <p className="text-xs text-stone-500">Live feed of orders placed through the checkout pipeline.</p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-stone-700 hover:text-stone-900 font-medium underline"
              >
                View all ({orders.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{o.trackingNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{o.userName}</div>
                        <div className="text-[11px] text-stone-400">{o.userEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{o.paymentMethod.replace('_', ' ')}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                        ${o.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setOrderModalOrder(o)}
                          className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded font-medium text-stone-800 transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PRODUCTS MANAGEMENT (CRUD) --- */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-900">Inventory Catalog</h2>
              <p className="text-xs text-stone-500">Add, edit, or adjust pricing and stock counts.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  title: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  stock: '15',
                  categoryId: categories[0]?.id || '',
                  brandId: brands[0]?.id || '',
                  imageKey: 'headphones',
                  featured: false,
                  specKey: 'Dimensions',
                  specValue: 'Standard Atelier Fit',
                });
                setProductModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Maker</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{p.title}</div>
                          <div className="text-[11px] text-stone-400 font-mono">ID: {p.id}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{p.categoryName}</td>
                      <td className="py-3 px-4 text-stone-600">{p.brandName}</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-medium ${p.stock <= 5 ? 'text-amber-800 font-bold' : 'text-stone-900'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-900 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-stone-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: ORDERS MANAGEMENT --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-serif text-xl font-medium text-stone-900">Order Management & Dispatch</h2>
            <p className="text-xs text-stone-500">Live operational oversight across all client accounts.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status & Update</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{o.trackingNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{o.userName}</div>
                        <div className="text-[11px] text-stone-400">{o.shippingAddress.city}, {o.shippingAddress.state}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {o.items.length} item(s) ({o.items.reduce((s, i) => s + i.quantity, 0)} total)
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                        ${o.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-white border border-stone-200 rounded px-2 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setOrderModalOrder(o)}
                          className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded font-medium text-stone-800 transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: CATEGORIES & BRANDS --- */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
          
          {/* Categories */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900">Categories</h3>
              <p className="text-xs text-stone-500">Taxonomic groupings shown on the storefront.</p>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="space-y-3 pt-2">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Fine Optics)"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCatDesc}
                onChange={e => setNewCatDesc(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Create Category
              </button>
            </form>

            {/* List */}
            <div className="divide-y divide-stone-100 pt-2">
              {categories.map(c => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{c.name}</span>
                    <p className="text-[11px] text-stone-500">{c.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900">Ateliers & Makers</h3>
              <p className="text-xs text-stone-500">Independent craft houses and manufacturing partners.</p>
            </div>

            {/* Add Brand Form */}
            <form onSubmit={handleCreateBrand} className="space-y-3 pt-2">
              <input
                type="text"
                required
                placeholder="Brand / Atelier Name (e.g. Hasami Porcelain)"
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Geographic Provenance (e.g. Nagasaki, Japan)"
                value={newBrandOrigin}
                onChange={e => setNewBrandOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Register Atelier
              </button>
            </form>

            {/* List */}
            <div className="divide-y divide-stone-100 pt-2">
              {brands.map(b => (
                <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{b.name}</span>
                    <p className="text-[11px] text-stone-500">{b.origin}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBrand(b.id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                    title="Delete brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 5: USERS --- */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-serif text-xl font-medium text-stone-900">Registered Accounts</h2>
            <p className="text-xs text-stone-500">User accounts stored with salted PBKDF2 hash credentials.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-semibold text-stone-900">{u.name}</td>
                      <td className="py-3 px-4 text-stone-600 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {u.city ? `${u.city}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- PRODUCT CREATE/EDIT MODAL --- */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-xl font-medium text-stone-900">
                {editingProduct ? 'Edit Catalog Piece' : 'Add New Catalog Piece'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Tactile Mechanical Keyboard"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Maker / Brand</label>
                  <select
                    value={productForm.brandId}
                    onChange={e => setProductForm({ ...productForm, brandId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="245.00"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="Optional original price"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="12"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed craftsman narrative and tactile description..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Visual Asset Artwork</label>
                  <select
                    value={productForm.imageKey}
                    onChange={e => setProductForm({ ...productForm, imageKey: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    <option value="headphones">Audiophile Headphones</option>
                    <option value="keyboard">Mechanical Keyboard</option>
                    <option value="pourover">Basalt Pour-Over Carafe</option>
                    <option value="deskmat">Saddle Leather Desk Mat</option>
                    <option value="lamp">Brass Task Lamp</option>
                    <option value="mug">Stoneware Espresso Mug</option>
                    <option value="watch">Chronograph Watch</option>
                    <option value="stand">Walnut Display Stand</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={productForm.featured}
                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <label htmlFor="featured-check" className="text-stone-700 font-medium cursor-pointer">
                    Feature on Homepage Hero Spotlight
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
                >
                  {editingProduct ? 'Save Modifications' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ORDER INSPECT MODAL --- */}
      {orderModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-400">Order Verification</span>
                <h3 className="font-serif text-xl font-medium text-stone-900 font-mono">
                  {orderModalOrder.trackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setOrderModalOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 block text-[11px]">Customer</span>
                  <span className="font-semibold text-stone-900">{orderModalOrder.userName}</span>
                  <p className="text-stone-500">{orderModalOrder.userEmail}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Payment Mode</span>
                  <span className="font-semibold text-stone-900">{orderModalOrder.paymentMethod}</span>
                  <p className="text-stone-500">{orderModalOrder.paymentStatus}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-stone-900 block mb-2">Package Items</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {orderModalOrder.items.map(item => (
                    <div key={item.productId} className="flex justify-between items-center p-2 rounded bg-stone-50">
                      <div>
                        <span className="font-medium text-stone-900 block">{item.title}</span>
                        <span className="text-stone-400">Qty: {item.quantity} · ${item.price.toFixed(2)} each</span>
                      </div>
                      <span className="font-mono font-semibold text-stone-900 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between font-mono font-bold text-sm text-stone-900">
                <span>Total Amount:</span>
                <span>${orderModalOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <span className="font-semibold text-stone-900 block mb-1">Destination Address</span>
                <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {orderModalOrder.shippingAddress.addressLine}, {orderModalOrder.shippingAddress.city}, {orderModalOrder.shippingAddress.state} {orderModalOrder.shippingAddress.postalCode}<br />
                  Recipient Phone: {orderModalOrder.shippingAddress.phone}
                </p>
              </div>

              {/* Status Update Quick Selector */}
              <div className="pt-2">
                <span className="font-semibold text-stone-900 block mb-1">Update Status:</span>
                <div className="flex gap-2">
                  {(['Pending', 'Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateOrderStatus(orderModalOrder.id, st)}
                      className={`flex-1 py-1.5 rounded text-[11px] font-medium transition-colors ${
                        orderModalOrder.status === st
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setOrderModalOrder(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
