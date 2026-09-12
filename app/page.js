'use client';

import { Search, ChevronRight, ShoppingBag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Header from '../src/store/src/components/Header';
import ProductCard from '../src/store/src/components/src/components/ProductCard';
import { useCartStore } from '../src/store/useCartStore';
import { useRouter } from 'next/navigation';

const products = [
  // Dairy & Breakfast
  { id: 1, name: 'Amul Taaza Toned Milk', category: 'Dairy & Breakfast', weight: '500 ml', price: 27, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=85' },
  { id: 2, name: 'Amul Butter', category: 'Dairy & Breakfast', weight: '100 g', price: 58, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=640&q=85' },
  { id: 3, name: 'Britannia White Bread', category: 'Dairy & Breakfast', weight: '400 g', price: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=85' },
  { id: 4, name: 'Farm Fresh Eggs', category: 'Dairy & Breakfast', weight: '6 pieces', price: 48, image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=640&q=85' },
  { id: 5, name: 'Mother Dairy Classic Curd', category: 'Dairy & Breakfast', weight: '400 g', price: 35, image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=640&q=85' },
  { id: 6, name: 'Milky Mist Paneer', category: 'Dairy & Breakfast', weight: '200 g', price: 95, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=640&q=85' },
  
  // Vegetables & Fruits
  { id: 7, name: 'Onion (Pyaz)', category: 'Vegetables & Fruits', weight: '1 kg', price: 35, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85' },
  { id: 8, name: 'Potato (Aloo)', category: 'Vegetables & Fruits', weight: '1 kg', price: 30, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85' },
  { id: 9, name: 'Tomato (Tamatar)', category: 'Vegetables & Fruits', weight: '1 kg', price: 45, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=85' },
  { id: 10, name: 'Fresh Bananas', category: 'Vegetables & Fruits', weight: '6 pieces', price: 42, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=640&q=85' },
  { id: 11, name: 'Red Apples (Washington)', category: 'Vegetables & Fruits', weight: '4 pieces', price: 140, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=640&q=85' },
  { id: 12, name: 'Green Chilli (Hari Mirch)', category: 'Vegetables & Fruits', weight: '100 g', price: 15, image: 'https://images.unsplash.com/photo-1588046892604-0c58e57f1854?auto=format&fit=crop&w=640&q=85' },

  // Snacks
  { id: 13, name: 'Lay\'s India\'s Magic Masala Chips', category: 'Snacks', weight: '50 g', price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 14, name: 'Kurkure Masala Munch', category: 'Snacks', weight: '90 g', price: 20, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=640&q=85' },
  { id: 15, name: 'Haldiram\'s Bhujia Sev', category: 'Snacks', weight: '200 g', price: 55, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 16, name: 'Doritos Nacho Cheese', category: 'Snacks', weight: '60 g', price: 30, image: 'https://images.unsplash.com/photo-1613525287515-56543b591b61?auto=format&fit=crop&w=640&q=85' },
  { id: 17, name: 'Britannia Good Day Cashew', category: 'Snacks', weight: '200 g', price: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=640&q=85' },

  // Instant Food
  { id: 18, name: 'Maggi 2-Minute Masala Noodles', category: 'Instant Food', weight: '140 g', price: 28, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 19, name: 'Yippee Magic Masala Noodles', category: 'Instant Food', weight: '240 g', price: 45, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 20, name: 'Quaker Oats', category: 'Instant Food', weight: '1 kg', price: 190, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=640&q=85' },

  // Beverages
  { id: 21, name: 'Coca-Cola', category: 'Beverages', weight: '750 ml', price: 40, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
  { id: 22, name: 'Thums Up', category: 'Beverages', weight: '750 ml', price: 40, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
  { id: 23, name: 'Red Bull Energy Drink', category: 'Beverages', weight: '250 ml', price: 125, image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=640&q=85' },
  { id: 24, name: 'Real Fruit Power Mixed Fruit', category: 'Beverages', weight: '1 L', price: 110, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=640&q=85' },
  { id: 25, name: 'Bisleri Mineral Water', category: 'Beverages', weight: '1 L', price: 20, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=640&q=85' },

  // Cigarettes
  { id: 26, name: 'Classic Milds (Pack of 20)', category: 'Cigarettes', weight: '1 pack', price: 350, image: 'https://placehold.co/400x400/003366/FFFFFF?text=Classic%5CnMilds&font=montserrat' },
  { id: 27, name: 'Gold Flake Kings (Pack of 10)', category: 'Cigarettes', weight: '1 pack', price: 180, image: 'https://placehold.co/400x400/F4D03F/000000?text=Gold%5CnFlake&font=montserrat' },
  { id: 28, name: 'Marlboro Advance (Pack of 20)', category: 'Cigarettes', weight: '1 pack', price: 360, image: 'https://placehold.co/400x400/E74C3C/FFFFFF?text=Marlboro%5CnAdvance&font=montserrat' },

  // Staples
  { id: 31, name: 'Aashirvaad Whole Wheat Atta', category: 'Staples', weight: '5 kg', price: 245, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=640&q=85' },
  { id: 32, name: 'India Gate Basmati Rice', category: 'Staples', weight: '5 kg', price: 495, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=85' },
  { id: 33, name: 'Tata Salt', category: 'Staples', weight: '1 kg', price: 28, image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?auto=format&fit=crop&w=640&q=85' },
  
  // Personal Care
  { id: 36, name: 'Dettol Original Soap', category: 'Personal Care', weight: '4 x 125 g', price: 165, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=85' },
  { id: 37, name: 'Colgate MaxFresh Toothpaste', category: 'Personal Care', weight: '150 g', price: 115, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=640&q=85' },
];

const categories = [...new Set(products.map(p => p.category))];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.weight}`.toLowerCase();
    return searchableText.includes(searchQuery.toLowerCase().trim());
  });

  // Group products by category when not searching
  const groupedProducts = categories.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat);
    return acc;
  }, {});

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const element = document.getElementById(`category-${cat}`);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      {/* Category Nav - Sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition ${
                  activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Search Bar - Global */}
        <div className="mb-8">
          <label className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            <Search size={22} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for milk, eggs, bread..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />
          </label>
        </div>

        {searchQuery.trim() !== '' ? (
          /* Search Results View */
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-4">Search Results for "{searchQuery}"</h3>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="font-bold text-gray-900 text-lg">No items found</p>
                <p className="mt-1 text-sm text-gray-500">Check spelling or try a different term.</p>
              </div>
            )}
          </div>
        ) : (
          /* Categorized View */
          <div className="space-y-12">
            {categories.map((cat) => (
              <section key={cat} id={`category-${cat}`} className="scroll-mt-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900">{cat}</h3>
                  <button className="text-sm font-bold text-purple-600 flex items-center hover:underline">
                    See All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                  {groupedProducts[cat].slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Sticky Bottom Cart (Mobile & Desktop App-like experience) */}
      {mounted && cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-4xl mx-auto">
            <div 
              onClick={() => router.push('/checkout')}
              className="bg-emerald-600 rounded-2xl shadow-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-700 transition transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">{cartCount} Item{cartCount > 1 ? 's' : ''}</p>
                  <p className="text-lg font-black">₹{cartTotal}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white font-black text-lg">
                View Cart <ChevronRight size={24} />
              </div>
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