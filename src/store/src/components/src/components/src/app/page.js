'use client';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Farm Fresh Milk', weight: '500 ml', price: 32 },
  { id: 2, name: 'Whole Wheat Bread', weight: '400 g', price: 45 },
  { id: 3, name: 'Red Onions', weight: '1 kg', price: 60 },
  { id: 4, name: 'Maggi 2-Minute Noodles', weight: '140 g', price: 28 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Promotional Banner */}
        <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-sm">
          <h2 className="text-3xl font-black mb-2">Groceries in 10 Minutes.</h2>
          <p className="text-lg opacity-90">Fresh inventory routed from your local dark store.</p>
        </div>

        {/* Product Grid */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Essentials</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}