import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { api } from '../services/api.ts';
import type { PaymentMethod, Order } from '../types/index.ts';
import { CreditCard, Truck, Landmark, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    user,
    cart,
    cartSubtotal,
    clearCart,
    setActiveView,
    setSelectedTrackingNumber,
    quickSwitchRole,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Address form fields
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 392-1049',
    addressLine: user?.address || '482 Harrison Street, Apt 4C',
    city: user?.city || 'Portland',
    state: 'OR',
    postalCode: user?.postalCode || '97201',
    country: 'United States',
  });

  // Simulated card fields
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvc: '891',
  });

  const freeShippingThreshold = 150;
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 15;
  const tax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((cartSubtotal + shippingFee + tax) * 100) / 100;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        guestInfo: !user ? {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        } : undefined,
      };

      const order = await api.createOrder(orderPayload);
      clearCart();
      setConfirmedOrder(order);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  // If order was just placed, display instant confirmation & route to tracking
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Order Placed Successfully</span>
        <h1 className="font-serif text-3xl font-medium text-stone-900 mt-2">
          Thank you, {confirmedOrder.userName}
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
          We have registered your order with priority handling. Your tracking identifier has been generated below.
        </p>

        {/* Tracking Card */}
        <div className="mt-8 p-6 bg-white border border-stone-200 rounded-2xl shadow-sm text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs text-stone-400">Tracking Code</span>
              <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                {confirmedOrder.trackingNumber}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Total Billed</span>
              <div className="font-mono text-lg font-semibold text-stone-900 tabular-nums">
                ${confirmedOrder.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block">Dispatch Status</span>
              <span className="font-semibold text-amber-800 mt-0.5 inline-block">
                {confirmedOrder.status} · Preparing Package
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Payment State</span>
              <span className="font-semibold text-stone-800 mt-0.5 inline-block">
                {confirmedOrder.paymentStatus}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-stone-400 text-xs block mb-1">Destination</span>
            <p className="text-xs text-stone-700">
              {confirmedOrder.shippingAddress.addressLine}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setSelectedTrackingNumber(confirmedOrder.trackingNumber);
              setActiveView('tracking');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Track Live Shipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('catalog')}
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors"
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-medium text-stone-900">Your bag is currently empty</h2>
        <p className="text-xs text-stone-500 mt-2">Add items from our catalog before completing checkout.</p>
        <button
          onClick={() => setActiveView('catalog')}
          className="mt-6 px-6 py-3 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button
          onClick={() => setActiveView('catalog')}
          className="text-xs text-stone-500 hover:text-stone-900 transition-colors mb-2 inline-flex items-center gap-1"
        >
          ← Back to Catalog
        </button>
        <h1 className="font-serif text-3xl font-medium text-stone-900">Checkout & Settlement</h1>
        <p className="text-xs text-stone-500 mt-1">Review your shipping destination, fulfillment mode, and payment method.</p>
      </div>

      {/* User Login Banner if Guest */}
      {!user && (
        <div className="mb-8 p-4 bg-stone-100 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-stone-700 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-900 block">Checking out as guest</span>
              <span className="text-stone-500">Sign in to sync your order history and saved delivery addresses automatically.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('auth')}
              className="px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
            <button
              onClick={() => quickSwitchRole('user')}
              className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              One-Click Demo Customer
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Destination Address */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h2 className="font-serif text-lg font-medium text-stone-900 pb-2 border-b border-stone-100">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="marcus@example.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine}
                  onChange={e => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="1440 Mission St, Suite 3B"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="CA"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="94103"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-medium mb-1">Contact Phone (for carrier delivery)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h2 className="font-serif text-lg font-medium text-stone-900 pb-2 border-b border-stone-100">
              2. Payment Mode
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-stone-800 mb-2" />
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">Credit Card</span>
                  <span className="text-[11px] text-stone-500">Instant 3D Secure</span>
                </div>
              </button>

              {/* Option 2: Cash on Delivery (COD) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Truck className="w-5 h-5 text-stone-800 mb-2" />
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">Cash on Delivery</span>
                  <span className="text-[11px] text-stone-500">Pay on parcel arrival</span>
                </div>
              </button>

              {/* Option 3: Bank Transfer */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <LandlandIcon className="w-5 h-5 text-stone-800 mb-2" />
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">Wire Transfer</span>
                  <span className="text-[11px] text-stone-500">Direct account invoice</span>
                </div>
              </button>
            </div>

            {/* Payment Details Sub-Form */}
            {paymentMethod === 'credit_card' && (
              <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs animate-in fade-in">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={e => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono text-stone-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardData.expDate}
                      onChange={e => setCardData({ ...cardData, expDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardData.cvc}
                      onChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono text-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="mt-4 p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in">
                <span className="font-semibold block">Cash on Delivery Terms:</span>
                <p className="text-amber-800">
                  Please have the exact amount of <span className="font-mono font-bold">${totalAmount.toFixed(2)}</span> ready for the courier. A verification SMS will be sent to {formData.phone || 'your phone'} prior to delivery attempt.
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="mt-4 p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1 animate-in fade-in">
                <span className="font-semibold block text-stone-900">Wire Account Details:</span>
                <p className="font-mono text-stone-600">
                  IBAN: US44 ATELIER 9801 2293 4001<br />
                  BIC/SWIFT: ATELUS33<br />
                  Reference: Generated upon order completion
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Ledger & Confirmation CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6 sticky top-24">
            <h2 className="font-serif text-lg font-medium text-stone-900 pb-2 border-b border-stone-100">
              Order Ledger ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-stone-900 block truncate">{product.title}</span>
                    <span className="text-stone-400">Qty: {quantity}</span>
                  </div>
                  <div className="font-mono text-stone-900 font-semibold tabular-nums">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Items Subtotal</span>
                <span className="font-mono text-stone-900 tabular-nums">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Courier Dispatch</span>
                <span className="font-mono text-stone-900 tabular-nums">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-stone-900 tabular-nums">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-stone-900">Total Due</span>
                <span className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Place Order · ${totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              By authorizing this order, you agree to Atelier's terms of artisanal delivery and return policy.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};

// Simple helper icon for wire
function LandlandIcon(props: any) {
  return <Landmark {...props} />;
}
