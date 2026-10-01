import React, { useState, useEffect } from 'react';
import type { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { categories, brands } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory,
        brand: selectedBrand,
        search: search.trim() || undefined,
        sort: sortBy,
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('newest');
    setInStockOnly(false);
  };

  const filteredProducts = inStockOnly ? products.filter(p => p.stock > 0) : products;

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">Archive & Store</span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 mt-1">
            Curated Catalog
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Milled, sewn, and thrown with non-negotiable standards of permanence.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="font-mono tabular-nums">{filteredProducts.length}</span>
          <span>instruments available</span>
        </div>
      </div>

      {/* Control Bar: Search & Interactive Filter Tabs (Buttons) */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-200/60 rounded-xl max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              All Pieces
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative min-w-[260px] sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, specs, brand..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Row: Brand Selector, Sort By, and In-Stock Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Maker:</span>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="bg-white border border-stone-200 rounded-md px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="all">All Ateliers</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 rounded-md px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="newest">Chronological Release</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Craftsman Rating</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 ml-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 w-3.5 h-3.5"
              />
              <span>In-Stock Inventory Only</span>
            </label>
          </div>

          {(selectedCategory !== 'all' || selectedBrand !== 'all' || search || inStockOnly) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse rounded-xl bg-white border border-stone-200 p-3.5 space-y-4">
                <div className="aspect-[4/3] bg-stone-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-4 bg-stone-200 rounded w-4/5"></div>
                  <div className="h-3 bg-stone-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-8">
            <p className="font-serif text-xl text-stone-800 font-medium">No matching instruments found</p>
            <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
              We couldn't find items matching your active category, brand, or query filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
