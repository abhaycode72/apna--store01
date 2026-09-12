'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Package, Plus, User, FileText, ChevronRight, Headphones, CreditCard, RotateCcw } from 'lucide-react';
import Header from '../../src/store/src/components/Header';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useCartStore } from '../../src/store/useCartStore';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, addresses, addAddress, removeAddress, orders } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-purple-600">Loading Dashboard...</div>;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddress.trim()) {
      addAddress({ id: Date.now(), text: newAddress, type: 'Home' });
      setNewAddress('');
      setShowAddressForm(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleReorder = (order) => {
    // Mock re-order logic: Add some items to cart and go to checkout
    addItem({ id: 'reorder-' + Date.now(), name: 'Reordered Items', price: order.total, quantity: 1, image: 'https://placehold.co/100x100/purple/white?text=Reorder' });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
        
        {/* 1. Profile Banner */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black shrink-0 border-4 border-white/30 relative z-10">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-black mb-1">{user.name}</h1>
            <p className="text-purple-200 font-medium mb-1">{user.email}</p>
            <p className="text-purple-200 text-sm">{user.phone}</p>
          </div>
        </section>

        {/* 2. Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => router.push('/support')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-purple-300 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-bold text-gray-700">Support</span>
          </button>
          <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-purple-300 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-bold text-gray-700">Payments</span>
          </button>
          <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-purple-300 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="text-emerald-600" size={24} />
            </div>
            <span className="text-sm font-bold text-gray-700">Edit Profile</span>
          </button>
          <button onClick={handleLogout} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-red-300 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut className="text-red-600" size={24} />
            </div>
            <span className="text-sm font-bold text-gray-700">Logout</span>
          </button>
        </section>

        {/* 3. Recent Orders */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-purple-600" size={24} />
            <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
              <Package size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm hover:border-purple-200 transition flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order {order.id}</span>
                      <p className="font-bold text-gray-900 text-sm mt-0.5">{order.date}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex-1 mb-4">
                    <p className="text-sm font-semibold text-gray-600 line-clamp-2 leading-relaxed">
                      {order.items}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                      <p className="font-black text-gray-900 text-lg leading-none">₹{order.total}</p>
                    </div>
                    <button 
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-100 transition active:scale-95"
                    >
                      <RotateCcw size={16} /> Re-order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Saved Addresses */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-purple-600" size={24} />
            <h2 className="text-xl font-black text-gray-900">Saved Addresses</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr, idx) => (
              <div key={addr.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm relative group hover:border-purple-200 transition flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {addr.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{addr.text}</p>
                
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => removeAddress(idx)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add New Address Button */}
            <div 
              onClick={() => setShowAddressForm(true)}
              className="bg-purple-50/50 border-2 border-dashed border-purple-200 rounded-3xl p-6 flex flex-col items-center justify-center text-purple-600 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition min-h-[160px]"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <Plus size={24} />
              </div>
              <p className="font-bold">Add New Address</p>
            </div>
          </div>

          {/* Address Form Modal/Expansion */}
          {showAddressForm && (
            <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
              <form 
                onSubmit={handleAddAddress} 
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-8 duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900">Add New Address</h3>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition">
                    &times;
                  </button>
                </div>
                
                <textarea 
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                  rows={4}
                  placeholder="Enter complete flat, street, and landmark details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 mb-6 resize-none"
                />
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 transition">Save Address</button>
                </div>
              </form>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
