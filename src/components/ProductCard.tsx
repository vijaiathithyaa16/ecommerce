import React, { useState } from 'react';
import type { Product } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import { ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group cursor-pointer rounded-xl bg-white border border-stone-200/80 p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300 relative"
    >
      {/* Visual Product Box */}
      <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-stone-100 flex items-center justify-center">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-500">
            <span className="font-serif text-lg font-semibold text-stone-800 text-center">{product.title}</span>
            <span className="text-xs text-stone-500 mt-1">{product.brandName}</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            aria-label="Quick view details"
            className="p-2.5 rounded-full bg-white/95 text-stone-800 shadow-md hover:bg-white hover:scale-110 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="mt-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Metadata: Brand and Category with typographic dot separator (Zero-Pill compliant) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span className="font-medium uppercase tracking-wider text-stone-600">{product.brandName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-stone-700 transition-colors">
            {product.title}
          </h3>

          {/* Quiet description preview */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price, Stock and Action Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base font-semibold text-stone-900 tabular-nums">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Inventory notification (unboxed text) */}
            <div className="text-[11px] mt-0.5">
              {isOutOfStock ? (
                <span className="text-stone-400">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-stone-400">{product.stock} available</span>
              )}
            </div>
          </div>

          {/* Add to Bag button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : isAdding
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
