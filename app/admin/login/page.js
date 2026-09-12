'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data?.session) {
        // Success - Redirect to secure admin dashboard
        router.push('/admin');
      }
    } catch (err) {
      console.error('Admin login error:', err.message);
      setError('Invalid email or password. Only authorized admins can access this page.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
        <p className="text-gray-400 mt-2 text-sm font-semibold uppercase tracking-widest">Restricted Access</p>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-300">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apnastore.com" 
                required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-4 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
            ) : (
              'Secure Login'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <button onClick={() => router.push('/')} className="text-sm font-bold text-gray-500 hover:text-white transition">
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
