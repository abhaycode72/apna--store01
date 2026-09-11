'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bike,
  CheckCircle,
  Clock,
  IndianRupee,
  Save,
  Search,
  ShieldAlert,
  ShoppingBag,
  Store,
  TrendingUp,
} from 'lucide-react';

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'stores', label: 'Dark Stores', icon: Store },
  { id: 'fleet', label: 'Fleet / Riders', icon: Bike },
  { id: 'fraud', label: 'COD & Fraud Rules', icon: ShieldAlert },
];

const orders = [
  { id: 'ORD-9021', customer: 'Rahul Kumar', store: 'Patna Central DS', total: 340, mode: 'UPI', status: 'Out for Delivery' },
  { id: 'ORD-9022', customer: 'Priya Sharma', store: 'Kankerbagh DS', total: 180, mode: 'COD', status: 'Packing' },
  { id: 'ORD-9023', customer: 'Amit Verma', store: 'Boring Road DS', total: 890, mode: 'UPI', status: 'Order Placed' },
];

const stats = [
  { label: 'Total Revenue Today', value: '₹1,42,850', icon: IndianRupee, change: '+18%' },
  { label: 'Active Orders', value: '48 Orders', icon: ShoppingBag, change: '12 Packing' },
  { label: 'Avg Delivery Time', value: '8.4 Mins', icon: Clock, change: 'Target: <10m' },
  { label: 'Riders on Field', value: '32 Active', icon: Bike, change: '4 Idle' },
];

function SaveButton({ saved, onSave }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
      {saved && <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400"><CheckCircle size={16} /> Saved successfully</span>}
      <button type="button" onClick={onSave} className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-500"><Save size={16} /> Save changes</button>
    </div>
  );
}

function OrdersTable({ search = '' }) {
  const filtered = orders.filter((order) => `${order.id} ${order.customer} ${order.store}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Store</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {filtered.map((order) => <tr key={order.id} className="hover:bg-slate-900/50"><td className="p-3 font-mono font-bold text-purple-400">{order.id}</td><td className="p-3">{order.customer}</td><td className="p-3">{order.store}</td><td className="p-3 font-semibold">₹{order.total}</td><td className="p-3"><span className={`rounded px-2 py-0.5 font-bold ${order.mode === 'COD' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{order.mode}</span></td><td className="p-3"><span className="inline-flex items-center gap-1 font-semibold text-emerald-400"><Clock size={12} />{order.status}</span></td></tr>)}
        </tbody>
      </table>
      {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No orders found.</p>}
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6"><h2 className="text-2xl font-black">{title}</h2><p className="mt-1 text-sm text-slate-400">{subtitle}</p><div className="mt-6">{children}</div></section>;
}

