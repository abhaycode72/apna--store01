'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Package, Plus, User, RotateCcw, ChevronLeft, LogOut } from 'lucide-react';
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

  const TabButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => router.push(`/dashboard?tab=${id}`)}
        className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl md:rounded-xl font-bold transition-all ${
          isActive 
            ? 'bg-emerald-50 text-emerald-700 md:bg-emerald-600 md:text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-emerald-600 md:text-white' : 'text-gray-400'} />
        {label}
        {/* Mobile Chevron */}
        <ChevronLeft size={20} className={`ml-auto rotate-180 md:hidden ${isActive ? 'text-emerald-300' : 'text-gray-300'}`} />
      </button>
    );
  };

  return (
    <div className="pb-24 md:pb-8 min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Mobile-only Header */}
      <div className="md:hidden bg-emerald-600 px-4 pt-6 pb-4 text-white shadow-md sticky top-0 z-40">
        <h1 className="font-black text-xl tracking-tight capitalize">
          {activeTab === 'profile' ? 'My Profile' : activeTab === 'orders' ? 'My Orders' : 'My Addresses'}
        </h1>
      </div>

      <main className="px-4 py-6 md:py-10 max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          
          {/* Sidebar (Hidden on Mobile unless Profile tab, visible on Desktop) */}
          <div className={`${activeTab === 'profile' ? 'block' : 'hidden md:block'} md:col-span-1 space-y-6`}>
            {/* User Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl font-black">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 line-clamp-1">{user.name}</h2>
                <p className="text-sm font-semibold text-gray-500">{user.phone}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 space-y-1 hidden md:block">
              <TabButton id="profile" label="Profile Overview" icon={User} />
              <TabButton id="orders" label="My Orders" icon={Package} />
              <TabButton id="addresses" label="Saved Addresses" icon={MapPin} />
              <div className="h-px bg-gray-100 my-2 mx-4" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>

            {/* Mobile Navigation (Only visible on Profile Tab) */}
            <div className="md:hidden bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              <TabButton id="orders" label="My Orders" icon={Package} />
              <TabButton id="addresses" label="Saved Addresses" icon={MapPin} />
            </div>

            <button 
              onClick={handleLogout}
              className="md:hidden mt-8 w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl active:scale-95 transition-transform"
            >
              LOGOUT
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            
            {/* Desktop Content Header */}
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-black text-gray-900 capitalize">
                {activeTab === 'profile' ? 'Profile Overview' : activeTab === 'orders' ? 'My Orders' : 'Saved Addresses'}
              </h1>
            </div>

            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Profile Tab (Desktop Only, since Mobile Profile is just the menu) */}
              {activeTab === 'profile' && (
                <div className="hidden md:block bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                      <p className="font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                      <p className="font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{user.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm mt-4 md:mt-0">
                      <Package size={48} className="mx-auto mb-4 text-emerald-200" />
                      <p className="font-bold text-lg text-gray-900 mb-1">No orders yet</p>
                      <p className="text-sm text-gray-500">Looks like you haven't shopped with us yet.</p>
                      <button onClick={() => router.push('/')} className="mt-6 bg-emerald-600 text-white font-black px-6 py-3 rounded-xl hover:bg-emerald-700 transition">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
                            <div>
                              <p className="font-black text-gray-900 text-lg">Order #{order.id}</p>
                              <p className="text-sm font-semibold text-gray-500">{order.date}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-600 line-clamp-2 leading-relaxed">
                              <span className="font-bold text-gray-800 mr-1">Items:</span>
                              {order.items}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <p className="font-black text-2xl text-emerald-700">₹{order.total}</p>
                            <button 
                              onClick={() => handleReorder(order)}
                              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-5 py-2.5 rounded-xl text-sm font-black transition"
                            >
                              <RotateCcw size={16} /> Re-order
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
                <div>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-4 md:py-3 rounded-2xl md:rounded-xl text-sm font-black transition mb-6"
                  >
                    <Plus size={18} /> Add New Address
                  </button>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-lg md:max-w-xl">
                      <h3 className="font-black text-gray-900 mb-4 text-lg">New Delivery Address</h3>
                      <textarea 
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        required
                        rows={3}
                        placeholder="Enter flat, street, landmark..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-emerald-500 mb-4 resize-none transition"
                      />
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md shadow-emerald-200">Save Address</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, idx) => (
                      <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-emerald-200 transition">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg">
                            {addr.type}
                          </span>
                          <button 
                            onClick={() => removeAddress(idx)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm font-medium leading-relaxed">{addr.text}</p>
                      </div>
                    ))}
                    
                    {addresses.length === 0 && !showAddressForm && (
                      <div className="col-span-full bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
                        <MapPin size={48} className="mx-auto mb-4 text-emerald-200" />
                        <p className="font-semibold text-lg text-gray-900 mb-1">No addresses saved</p>
                        <p className="text-sm">Save an address to checkout faster.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
