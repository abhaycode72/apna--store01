'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, Headphones, Mail, MessageCircle, Phone, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import Header from '../../src/store/src/components/Header';

const faqs = [
  ['Where is my order?', 'Open your order details to see the rider location and latest delivery estimate.'],
  ['Can I cancel my order?', 'You can cancel before packing starts. Once packing begins, the order cannot be cancelled.'],
  ['What if an item is missing?', 'Tell us within 24 hours and our support team will arrange a refund or replacement.'],
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [messageSent, setMessageSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isAgent: true }
  ]);
  const [chatInput, setChatInput] = useState('');

  const chatContainerRef = useRef(null);

  // Auto-scroll chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const message = event.target[1].value;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, type: 'email support' })
      });
      
      if (!res.ok) {
        throw new Error('Failed to send. Please try again or use direct email.');
      }
      setMessageSent(true);
    } catch (e) {
      console.error('Failed to send email:', e);
      setErrorMessage(e.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const currentInput = chatInput.trim();
    if (!currentInput) return;

    setMessages(prev => [...prev, { text: currentInput, isAgent: false }]);
    setChatInput('');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '', message: currentInput, type: 'chat' })
      });
    } catch (e) {
      console.error('Failed to send chat email:', e);
    }

    setTimeout(() => {
      const lower = currentInput.toLowerCase();
      let reply = "Thank you for sharing your concern. A human support executive will review this and reply to you in this chat within 2 minutes. Please keep your Order ID ready.";
      
      const isDamaged = ["kharab", "damaged", "tuta", "bekar", "expired", "bad", "rotten", "smell", "fata", "leak"].some(k => lower.includes(k));
      const isMissing = ["missing", "nahi mila", "gayab", "forgot", "kam hai", "chhut"].some(k => lower.includes(k));
      const isTracking = ["late", "kab aayega", "time", "track", "kaha hai", "where is", "order", "delivery"].some(k => lower.includes(k));
      const isRefund = ["refund", "paisa", "money", "payment", "wapas", "return"].some(k => lower.includes(k));
      const isCancel = ["cancel", "stop", "change order", "mistake", "galat order"].some(k => lower.includes(k));
      const isGreeting = ["hi", "hello", "hey", "namaste", "help"].some(k => lower.includes(k));

      if (isDamaged) {
        reply = "I am very sorry to hear that the product is damaged or expired. Please provide your Order ID and send us a clear photo of the damaged product. Our team will verify it and issue a 100% refund or send a free replacement within 30 minutes!";
      } else if (isMissing) {
        reply = "I apologize for the missing item. Please share your Order ID and the name of the item you didn't receive. We will instantly check with the dark store and process a full refund for that item.";
      } else if (isCancel) {
        reply = "You can cancel your order directly from the 'My Orders' section in the app before the packing begins. If the order is already packed or out for delivery, it cannot be cancelled.";
      } else if (isRefund) {
        reply = "Refunds are initiated immediately from our end. Depending on your bank or UPI app, it may take anywhere from a few minutes to 3-5 business days to reflect in your account.";
      } else if (isTracking) {
        reply = "To check the exact location of your delivery rider, please provide your Order ID (e.g. ORD-9021). I will track the rider's GPS location and let you know immediately.";
      } else if (isGreeting) {
        reply = "Hello there! Welcome to Apna Store Support. How can I help you today? Are you facing issues with a recent order?";
      }

      setMessages(prev => [...prev, { text: reply, isAgent: true }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="mb-8 rounded-3xl bg-gray-950 p-8 text-white shadow-xl md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">We are here for you</p>
              <h1 className="max-w-xl text-3xl font-black md:text-4xl">How can we make your delivery better?</h1>
              <p className="mt-3 max-w-lg text-gray-300">Our customer care team is available every day from 7 AM to 11 PM.</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-gray-950">
              <Headphones size={30} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <button type="button" onClick={() => setChatOpen(!chatOpen)} className="group rounded-2xl border border-white bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700"><MessageCircle size={21} /></span>
            <span className="block font-bold text-gray-950">Live chat</span>
            <span className="mt-1 block text-sm text-gray-500">Usually replies in under 2 minutes</span>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-purple-700">{chatOpen ? 'Close chat' : 'Start chat'} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </button>
          <a href="tel:+911800123456" className="group rounded-2xl border border-white bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Phone size={21} /></span>
            <span className="block font-bold text-gray-950">Call us</span>
            <span className="mt-1 block text-sm text-gray-500">1800 123 456, toll-free support</span>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-emerald-700">Call now <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </a>
          <a href="mailto:care@apnastore.com" className="group rounded-2xl border border-white bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Mail size={21} /></span>
            <span className="block font-bold text-gray-950">Email support</span>
            <span className="mt-1 block text-sm text-gray-500">care@apnastore.com</span>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-blue-700">Send email <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </a>
        </div>

        {chatOpen && (
          <section className="mt-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-gray-950">Apna Store live chat</h2>
                <p className="mt-1 text-sm text-gray-500">Hi! Tell us what went wrong and a support agent will join shortly.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Agent online</span>
            </div>
            
            <div ref={chatContainerRef} className="mt-4 h-64 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isAgent ? 'justify-start' : 'justify-end'}`}>
                  <div className={`rounded-xl px-4 py-2 text-sm max-w-[80%] ${msg.isAgent ? 'bg-white border border-gray-200 text-gray-800' : 'bg-purple-600 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input 
                required 
                aria-label="Chat message" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..." 
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100" 
              />
              <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700"><Send size={17} /> Send</button>
            </form>
          </section>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-gray-950">Quick answers</h2>
            <div className="divide-y divide-gray-100">
              {faqs.map(([question, answer], index) => (
                <div key={question} className="py-3">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between text-left font-bold text-gray-800">
                    {question}
                    <ChevronDown size={18} className={`transition ${openFaq === index ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} />
                  </button>
                  {openFaq === index && <p className="mt-2 pr-6 text-sm leading-6 text-gray-500">{answer}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-black text-gray-950">Send us a message</h2>
            <p className="mb-4 text-sm text-gray-500">We will get back to you as soon as possible.</p>
            {messageSent ? (
              <div className="rounded-xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-800">Thanks. Your message is with our support team now.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}
                <input required aria-label="Your email" type="email" placeholder="Your email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50" disabled={isSubmitting} />
                <textarea required aria-label="How can we help" placeholder="How can we help?" rows={4} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50" disabled={isSubmitting} />
                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-bold text-white transition hover:bg-purple-700 disabled:bg-purple-400">
                  <Send size={17} /> {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-400"><ShieldCheck size={15} className="text-emerald-600" /> Your details stay private.</div>
          </section>
        </div>
      </main>
    </div>
  );
}