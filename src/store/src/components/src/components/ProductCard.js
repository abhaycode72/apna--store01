 'use client';
import { useCartStore } from '../../../../useCartStore';

export default function ProductCard({ product }) {
  const { items, addToCart, decreaseQuantity } = useCartStore();
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div
      className="store-card-in flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md relative overflow-hidden"
      style={{ '--store-delay': `${(product.id - 1) * 35}ms` }}
    >
      <div className="absolute top-2 left-2 z-10">
        <div className="text-[10px] font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 rounded-md shadow-sm">
          10 MINS
        </div>
      </div>
      
      <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-gray-50 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105 mix-blend-multiply"
        />
      </div>
      
      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
      <p className="text-xs font-semibold text-gray-500 mb-3">{product.weight}</p>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-black text-gray-900 leading-tight">₹{product.price}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{product.price + Math.floor(product.price * 0.2)}</span>
        </div>
        
        {quantity === 0 ? (
          <button 
            onClick={() => addToCart(product)}
            className="border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg text-sm transition active:scale-95"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-emerald-600 text-white rounded-lg overflow-hidden shadow-sm h-8">
            <button 
              onClick={() => decreaseQuantity(product.id)}
              className="w-8 h-full flex items-center justify-center hover:bg-emerald-700 transition active:bg-emerald-800 font-bold text-lg"
            >
              -
            </button>
            <span className="w-6 text-center font-bold text-sm">{quantity}</span>
            <button 
              onClick={() => addToCart(product)}
              className="w-8 h-full flex items-center justify-center hover:bg-emerald-700 transition active:bg-emerald-800 font-bold text-lg"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}