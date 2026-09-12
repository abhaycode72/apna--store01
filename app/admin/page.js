'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Users, DollarSign, LogOut, Search, ChevronRight, TrendingUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Admin Dashboard
const MOCK_STATS = [
  { label: 'Total Revenue', value: '₹45,231', icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Total Orders', value: '156', icon: ShoppingBag, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Active Users', value: '2,405', icon: Users, trend: '+15.3%', color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Pending Deliveries', value: '12', icon: Package, trend: '-2.4%', color: 'text-orange-600', bg: 'bg-orange-100' },
];

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'Mayank Kumar', total: '₹450', items: 4, status: 'Delivered', time: '10 mins ago' },
  { id: 'ORD-002', customer: 'Rahul Sharma', total: '₹120', items: 2, status: 'Processing', time: '25 mins ago' },
  { id: 'ORD-003', customer: 'Priya Singh', total: '₹890', items: 12, status: 'Out for Delivery', time: '1 hr ago' },
  { id: 'ORD-004', customer: 'Amit Verma', total: '₹340', items: 3, status: 'Delivered', time: '2 hrs ago' },
  { id: 'ORD-005', customer: 'Sneha Gupta', total: '₹210', items: 2, status: 'Cancelled', time: '5 hrs ago' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Simple admin check
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Admin Panel...</div>;

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  const NavItem = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          isActive 
            ? 'bg-gray-900 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar (Desktop) / Mobile Topbar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col md:min-h-screen z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl text-gray-900 tracking-tight">Admin<span className="text-emerald-600">Pro</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management Portal</p>
          </div>
          {/* Mobile Menu Toggle could go here if needed, but keeping it simple for now */}
        </div>
        
        <div className="p-4 flex-1 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
          <NavItem id="dashboard" label="Dashboard" icon={TrendingUp} />
          <NavItem id="orders" label="All Orders" icon={Package} />
          <NavItem id="customers" label="Customers" icon={Users} />
          <NavItem id="products" label="Products" icon={ShoppingBag} />
        </div>
        
        <div className="p-4 border-t border-gray-100 hidden md:block">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} /> Logout System
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="relative hidden sm:block w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders, customers, products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-gray-900 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition">View Store</Link>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-tight">Super Admin</p>
                <p className="text-[10px] font-bold text-gray-500">System Owner</p>
              </div>
              <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">
                A
              </div>
            </div>
            {/* Mobile Logout */}
            <button onClick={handleLogout} className="md:hidden p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-lg ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Overview</h2>
              <p className="text-sm font-medium text-gray-500">Track your store's performance today.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition">Export Data</button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-sm transition">Generate Report</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Recent Orders</h3>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-[10px] font-semibold text-gray-500">{order.time}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{order.customer}</td>
                      <td className="px-6 py-4 font-semibold text-gray-600">{order.items} items</td>
                      <td className="px-6 py-4 font-black text-gray-900">{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </main>
      </div>
      
      {/* Hide scrollbars but keep functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}