function Alerts() {
  return <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-6"><h2 className="flex items-center gap-2 text-lg font-bold"><AlertTriangle className="text-amber-400" size={18} />Dark Store Alerts</h2><div className="space-y-3 text-xs"><div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3"><b className="text-amber-400">Stock Out Risk</b><p className="mt-1 text-slate-300">Fresh Milk down to 3 units in Patna Central.</p></div><div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3"><b className="text-red-400">Rider Bottleneck</b><p className="mt-1 text-slate-300">Kankerbagh DS has 8 pending orders.</p></div><div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3"><b className="text-blue-400">COD Cap Triggered</b><p className="mt-1 text-slate-300">Orders above ₹1,000 route to online payment.</p></div></div></section>;
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) onLogin();
    else setError('Invalid username or password.');
    setSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-slate-100">
      <form onSubmit={submitLogin} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">apna store01</p>
        <h1 className="mt-2 text-2xl font-black">Admin login</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to access the control center.</p>
        <label className="mt-6 block text-sm font-semibold">Username<input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-purple-500" autoComplete="username" required /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-purple-500" autoComplete="current-password" required /></label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={submitting} className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-bold text-white transition hover:bg-purple-500 disabled:cursor-wait disabled:opacity-60">{submitting ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </main>
  );
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkStoreActive, setDarkStoreActive] = useState(true);
  const [codLimit, setCodLimit] = useState('1000');
  const [fraudCheck, setFraudCheck] = useState(true);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const activeLabel = sections.find((section) => section.id === activeSection)?.label;
  const saveSettings = () => { setSaved(true); window.setTimeout(() => setSaved(false), 3000); };

  useEffect(() => {
    fetch('/api/admin/session').then((response) => setAuthenticated(response.ok)).catch(() => setAuthenticated(false));
  }, []);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  if (authenticated === null) return <div className="min-h-screen bg-slate-900" />;
  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <aside className="hidden w-72 select-none border-r border-slate-800 bg-slate-950 p-6 md:block">
        <button type="button" onClick={() => setActiveSection('dashboard')} className="mb-8 text-left text-2xl font-black tracking-wider text-purple-500">APNA STORE01 ADMIN</button>
        <nav className="space-y-2 text-sm font-semibold text-slate-400" aria-label="Admin sections">
          {sections.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setActiveSection(id); setSaved(false); }} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${activeSection === id ? 'border border-purple-500/30 bg-purple-600/20 text-purple-400' : 'hover:bg-slate-900 hover:text-white'}`}><Icon size={18} /><span>{label}</span></button>)}
        </nav>
      </aside>

      <main className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Admin / {activeLabel}</p><h1 className="mt-1 text-xl font-bold">Quick Commerce Control Center</h1><p className="text-xs text-slate-400">Monitoring Patna Dark Store Region</p></div><div className="flex items-center gap-3"><span className="text-xs font-semibold text-slate-300">Store status:</span><button type="button" onClick={() => setDarkStoreActive(!darkStoreActive)} className={`rounded-lg px-4 py-2 text-xs font-bold transition ${darkStoreActive ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}>{darkStoreActive ? 'ONLINE / ACCEPTING ORDERS' : 'PAUSED'}</button><button type="button" onClick={logout} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-red-400 hover:text-red-300">Log out</button></div></header>
        <div className="flex gap-2 overflow-x-auto md:hidden">{sections.map(({ id, label }) => <button type="button" key={id} onClick={() => setActiveSection(id)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${activeSection === id ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{label}</button>)}</div>

        {activeSection === 'dashboard' && <><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon, change }) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><div className="mb-2 flex items-center justify-between text-slate-400"><span className="text-xs font-semibold">{label}</span><Icon size={20} className="text-purple-400" /></div><div className="text-2xl font-black text-white">{value}</div><span className="mt-1 inline-block text-[11px] font-bold text-emerald-400">{change}</span></div>)}</div><div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 lg:col-span-2"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Live Orders Stream</h2><button type="button" onClick={() => setActiveSection('orders')} className="text-xs font-bold text-purple-400 hover:text-white">View all</button></div><OrdersTable /></section><Alerts /></div></>}
        {activeSection === 'orders' && <Panel title="Orders" subtitle="Review and monitor every live order."><div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:max-w-sm"><Search size={17} className="text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order or customer" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" /></div><OrdersTable search={search} /></Panel>}
        {activeSection === 'stores' && <Panel title="Dark Stores" subtitle="Manage store availability and operating capacity."><div className="grid gap-4 md:grid-cols-2">{['Patna Central DS', 'Kankerbagh DS', 'Boring Road DS'].map((name) => <div key={name} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="font-bold">{name}</h3><p className="mt-1 text-xs text-slate-400">Active orders and inventory monitored</p><span className={`mt-4 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${darkStoreActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{darkStoreActive ? 'ONLINE' : 'PAUSED'}</span></div>)}</div><SaveButton saved={saved} onSave={saveSettings} /></Panel>}
        {activeSection === 'fleet' && <Panel title="Fleet / Riders" subtitle="Track rider availability and delivery capacity."><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Active riders</p><p className="mt-2 text-2xl font-black">32</p></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Available now</p><p className="mt-2 text-2xl font-black">28</p></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">On break</p><p className="mt-2 text-2xl font-black">4</p></div></div><SaveButton saved={saved} onSave={saveSettings} /></Panel>}
        {activeSection === 'fraud' && <Panel title="COD & Fraud Rules" subtitle="Control payment risk and cash collection limits."><label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"><span><span className="block font-bold">Enable fraud screening</span><span className="text-xs text-slate-400">Flag repeated cancellations and suspicious COD activity.</span></span><input type="checkbox" checked={fraudCheck} onChange={(event) => setFraudCheck(event.target.checked)} className="h-5 w-5 accent-purple-600" /></label><label className="mt-4 block max-w-sm"><span className="mb-2 block text-sm font-bold">Maximum COD order value</span><div className="flex items-center gap-2"><span className="text-slate-400">₹</span><input type="number" min="0" value={codLimit} onChange={(event) => setCodLimit(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500" /></div></label><SaveButton saved={saved} onSave={saveSettings} /></Panel>}
      </main>
    </div>
  );
}
