 'use client';
import { useCartStore } from '../../../../useCartStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div
      className="store-card-in flex flex-col rounded-xl border border-gray-100 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md"
      style={{ '--store-delay': `${(product.id - 1) * 45}ms` }}
    >
      <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>
      
      <div className="text-xs font-bold text-gray-500 bg-gray-100 w-max px-2 py-1 rounded mb-2">
        10 MINS
      </div>
      
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-3">{product.weight}</p>
      
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-gray-900">₹{product.price}</span>
        <button 
          onClick={() => addToCart(product)}
          className="border border-purple-600 text-purple-600 hover:bg-purple-50 font-bold px-4 py-1.5 rounded-lg text-sm transition"
        >
          ADD
        </button>
      </div>
    </div>
  );
}