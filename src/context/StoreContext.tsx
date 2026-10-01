import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Product, CartItem, Order, Category, Brand } from '../types/index.ts';
import { api, getStoredToken } from '../services/api.ts';

type ActiveView = 'catalog' | 'checkout' | 'orders' | 'tracking' | 'admin' | 'auth';

interface StoreContextType {
  user: User | null;
  loadingUser: boolean;
  cart: CartItem[];
  cartOpen: boolean;
  activeView: ActiveView;
  selectedProduct: Product | null;
  selectedTrackingNumber: string | null;
  categories: Category[];
  brands: Brand[];
  // Actions
  setCartOpen: (open: boolean) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedTrackingNumber: (tracking: string | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: 'admin' | 'user') => Promise<void>;
  refreshTaxonomy: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'atelier_cart_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Initial auth check & taxonomy fetch
  useEffect(() => {
    const init = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch {
          api.logout();
          setUser(null);
        }
      }
      setLoadingUser(false);
      await refreshTaxonomy();
    };
    init();
  }, []);

  const refreshTaxonomy = async () => {
    try {
      const [cats, brs] = await Promise.all([api.getCategories(), api.getBrands()]);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      console.error('Failed to fetch taxonomy', err);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setUser(res.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    if (activeView === 'admin') {
      setActiveView('catalog');
    }
  };

  const quickSwitchRole = async (role: 'admin' | 'user') => {
    if (role === 'admin') {
      await login('admin@store.com', 'admin123');
    } else {
      await login('user@store.com', 'user123');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        loadingUser,
        cart,
        cartOpen,
        activeView,
        selectedProduct,
        selectedTrackingNumber,
        categories,
        brands,
        setCartOpen,
        setActiveView,
        setSelectedProduct,
        setSelectedTrackingNumber,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        login,
        register,
        logout,
        quickSwitchRole,
        refreshTaxonomy,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
