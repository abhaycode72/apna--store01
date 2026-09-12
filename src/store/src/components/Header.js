 'use client';
import { Headphones, Home, MapPin, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../useCartStore';
import { useAuthStore } from '../../useAuthStore';

export default function Header() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center space-x-2">
          <h1 className="text-2xl font-black text-purple-700">apna store01</h1>
        </button>
        
        {/* Hyperlocal Delivery Indicator */}
        <div className="hidden md:flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivery in 10 Min</span>
          <div className="flex items-center text-sm font-semibold">
            <MapPin size={16} className="text-purple-600 mr-1" />
            Home - 800001, Patna
          </div>
        </div>

        {/* Cart Button */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/')} aria-label="Home" title="Home" className="hidden rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:block">
            <Home size={19} />
          </button>
          <button onClick={() => router.push('/support')} aria-label="Customer service" title="Customer service" className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200 shadow-sm">
            <Headphones size={18} />
            <span>Customer Service</span>
          </button>
          {user ? (
            <button onClick={() => router.push('/dashboard')} aria-label="Dashboard" title="Dashboard" className="flex items-center gap-2 rounded-lg border border-purple-200 px-2 sm:px-3 py-2 text-sm font-bold text-purple-700 bg-purple-50 transition hover:bg-purple-100">
              <UserRound size={18} />
              <span>Dashboard</span>
            </button>
          ) : (
            <button onClick={() => router.push('/login')} aria-label="Login" title="Login" className="flex items-center gap-2 rounded-lg border border-purple-200 px-2 sm:px-3 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-50">
              <UserRound size={18} />
              <span>Login</span>
            </button>
          )}
          <button onClick={() => router.push('/admin')} aria-label="Admin dashboard" title="Admin dashboard" className="hidden rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 md:block">
            <ShieldCheck size={19} />
          </button>
          <button onClick={() => router.push('/checkout')} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-purple-700 transition">
            <ShoppingBag size={20} />
            <span>{cartCount} Items</span>
          </button>
        </div>
      </div>
    </header>
  );
}