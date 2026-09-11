'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import Header from '../src/store/src/components/Header';
import ProductCard from '../src/store/src/components/src/components/ProductCard';

const products = [
  { id: 1, name: 'Farm Fresh Milk', category: 'Dairy', weight: '500 ml', price: 32, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=85' },
  { id: 2, name: 'Whole Wheat Bread', category: 'Bakery', weight: '400 g', price: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=85' },
  { id: 3, name: 'Red Onions', category: 'Vegetables', weight: '1 kg', price: 60, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85' },
  { id: 4, name: 'Maggi 2-Minute Noodles', category: 'Instant Food', weight: '140 g', price: 28, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 5, name: 'Fresh Bananas', category: 'Fruits', weight: '6 pieces', price: 42, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=640&q=85' },
  { id: 6, name: 'Red Apples', category: 'Fruits', weight: '4 pieces', price: 120, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=640&q=85' },
  { id: 7, name: 'Milk Chocolate', category: 'Chocolates', weight: '110 g', price: 95, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=640&q=85' },
  { id: 8, name: 'Classic Cold Drink', category: 'Beverages', weight: '750 ml', price: 45, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
  { id: 9, name: 'Instant Coffee', category: 'Beverages', weight: '100 g', price: 180, image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=640&q=85' },
  { id: 10, name: 'Masala Tea', category: 'Beverages', weight: '250 g', price: 110, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=640&q=85' },
  { id: 11, name: 'College Copy Notebook', category: 'Stationery', weight: '160 pages', price: 55, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=640&q=85' },
  { id: 12, name: 'Blue Ball Pen', category: 'Stationery', weight: 'Pack of 5', price: 50, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=640&q=85' },
  { id: 13, name: 'HB Pencils', category: 'Stationery', weight: 'Pack of 10', price: 40, image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=640&q=85' },
  { id: 14, name: 'Farm Fresh Eggs', category: 'Dairy', weight: 'Pack of 6', price: 48, image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=640&q=85' },
  { id: 15, name: 'Potato Chips', category: 'Snacks', weight: '100 g', price: 35, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 16, name: 'Bath Soap', category: 'Personal Care', weight: '100 g', price: 38, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=85' },
  { id: 17, name: 'Basmati Rice', category: 'Staples', weight: '5 kg', price: 525, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=85' },
  { id: 18, name: 'Whole Wheat Atta', category: 'Staples', weight: '5 kg', price: 285, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=640&q=85' },
  { id: 19, name: 'Toor Dal', category: 'Staples', weight: '1 kg', price: 165, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=85' },
  { id: 20, name: 'Sunflower Cooking Oil', category: 'Staples', weight: '1 litre', price: 145, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=640&q=85' },
  { id: 21, name: 'Fresh Curd', category: 'Dairy', weight: '400 g', price: 50, image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=640&q=85' },
  { id: 22, name: 'Paneer Cubes', category: 'Dairy', weight: '200 g', price: 95, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=640&q=85' },
  { id: 23, name: 'Orange Juice', category: 'Beverages', weight: '1 litre', price: 120, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=640&q=85' },
  { id: 24, name: 'Mineral Water', category: 'Beverages', weight: '1 litre', price: 20, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=640&q=85' },
  { id: 25, name: 'Cream Biscuits', category: 'Snacks', weight: '120 g', price: 30, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=640&q=85' },
  { id: 26, name: 'Toothpaste', category: 'Personal Care', weight: '150 g', price: 110, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=640&q=85' },
  { id: 27, name: 'Shampoo', category: 'Personal Care', weight: '340 ml', price: 245, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=640&q=85' },
  { id: 28, name: 'Laundry Detergent', category: 'Home Care', weight: '2 kg', price: 210, image: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?auto=format&fit=crop&w=640&q=85' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.weight}`.toLowerCase();
    return searchableText.includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="store-banner-in mb-8 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white shadow-sm">
          <h2 className="mb-2 text-3xl font-black">apna store01, delivered in 10 minutes.</h2>
          <p className="text-lg opacity-90">Fresh inventory routed from your local dark store.</p>
        </div>
        <div className="store-rise-in mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Everything you need</h3>
            <p className="mt-1 text-sm text-gray-500">Fresh groceries, snacks, drinks and stationery</p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 sm:max-w-sm">
            <Search size={19} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search milk, fruits, pen..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </label>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-14 text-center">
            <p className="font-bold text-gray-800">No products found</p>
            <p className="mt-1 text-sm text-gray-500">Try searching for fruits, coffee, copy or stationery.</p>
          </div>
        )}
      </main>
    </div>
  );
}