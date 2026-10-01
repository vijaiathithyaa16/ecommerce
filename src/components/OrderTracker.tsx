import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { api } from '../services/api.ts';
import type { Order, OrderStatus } from '../types/index.ts';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export const OrderTracker: React.FC = () => {
  const { user, selectedTrackingNumber, setSelectedTrackingNumber, setActiveView } = useStore();
  const [searchInput, setSearchInput] = useState<string>(selectedTrackingNumber || 'ATL-883104');
  const [order, setOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrder(query.trim());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || `No active record found for tracking code "${query}".`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTrackingNumber) {
      setSearchInput(selectedTrackingNumber);
      fetchOrder(selectedTrackingNumber);
    } else {
      fetchOrder('ATL-883104');
    }
  }, [selectedTrackingNumber]);

  useEffect(() => {
    if (user) {
      api.getOrders().then(orders => {
        setUserOrders(orders);
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">Real-Time Dispatch Logistics</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
          Track Your Shipment
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Enter your 6-digit Atelier tracking identifier to query current courier transit coordinates.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-md mx-auto gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="e.g. ATL-883104"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-xs font-mono uppercase tracking-wider text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {loading ? 'Locating...' : 'Track'}
          </button>
        </form>

        {/* Quick sample chips for evaluation */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
          <span>Test Tracking IDs:</span>
          <button
            type="button"
            onClick={() => {
              setSearchInput('ATL-883104');
              fetchOrder('ATL-883104');
            }}
            className="font-mono text-stone-800 underline hover:text-stone-950"
          >
            ATL-883104 (Shipped)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setSearchInput('ATL-914280');
              fetchOrder('ATL-914280');
            }}
            className="font-mono text-stone-800 underline hover:text-stone-950"
          >
            ATL-914280 (Processing)
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Result */}
      {order && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
          
          {/* Top Bar Summary */}
          <div className="p-6 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-stone-500">Order Ref</span>
                <span className="font-mono font-bold text-stone-900 text-base tabular-nums">{order.trackingNumber}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Payment Mode</span>
                <span className="font-semibold text-stone-800">
                  {order.paymentMethod === 'credit_card' ? 'Credit Card' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wire'}
                </span>
              </div>

              <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Current Status</span>
                <span className={`font-semibold ${order.status === 'Delivered' ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {order.status}
                </span>
              </div>

              <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Total Billed</span>
                <span className="font-mono font-bold text-stone-900 tabular-nums">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Stepper Visualization */}
          <div className="p-6 md:p-10 border-b border-stone-200 bg-white">
            <div className="relative">
              {/* Line connector */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-stone-200 -z-0">
                <div
                  className="h-full bg-stone-900 transition-all duration-500"
                  style={{
                    width: currentStepIndex >= 0 ? `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` : '0%',
                  }}
                />
              </div>

              {/* 4 Steps */}
              <div className="grid grid-cols-4 relative z-10 text-center">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all ${
                          isCompleted
                            ? 'bg-stone-900 text-white ring-4 ring-white shadow-sm'
                            : 'bg-stone-100 text-stone-400 border border-stone-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <span className={`text-xs mt-3 font-medium ${isCurrent ? 'text-stone-900 font-semibold' : isCompleted ? 'text-stone-800' : 'text-stone-400'}`}>
                        {step === 'Pending' ? 'Order Received' : step === 'Processing' ? 'Inspection & Packing' : step === 'Shipped' ? 'In Transit' : 'Delivered'}
                      </span>

                      <span className="text-[11px] text-stone-400 mt-0.5 hidden sm:block">
                        {step === 'Pending' ? 'Validated' : step === 'Processing' ? 'Facility' : step === 'Shipped' ? 'Courier Handover' : 'Final Destination'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Grid: Status Log & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            
            {/* Fulfillment History Timeline */}
            <div className="p-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider text-xs">
                Milestone Audit Log
              </h3>

              <div className="space-y-4 pt-2">
                {order.statusHistory.map((hist, index) => (
                  <div key={index} className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-stone-900 mt-1.5 shrink-0 ring-4 ring-stone-100" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{hist.status}</span>
                        <span className="text-stone-400 text-[11px] font-mono tabular-nums">
                          {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(hist.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Manifest */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider text-xs mb-2">
                  Destination Coordinates
                </h3>
                <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <p className="font-semibold text-stone-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="text-stone-500 pt-1">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider text-xs mb-2">
                  Package Manifest ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
                </h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-stone-900 block truncate">{item.title}</span>
                        <span className="text-stone-400">Qty: {item.quantity}</span>
                      </div>
                      <div className="font-mono text-stone-900 font-semibold tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* User's Past Orders List if logged in */}
      {user && userOrders.length > 0 && (
        <div className="pt-8 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Account Order Archive ({userOrders.length})
            </h2>
            <span className="text-xs text-stone-500">Linked to {user.email}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userOrders.map(o => (
              <div
                key={o.id}
                onClick={() => {
                  setSelectedTrackingNumber(o.trackingNumber);
                  setSearchInput(o.trackingNumber);
                  setOrder(o);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  order?.id === o.id
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900">{o.trackingNumber}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {o.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-stone-500">{o.items.length} piece(s)</span>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    ${o.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
