'use client';

import { Search, MapPin, User, ChevronRight, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../src/store/src/components/src/components/ProductCard';
import { useCartStore } from '../src/store/useCartStore';
import { useAuthStore } from '../src/store/useAuthStore';
import { useRouter } from 'next/navigation';

const products = [
  // Dairy & Breakfast
  { id: 1, name: 'Amul Taaza Toned Milk', category: 'Dairy & Breakfast', weight: '500 ml', price: 27, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=85' },
  { id: 2, name: 'Amul Butter', category: 'Dairy & Breakfast', weight: '100 g', price: 58, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=640&q=85' },
  { id: 3, name: 'Britannia White Bread', category: 'Dairy & Breakfast', weight: '400 g', price: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=85' },
  { id: 4, name: 'Farm Fresh Eggs', category: 'Dairy & Breakfast', weight: '6 pieces', price: 48, image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=640&q=85' },
  
  // Vegetables & Fruits
  { id: 7, name: 'Onion (Pyaz)', category: 'Vegetables & Fruits', weight: '1 kg', price: 35, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85' },
  { id: 9, name: 'Tomato (Tamatar)', category: 'Vegetables & Fruits', weight: '1 kg', price: 45, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=85' },
  { id: 10, name: 'Fresh Bananas', category: 'Vegetables & Fruits', weight: '6 pieces', price: 42, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=640&q=85' },

  // Snacks
  { id: 13, name: 'Lay\'s India\'s Magic Masala Chips', category: 'Snacks', weight: '50 g', price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 18, name: 'Maggi 2-Minute Masala Noodles', category: 'Instant Food', weight: '140 g', price: 28, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 21, name: 'Coca-Cola', category: 'Beverages', weight: '750 ml', price: 40, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
];

const categories = [
  { name: 'Dairy & Bread', icon: '🥛', color: 'bg-blue-50' },
  { name: 'Snacks', icon: '🍿', color: 'bg-orange-50' },
  { name: 'Cold Drinks', icon: '🥤', color: 'bg-red-50' },
  { name: 'Fruits & Veg', icon: '🥦', color: 'bg-green-50' },
  { name: 'Instant Food', icon: '🍜', color: 'bg-yellow-50' },
  { name: 'Meats', icon: '🥩', color: 'bg-rose-50' },
  { name: 'Personal Care', icon: '🧴', color: 'bg-teal-50' },
  { name: 'Cleaning', icon: '🧼', color: 'bg-indigo-50' },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { items } = useCartStore();
  const { user } = useAuthStore();
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.weight}`.toLowerCase();
    return searchableText.includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* App Header (Instamart Style) */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
              <Clock size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-gray-900 leading-none mb-1 flex items-center gap-1">
                10 MINS <Sparkles size={14} className="text-emerald-500" />
              </h1>
              <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                Home <ChevronRight size={12} /> Patna, Bihar
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push(user ? '/dashboard?tab=profile' : '/login')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
          >
            {user ? <span className="font-bold">{user.name.charAt(0)}</span> : <User size={20} />}
          </button>
        </div>
        
        {/* Search Bar */}
        <label className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search size={20} className="shrink-0 text-emerald-600" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search 'milk', 'bread', 'chips'..."
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
          />
        </label>
      </div>

      <main className="px-4 py-4 space-y-6">
        {searchQuery.trim() !== '' ? (
          /* Search Results */
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Search Results</h3>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <p className="font-bold">No items found</p>
              </div>
            )}
          </div>
        ) : (
          /* Homepage Content */
          <>
            {/* Promo Banner */}
            <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 w-2/3">
                <h2 className="font-black text-2xl leading-tight mb-1">FREE DELIVERY</h2>
                <p className="text-sm font-medium opacity-90 mb-3">On your first 3 orders</p>
                <button className="bg-white text-emerald-700 text-xs font-black px-4 py-2 rounded-lg">ORDER NOW</button>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                <ShoppingBag size={120} />
              </div>
            </div>

            {/* Circular Category Grid */}
            <section>
              <h3 className="font-black text-gray-900 mb-3 text-lg">Shop by Category</h3>
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-2xl shadow-sm border border-black/5 group-active:scale-95 transition-transform`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-700 leading-tight">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Horizontal Scroll Product Strip (Bestsellers) */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-gray-900 text-lg">Bestsellers</h3>
                <span className="text-emerald-600 text-xs font-bold">See All</span>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 no-scrollbar">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="w-[140px] shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
            
            {/* Horizontal Scroll Product Strip (Dairy) */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-gray-900 text-lg">Daily Needs</h3>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 no-scrollbar">
                {products.filter(p => p.category === 'Dairy & Breakfast').map((product) => (
                  <div key={product.id} className="w-[140px] shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Bottom Cart (sits above BottomNav) */}
      {mounted && cartCount > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 z-50 px-4 animate-in slide-in-from-bottom-full duration-300 mx-auto max-w-md">
          <div 
            onClick={() => router.push('/checkout')}
            className="bg-emerald-600 rounded-2xl shadow-xl p-3 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white/20 rounded-lg p-2">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider opacity-90">{cartCount} Item{cartCount > 1 ? 's' : ''}</p>
                <p className="text-base font-black">₹{cartTotal}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-white font-black text-sm">
              View Cart <ChevronRight size={18} />
            </div>
          </div>
        </div>
      )}

      {/* Hide default scrollbars for smooth UI */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}