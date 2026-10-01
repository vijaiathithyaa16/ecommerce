import React, { useState } from 'react';
import type { Product } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import { X, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Asset Gallery */}
        <div className="md:w-1/2 bg-stone-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center text-stone-500">
                <span className="font-serif text-xl text-stone-900 font-semibold">{product.title}</span>
                <p className="text-xs text-stone-400 mt-2">{product.brandName}</p>
              </div>
            )}
          </div>

          {/* Provenance note */}
          <div className="mt-4 text-center text-xs text-stone-500">
            <span>Maker: </span>
            <span className="font-medium text-stone-800">{product.brandName}</span>
            <span className="mx-2">·</span>
            <span>Ref: {product.id}</span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and Brand (Zero-Pill compliant) */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="uppercase tracking-wider font-semibold text-stone-700">{product.brandName}</span>
              <span aria-hidden="true">·</span>
              <span>{product.categoryName}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 leading-snug">
              {product.title}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-semibold text-stone-900 tabular-nums">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-stone-500 ml-auto">
                {isOutOfStock ? (
                  <span className="text-stone-400 font-medium">Sold Out</span>
                ) : (
                  <span className="text-stone-600 font-mono tabular-nums">{product.stock} units remaining</span>
                )}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
              {product.description}
            </p>

            {/* Technical Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Technical Specifications
                </span>
                <div className="rounded-lg border border-stone-200 overflow-hidden divide-y divide-stone-200 text-xs">
                  {Object.entries(product.specs).map(([label, val]) => (
                    <div key={label} className="grid grid-cols-2 px-3 py-2 bg-stone-50/50">
                      <span className="text-stone-500 font-medium">{label}</span>
                      <span className="text-stone-800 font-mono text-right tabular-nums">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Module: Quantity Stepper & Add to Bag */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-mono font-medium text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Primary Buy CTA */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : added
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Reassurance notes */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Expedited 3-Day Transit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>2-Year Atelier Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
