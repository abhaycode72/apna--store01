'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Package, Plus, User, FileText, ChevronRight } from 'lucide-react';
import Header from '../../src/store/src/components/Header';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, addresses, addAddress, removeAddress, orders } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  // Protect route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null; // loading or redirecting

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 bg-gradient-to-br from-purple-600 to-indigo-800 text-white text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center text-3xl font-black mb-3 border-2 border-white/30">
                {user.name?.charAt(0) || 'U'}
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-purple-200">{user.email}</p>
            </div>
            
            <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'addresses' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={18} /> Saved Addresses
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18} /> Profile Details
              </button>
              
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-2xl font-black text-gray-900">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-semibold">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-bold text-gray-500">Order ID</span>
                          <p className="font-black text-gray-900">{order.id}</p>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-500">Date</span>
                          <p className="font-semibold text-gray-900">{order.date}</p>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-500">Total</span>
                          <p className="font-black text-purple-700">₹{order.total}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{order.items}</p>
                            <button className="text-sm font-bold text-purple-600 mt-1 hover:underline">View Details</button>
                          </div>
                        </div>
                        <button className="shrink-0 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                          <ChevronRight size={20} className="text-gray-400" />
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Saved Addresses</h2>
                <button 
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Add Delivery Address</h3>
                  <textarea 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter complete address details..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 mb-4 resize-none"
                  />
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 transition">Save Address</button>
                  </div>
                </form>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((addr, idx) => (
                  <div key={addr.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider px-2 py-1 rounded">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{addr.text}</p>
                    
                    <button 
                      onClick={() => removeAddress(idx)}
                      className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                {addresses.length === 0 && !showAddressForm && (
                  <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold mb-4">No saved addresses found.</p>
                    <button onClick={() => setShowAddressForm(true)} className="text-sm font-bold text-purple-600 hover:underline">Add your first address</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-2xl font-black text-gray-900">Profile Details</h2>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="text-sm font-bold text-gray-500 block mb-1">Full Name</label>
                    <div className="font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{user.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-500 block mb-1">Email Address</label>
                    <div className="font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-500 block mb-1">Phone Number</label>
                    <div className="font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{user.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
