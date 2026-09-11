'use client';

import { useState } from 'react';
import { ArrowRight, Banknote, Building2, Check, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import Header from '../../src/store/src/components/Header';
import { useCartStore } from '../../src/store/useCartStore';

const paymentOptions = [
  {
    id: 'upi',
    title: 'UPI / Online',
    description: 'GPay, PhonePe, Paytm and netbanking',
    icon: Wallet,
    tone: 'purple',
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    description: 'Visa, Mastercard and RuPay accepted',
    icon: CreditCard,
    tone: 'blue',
  },
  {
    id: 'bank',
    title: 'Net Banking',
    description: 'Select your bank and pay securely online',
    icon: Building2,
    tone: 'indigo',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay cash or scan the rider\'s UPI QR',
    icon: Banknote,
    tone: 'green',
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = 15;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-600">Fast checkout</p>
          <h1 className="text-3xl font-black text-gray-950">How would you like to pay?</h1>
          <p className="mt-2 text-gray-600">Choose a payment mode. Your order is delivered in 10 minutes.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <section className="space-y-3 md:col-span-2">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = paymentMethod === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPaymentMethod(option.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected ? 'border-purple-600 ring-4 ring-purple-100' : 'border-white'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`rounded-xl p-3 ${option.tone === 'purple' ? 'bg-purple-100 text-purple-700' : option.tone === 'blue' ? 'bg-blue-100 text-blue-700' : option.tone === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      <Icon size={22} />
                    </span>
                    <span>
                      <span className="block font-bold text-gray-950">{option.title}</span>
                      <span className="mt-1 block text-sm text-gray-500">{option.description}</span>
                    </span>
                  </span>
                  <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-transparent'}`}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
            {paymentMethod === 'bank' && (
              <label className="block rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                <span className="mb-2 block text-sm font-bold text-gray-800">Choose your bank</span>
                <select
                  value={selectedBank}
                  onChange={(event) => setSelectedBank(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </label>
            )}
            <div className="flex items-center gap-2 px-1 pt-3 text-xs font-semibold text-gray-500">
              <ShieldCheck size={17} className="text-emerald-600" />
              100% secure checkout with encrypted payment processing
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-white bg-white p-6 shadow-sm">
            <h2 className="border-b border-gray-100 pb-4 font-bold text-gray-950">Bill details</h2>
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between text-gray-600"><span>Items subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-950"><span>To pay</span><span>₹{grandTotal}</span></div>
            </div>
            {orderPlaced ? (
              <div className="rounded-xl bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-800">Order confirmed. {paymentMethod === 'bank' ? `Payment via ${selectedBank}` : 'Payment details received'}.</div>
            ) : (
              <button onClick={handlePlaceOrder} className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
                <span>{paymentMethod === 'cod' ? 'Confirm COD Order' : 'Pay & Place Order'}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}