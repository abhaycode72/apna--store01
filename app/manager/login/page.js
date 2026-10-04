'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Store, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Building2, 
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('manager@apnastore.com');
  const [password, setPassword] = useState('1234');
  const [selectedHub, setSelectedHub] = useState('DS-PATNA-04');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const hubs = [
    { id: 'DS-PATNA-04', name: 'Patna Central Hub #04', area: 'Kankarbagh' },
    { id: 'DS-PATNA-02', name: 'Patna West Hub #02', area: 'Boring Road' },
    { id: 'DS-PATNA-07', name: 'Patna North Hub #07', area: 'Bailey Road' },
  ];

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate or accept default manager credentials
      if (email.trim() && password.trim()) {
        const managerSession = {
          name: 'Vikash Kumar',
          email: email.trim(),
          role: 'Store Operations Manager',
          badgeId: 'MGR-402',
          hubId: selectedHub,
          hubName: hubs.find((h) => h.id === selectedHub)?.name || 'Patna Central Hub #04',
          area: hubs.find((h) => h.id === selectedHub)?.area || 'Kankarbagh',
          shift: 'Evening Peak Shift (4 PM - 12 AM)',
          loggedInAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('managerSession', JSON.stringify(managerSession));
        }

        router.push('/manager');
      } else {
        setError('Please enter your Manager ID and Access PIN.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemoLogin = (hubId = 'DS-PATNA-04') => {
    setSelectedHub(hubId);
    setEmail('manager@apnastore.com');
    setPassword('1234');
    setIsLoading(true);

    setTimeout(() => {
      const selectedHubInfo = hubs.find((h) => h.id === hubId) || hubs[0];
      const managerSession = {
        name: 'Vikash Kumar',
        email: 'manager@apnastore.com',
        role: 'Store Operations Manager',
        badgeId: 'MGR-402',
        hubId: selectedHubInfo.id,
        hubName: selectedHubInfo.name,
        area: selectedHubInfo.area,
        shift: 'Evening Peak Shift (4 PM - 12 AM)',
        loggedInAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('managerSession', JSON.stringify(managerSession));
      }

      router.push('/manager');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Return Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Dark Store System v2.4
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-13 h-13 p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Store size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">Manager Portal</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                Operations
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Apna Store Dark Store & Fleet Control</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Quick Demo Login Preset Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap size={14} className="fill-emerald-400" /> Instant Demo Access
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Skip typing and test the live store manager panel with pre-loaded orders and fleet.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin()}
            disabled={isLoading}
            className="mt-3 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={15} /> 1-Click Launch Manager Desk
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Hub selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" /> Dark Store Hub
            </label>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
            >
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id} className="bg-slate-900 text-slate-200 py-1">
                  {hub.name} ({hub.area})
                </option>
              ))}
            </select>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" /> Manager Email / ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@apnastore.com"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password / PIN input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <KeyRound size={13} className="text-slate-400" /> Security PIN / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 4-digit PIN or password"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Default PIN: <strong className="text-emerald-400 font-mono">1234</strong></span>
              <span className="text-slate-400">Shift: Evening (4 PM)</span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Sign In to Manager Desk</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" /> TLS Encrypted Session
          </span>
          <Link href="/admin" className="text-slate-400 hover:text-emerald-400 transition font-medium">
            Super Admin View →
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-500 text-center z-10">
        Apna Store Quick Commerce Logistics & Dark Store Fulfillment Network
      </p>
    </div>
  );
}
