'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Package, Plus, User, FileText, RotateCcw, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useCartStore } from '../../src/store/useCartStore';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, addresses, addAddress, removeAddress, orders } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const activeTab = searchParams.get('tab') || 'profile';
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user) return <div className="min-h-screen flex items-center justify-center font-bold text-emerald-600">Loading Profile...</div>;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddress.trim()) {
      addAddress({ id: Date.now(), text: newAddress, type: 'Home' });
      setNewAddress('');
      setShowAddressForm(false);
    }
  };

  const handleReorder = (order) => {
    addItem({ id: 'reorder-' + Date.now(), name: 'Reordered Items', price: order.total, quantity: 1, image: 'https://placehold.co/100x100/emerald/white?text=Reorder' });
    router.push('/checkout');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="pb-24">
      {/* App-like Header */}
      <div className="bg-emerald-600 px-4 pt-6 pb-4 text-white shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="font-black text-xl tracking-tight capitalize">
            {activeTab === 'profile' ? 'My Profile' : activeTab === 'orders' ? 'My Orders' : 'My Addresses'}
          </h1>
        </div>
      </div>

      <main className="px-4 py-6">
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-300">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl font-black">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
                <p className="text-sm font-semibold text-gray-500">{user.phone}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              <button onClick={() => router.push('/dashboard?tab=orders')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <Package className="text-emerald-600" size={24} />
                  <span className="font-bold text-gray-800">My Orders</span>
                </div>
                <ChevronLeft className="text-gray-400 rotate-180" size={20} />
              </button>
              
              <button onClick={() => router.push('/dashboard?tab=addresses')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <MapPin className="text-emerald-600" size={24} />
                  <span className="font-bold text-gray-800">Saved Addresses</span>
                </div>
                <ChevronLeft className="text-gray-400 rotate-180" size={20} />
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-8 w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl active:scale-95 transition-transform"
            >
              LOGOUT
            </button>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm mt-4">
                <Package size={48} className="mx-auto mb-4 text-emerald-200" />
                <p className="font-bold text-lg text-gray-900 mb-1">No orders yet</p>
                <p className="text-sm text-gray-500">Looks like you haven't shopped with us yet.</p>
                <button onClick={() => router.push('/')} className="mt-6 bg-emerald-600 text-white font-black px-6 py-3 rounded-xl active:scale-95 transition-transform">Start Shopping</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                      <div>
                        <p className="font-black text-gray-900">Order #{order.id}</p>
                        <p className="text-xs font-semibold text-gray-500">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 line-clamp-2 leading-relaxed">
                        <span className="font-bold text-gray-800 mr-1">Items:</span>
                        {order.items}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <p className="font-black text-lg text-emerald-700">₹{order.total}</p>
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"
                      >
                        <RotateCcw size={14} /> Re-order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setShowAddressForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm font-black active:scale-95 transition-transform mb-6"
            >
              <Plus size={18} /> Add New Address
            </button>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="bg-white rounded-3xl border border-gray-100 p-5 mb-6 shadow-xl animate-in slide-in-from-top-4">
                <h3 className="font-black text-gray-900 mb-3">Delivery Address</h3>
                <textarea 
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                  rows={3}
                  placeholder="Enter flat, street, landmark..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-emerald-500 mb-4 resize-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 active:scale-95 transition-transform">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-black bg-emerald-600 text-white active:scale-95 transition-transform shadow-md shadow-emerald-200">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
                      {addr.type}
                    </span>
                    <button 
                      onClick={() => removeAddress(idx)}
                      className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">{addr.text}</p>
                </div>
              ))}
              
              {addresses.length === 0 && !showAddressForm && (
                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-4 text-emerald-200" />
                  <p className="font-semibold text-lg text-gray-900 mb-1">No addresses saved</p>
                  <p className="text-sm">Save an address to checkout faster.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-emerald-600">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
