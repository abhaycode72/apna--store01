'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, AlertCircle, Eye, EyeOff, Zap, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../src/store/useAuthStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@apnastore.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loginStore = useAuthStore((state) => state.login);

  const executeAdminSession = async (userEmail) => {
    // 1. Set local storage keys for admin access
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('admin-bypass', 'true');
    localStorage.setItem(
      'adminUser',
      JSON.stringify({
        email: userEmail,
        name: 'Super Admin',
        role: 'admin',
        loggedInAt: new Date().toISOString(),
      })
    );

    // 2. Set backend session cookie via API
    try {
      await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: password || 'admin' }),
      });
    } catch (e) {
      // Backend api failure non-fatal for local client admin
    }

    // 3. Update global zustand auth store
    loginStore({
      name: 'Super Admin',
      email: userEmail,
      phone: '+91 9876543210',
      role: 'admin',
      id: 'admin-super-01',
    });

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 600);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Check Built-in Super Admin Credentials
      const isSuperAdminEmail =
        cleanEmail === 'admin@apnastore.com' ||
        cleanEmail === 'admin' ||
        cleanEmail === 'mayank@apnastore.com';

      const isSuperAdminPass =
        cleanPass === 'admin' ||
        cleanPass === 'apna123' ||
        cleanPass === 'admin123';

      if (isSuperAdminEmail && isSuperAdminPass) {
        await executeAdminSession(cleanEmail.includes('@') ? cleanEmail : 'admin@apnastore.com');
        return;
      }

      // 2. Try Supabase Auth
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (!authError && data?.session) {
          await executeAdminSession(data.user.email);
          return;
        }
      } catch (sbErr) {
        // Supabase error handling
      }

      // If credentials didn't match super admin or Supabase
      setError('Invalid credentials! Default: admin@apnastore.com / admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Login error. Please try default admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@apnastore.com');
    setPassword('admin');
    setIsLoading(true);
    setError('');
    await executeAdminSession('admin@apnastore.com');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 text-center relative z-10">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Super Admin Portal</h1>
        <p className="text-gray-400 mt-2 text-xs font-semibold uppercase tracking-widest">
          Store Control & Analytics Center
        </p>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative z-10">
        {/* Credentials Info Badge */}
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
              <Zap size={14} /> Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black px-2.5 py-1 rounded-lg transition active:scale-95"
            >
              1-Click Auto Login
            </button>
          </div>
          <div className="text-xs font-mono text-gray-300 space-y-1">
            <div>
              <span className="text-gray-500">Email:</span> <b className="text-white">admin@apnastore.com</b>
            </div>
            <div>
              <span className="text-gray-500">Password:</span> <b className="text-white">admin</b> <span className="text-gray-500">(or apna123)</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-200">Authenticated successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-300">Admin Email / Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="text"
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3.5 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-white placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-4 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
            ) : success ? (
              'Access Granted...'
            ) : (
              'Secure Admin Login'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between text-xs font-bold text-gray-500">
          <button
            onClick={() => router.push('/')}
            className="hover:text-white transition flex items-center gap-1"
          >
            &larr; Back to Store
          </button>
          <button
            onClick={() => router.push('/manager/login')}
            className="text-emerald-500 hover:text-emerald-400 transition"
          >
            Dark Store Manager &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
