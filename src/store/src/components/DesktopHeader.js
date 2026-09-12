'use client';

import { Search, MapPin, User, ChevronRight, ShoppingBag, Clock, Sparkles, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '../../useAuthStore';
import { useCartStore } from '../../useCartStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DesktopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  
  if (pathname.startsWith('/admin') || pathname === '/login') return null;

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="hidden md:block bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Logo & Location */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="bg-emerald-600 text-white p-2 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl text-gray-900 tracking-tight leading-none">Apna Store</h1>
              <p className="text-[10px] font-bold text-emerald-600 tracking-wider">10 MIN DELIVERY</p>
            </div>
          </Link>
          
          <div className="h-10 w-px bg-gray-200" />
          
          <div className="flex items-center gap-2 cursor-pointer group">
            <MapPin size={20} className="text-gray-400 group-hover:text-emerald-600 transition" />
            <div>
              <p className="text-xs font-bold text-gray-500">Delivery to</p>
              <p className="text-sm font-black text-gray-900">Patna, Bihar <ChevronRight size={14} className="inline text-emerald-600" /></p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-emerald-600 transition" />
            </div>
            <input 
              type="text" 
              placeholder="Search for 'milk', 'bread', 'butter'..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
        </div>

        {/* Auth & Cart */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard?tab=orders')} className="text-gray-600 hover:text-emerald-600 font-bold text-sm flex items-center gap-2 transition">
                <Package size={20} /> Orders
              </button>
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-gray-500">Profile</p>
                    <p className="text-sm font-black text-gray-900 line-clamp-1">{user.name.split(' ')[0]}</p>
                  </div>
                </div>
                {/* Dropdown menu */}
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={() => router.push('/dashboard?tab=profile')} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-t-xl transition">My Dashboard</button>
                  <button onClick={() => { logout(); router.push('/'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-b-xl transition flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => router.push('/login')} className="font-bold text-gray-700 hover:text-emerald-600 transition">
              Login
            </button>
          )}

          <button 
            onClick={() => router.push('/checkout')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-black transition-all ${
              cartCount > 0 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <div className="text-left leading-tight hidden lg:block">
                <p className="text-[10px] opacity-90 uppercase tracking-wider">{cartCount} Items</p>
                <p className="text-sm">₹{cartTotal}</p>
              </div>
            ) : (
              <span className="text-sm hidden lg:block">My Cart</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
