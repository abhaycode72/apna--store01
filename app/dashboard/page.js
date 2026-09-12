'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Package, Plus, User, FileText, ChevronRight, RotateCcw, LayoutDashboard, ShoppingCart } from 'lucide-react';
import Header from '../../src/store/src/components/Header';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useCartStore } from '../../src/store/useCartStore';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, addresses, addAddress, removeAddress, orders } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const [activeTab, setActiveTab] = useState('overview');
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
    addItem({ id: 'reorder-' + Date.now(), name: 'Reordered Items', price: order.total, quantity: 1, image: 'https://placehold.co/100x100/purple/white?text=Reorder' });
    router.push('/checkout');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile Details', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:sticky md:top-24">
            
            {/* User Info Header */}
            <div className="p-6 bg-purple-50 text-center border-b border-purple-100">
              <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-md">
                {user.name?.charAt(0) || 'U'}
              </div>
              <h2 className="font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs font-semibold text-gray-500 truncate">{user.email}</p>
            </div>
            
            {/* Navigation Menu */}
            <nav className="p-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} /> 
                    {tab.label}
                  </button>
                );
              })}
              
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              
              <button 
                onClick={() => router.push('/')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <ShoppingCart size={18} className="text-emerald-600" /> Start Shopping
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} className="text-red-500" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[600px]">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Welcome back, {user.name?.split(' ')[0]}!</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div 
                    onClick={() => setActiveTab('orders')}
                    className="bg-orange-50 border border-orange-100 rounded-2xl p-6 cursor-pointer hover:shadow-md transition group"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Package className="text-orange-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Total Orders</h3>
                    <p className="text-gray-600 font-semibold">{orders.length} orders placed</p>
                  </div>
                  
                  <div 
                    onClick={() => setActiveTab('addresses')}
                    className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 cursor-pointer hover:shadow-md transition group"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="text-emerald-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Saved Addresses</h3>
                    <p className="text-gray-600 font-semibold">{addresses.length} addresses saved</p>
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-4">Quick Profile Info</h3>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400" />
                    <span className="font-bold text-gray-700">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <span className="font-semibold text-gray-600">{user.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="bg-gray-50 rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold text-lg text-gray-600 mb-2">No orders found</p>
                    <p className="text-sm">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-200 transition">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Order ID</span>
                            <p className="font-black text-gray-900">#{order.id}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Date</span>
                            <p className="font-semibold text-gray-900">{order.date}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Amount</span>
                            <p className="font-black text-purple-700">₹{order.total}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-gray-600 flex-1 leading-relaxed">
                            <span className="font-bold text-gray-800 block mb-1">Items:</span>
                            {order.items}
                          </p>
                          <button 
                            onClick={() => handleReorder(order)}
                            className="shrink-0 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-100 transition active:scale-95 w-full sm:w-auto"
                          >
                            <RotateCcw size={16} /> Re-order Items
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Saved Addresses</h2>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-sm"
                  >
                    <Plus size={18} /> Add New
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-3xl border border-gray-100 p-6 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-black text-gray-900 mb-4">Add Delivery Address</h3>
                    <textarea 
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="Enter complete flat, street, and landmark details..."
                      className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 mb-4 resize-none"
                    />
                    <div className="flex gap-3 justify-end">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200 transition">Save Address</button>
                    </div>
                  </form>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((addr, idx) => (
                    <div key={addr.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative group hover:border-purple-300 transition flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4 flex-1">{addr.text}</p>
                      
                      <div className="flex justify-end pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeAddress(idx)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition bg-red-50 px-3 py-1.5 rounded-lg"
                        >
                          Remove Address
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="col-span-full bg-gray-50 rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
                      <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold text-lg text-gray-600 mb-2">No saved addresses</p>
                      <button onClick={() => setShowAddressForm(true)} className="text-sm font-bold text-purple-600 hover:underline">Add your first address</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Profile Details</h2>
                
                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 md:p-8 max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Full Name</label>
                      <div className="font-bold text-gray-900 bg-white px-4 py-3.5 rounded-xl border border-gray-200">{user.name}</div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Email Address</label>
                      <div className="font-bold text-gray-900 bg-white px-4 py-3.5 rounded-xl border border-gray-200">{user.email}</div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Phone Number</label>
                      <div className="font-bold text-gray-900 bg-white px-4 py-3.5 rounded-xl border border-gray-200">{user.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </section>

      </main>
    </div>
  );
}
