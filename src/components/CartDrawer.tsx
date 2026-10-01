import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    setActiveView,
  } = useStore();

  if (!cartOpen) return null;

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setCartOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBF9] border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-serif text-lg font-medium text-stone-900">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 text-xs">
            <div className="flex justify-between items-center mb-1.5 text-stone-700">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <span className="font-mono font-semibold">${remainingForFreeShipping.toFixed(2)}</span> for complimentary courier delivery
                </span>
              ) : (
                <span className="font-medium text-emerald-800 flex items-center gap-1">
                  <span>Complimentary courier delivery unlocked</span>
                </span>
              )}
              <span className="font-mono text-stone-500">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 stroke-[1.2] mb-3" />
                <p className="font-serif text-base text-stone-800">Your bag is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-[220px]">
                  Explore our curated instruments and add items to begin checkout.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs items-center"
                >
                  <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {product.brandName} · {product.categoryName}
                    </p>
                    <div className="font-mono text-xs font-semibold text-stone-900 tabular-nums mt-1">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Remove piece"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200/60"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200/60 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900 tabular-nums">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Estimated Courier Shipping</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE' : '$15.00'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-stone-900">Total Due</span>
                <span className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                  ${(cartSubtotal + (cartSubtotal >= freeShippingThreshold ? 0 : 15)).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Empty Bag
                </button>

                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
