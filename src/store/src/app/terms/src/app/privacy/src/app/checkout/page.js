'use client';
import { useState } from 'react';
import { CreditCard, Wallet, Banknote, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import { useCartStore } from '../../store/useCartStore';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const items = useCartStore((state) => state.items);
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 15;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (paymentMethod === 'online') {
      // Trigger Razorpay / Cashfree SDK Popup
      alert('Opening Payment Gateway (Razorpay/UPI)...');
    } else {
      // Trigger Direct Cash / Pay on Delivery Order Creation
      alert('Order Placed via Cash on Delivery! Rider will collect ₹' + grandTotal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Select Payment Method</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Selection Left Column */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Option 1: Online Payment (UPI, Cards, Wallets) */}
            <div 
              onClick={() => setPaymentMethod('online')}
              className={`p-4 border-2 rounded-xl cursor-pointer bg-white transition flex items-start justify-between ${
                paymentMethod === 'online' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg mt-1">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Online Payment / UPI</h3>
                  <p className="text-xs text-gray-500 mt-1">GPay, PhonePe, Paytm, Cards, Netbanking</p>
                  <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mt-2">
                    FASTEST CHECKOUT
                  </span>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'online'} 
                onChange={() => setPaymentMethod('online')} 
                className="accent-purple-600 h-5 w-5 mt-1" 
              />
            </div>

            {/* Option 2: Cash on Delivery / Pay at Door */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 border-2 rounded-xl cursor-pointer bg-white transition flex items-start justify-between ${
                paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg mt-1">
                  <Banknote size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cash / Pay on Delivery</h3>
                  <p className="text-xs text-gray-500 mt-1">Pay via Cash or Scan Rider's UPI QR at your doorstep</p>
                  <p className="text-[11px] text-amber-600 font-semibold mt-1">
                    *Please keep exact change ready for 10-min delivery
                  </p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')} 
                className="accent-purple-600 h-5 w-5 mt-1" 
              />
            </div>

            {/* Security Badge */}
            <div className="flex items-center text-xs text-gray-500 space-x-2 pt-2">
              <ShieldCheck size={16} className="text-green-600" />
              <span>100% Secure Payment Processing & Encrypted Checkout</span>
            </div>
          </div>

          {/* Order Summary Right Column */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 h-fit space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-3">Bill Details</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Partner Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t text-base">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{paymentMethod === 'online' ? 'Pay & Place Order' : 'Confirm COD Order'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}