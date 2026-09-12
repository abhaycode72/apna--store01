'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import Header from '../src/store/src/components/Header';
import ProductCard from '../src/store/src/components/src/components/ProductCard';

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

  // Snacks & Munchies
  { id: 13, name: 'Lay\'s India\'s Magic Masala Chips', category: 'Snacks', weight: '50 g', price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 14, name: 'Kurkure Masala Munch', category: 'Snacks', weight: '90 g', price: 20, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=640&q=85' },
  { id: 15, name: 'Haldiram\'s Bhujia Sev', category: 'Snacks', weight: '200 g', price: 55, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=640&q=85' },
  { id: 16, name: 'Doritos Nacho Cheese', category: 'Snacks', weight: '60 g', price: 30, image: 'https://images.unsplash.com/photo-1613525287515-56543b591b61?auto=format&fit=crop&w=640&q=85' },
  { id: 17, name: 'Britannia Good Day Cashew', category: 'Snacks', weight: '200 g', price: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=640&q=85' },

  // Instant Food
  { id: 18, name: 'Maggi 2-Minute Masala Noodles', category: 'Instant Food', weight: '140 g', price: 28, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 19, name: 'Yippee Magic Masala Noodles', category: 'Instant Food', weight: '240 g', price: 45, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85' },
  { id: 20, name: 'Quaker Oats', category: 'Instant Food', weight: '1 kg', price: 190, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=640&q=85' },

  // Cold Drinks & Juices
  { id: 21, name: 'Coca-Cola', category: 'Beverages', weight: '750 ml', price: 40, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
  { id: 22, name: 'Thums Up', category: 'Beverages', weight: '750 ml', price: 40, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85' },
  { id: 23, name: 'Red Bull Energy Drink', category: 'Beverages', weight: '250 ml', price: 125, image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=640&q=85' },
  { id: 24, name: 'Real Fruit Power Mixed Fruit', category: 'Beverages', weight: '1 L', price: 110, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=640&q=85' },
  { id: 25, name: 'Bisleri Mineral Water', category: 'Beverages', weight: '1 L', price: 20, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=640&q=85' },

  // Cigarettes & Tobacco
  { id: 26, name: 'Classic Milds (Pack of 20)', category: 'Cigarettes', weight: '1 pack', price: 350, image: 'https://placehold.co/400x400/003366/FFFFFF?text=Classic%5CnMilds&font=montserrat' },
  { id: 27, name: 'Gold Flake Kings (Pack of 10)', category: 'Cigarettes', weight: '1 pack', price: 180, image: 'https://placehold.co/400x400/F4D03F/000000?text=Gold%5CnFlake&font=montserrat' },
  { id: 28, name: 'Marlboro Advance (Pack of 20)', category: 'Cigarettes', weight: '1 pack', price: 360, image: 'https://placehold.co/400x400/E74C3C/FFFFFF?text=Marlboro%5CnAdvance&font=montserrat' },
  { id: 29, name: 'Classic Regular (Pack of 10)', category: 'Cigarettes', weight: '1 pack', price: 175, image: 'https://placehold.co/400x400/2C3E50/FFFFFF?text=Classic%5CnRegular&font=montserrat' },
  { id: 30, name: 'Benson & Hedges (Pack of 20)', category: 'Cigarettes', weight: '1 pack', price: 380, image: 'https://placehold.co/400x400/D4AF37/000000?text=Benson%5Cn&%5CnHedges&font=montserrat' },

  // Staples
  { id: 31, name: 'Aashirvaad Whole Wheat Atta', category: 'Staples', weight: '5 kg', price: 245, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=640&q=85' },
  { id: 32, name: 'India Gate Basmati Rice', category: 'Staples', weight: '5 kg', price: 495, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=85' },
  { id: 33, name: 'Tata Salt', category: 'Staples', weight: '1 kg', price: 28, image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?auto=format&fit=crop&w=640&q=85' },
  { id: 34, name: 'Fortune Sunflower Oil', category: 'Staples', weight: '1 L', price: 145, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=640&q=85' },
  { id: 35, name: 'Madhur Refined Sugar', category: 'Staples', weight: '1 kg', price: 55, image: 'https://images.unsplash.com/photo-1581006509489-026f784e13d9?auto=format&fit=crop&w=640&q=85' },

  // Personal Care
  { id: 36, name: 'Dettol Original Soap', category: 'Personal Care', weight: '4 x 125 g', price: 165, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=85' },
  { id: 37, name: 'Colgate MaxFresh Toothpaste', category: 'Personal Care', weight: '150 g', price: 115, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=640&q=85' },
  { id: 38, name: 'Head & Shoulders Shampoo', category: 'Personal Care', weight: '340 ml', price: 340, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=640&q=85' },
  { id: 39, name: 'Nivea Men Deodorant', category: 'Personal Care', weight: '150 ml', price: 220, image: 'https://images.unsplash.com/photo-1594966601429-ca91307b22fc?auto=format&fit=crop&w=640&q=85' },

  // Home & Cleaning
  { id: 40, name: 'Surf Excel Easy Wash', category: 'Cleaning', weight: '1.5 kg', price: 185, image: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?auto=format&fit=crop&w=640&q=85' },
  { id: 41, name: 'Vim Dishwash Gel', category: 'Cleaning', weight: '500 ml', price: 110, image: 'https://images.unsplash.com/photo-1584824388147-36e6329fc5f3?auto=format&fit=crop&w=640&q=85' },
  { id: 42, name: 'Lizol Floor Cleaner', category: 'Cleaning', weight: '975 ml', price: 199, image: 'https://images.unsplash.com/photo-1584824388147-36e6329fc5f3?auto=format&fit=crop&w=640&q=85' },

  // Sweet Tooth
  { id: 43, name: 'Cadbury Dairy Milk Silk', category: 'Sweet Tooth', weight: '150 g', price: 175, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=640&q=85' },
  { id: 44, name: 'Nestle KitKat', category: 'Sweet Tooth', weight: '38 g', price: 25, image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=640&q=85' },
  { id: 45, name: 'Amul Vanilla Ice Cream', category: 'Sweet Tooth', weight: '1 L', price: 220, image: 'https://images.unsplash.com/photo-1570197781417-0a82375c9371?auto=format&fit=crop&w=640&q=85' },

  // Stationery & More
  { id: 46, name: 'Classmate Notebook (Ruled)', category: 'Stationery', weight: '160 pages', price: 55, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=640&q=85' },
  { id: 47, name: 'Cello Reynolds Blue Pen', category: 'Stationery', weight: 'Pack of 5', price: 50, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=640&q=85' },
  { id: 48, name: 'Duracell AA Batteries', category: 'Electronics', weight: 'Pack of 4', price: 160, image: 'https://images.unsplash.com/photo-1611077544837-773df4fb4938?auto=format&fit=crop&w=640&q=85' },
  { id: 49, name: 'Whisper Ultra Clean Pads', category: 'Personal Care', weight: '15 pads', price: 145, image: 'https://images.unsplash.com/photo-1584305574635-4303d7ae81ce?auto=format&fit=crop&w=640&q=85' },
  { id: 50, name: 'Pampers Active Baby Diapers', category: 'Baby Care', weight: '42 Pieces (L)', price: 699, image: 'https://images.unsplash.com/photo-1518779836365-1d4416183e84?auto=format&fit=crop&w=640&q=85' },
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