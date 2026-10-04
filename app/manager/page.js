'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Bike,
  Plus,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  LogOut,
  ChevronRight,
  Check,
  X,
  Printer,
  ChevronDown,
  Store,
  Sliders,
  Thermometer,
  ShieldCheck,
  User,
  Zap,
  Info
} from 'lucide-react';

export default function ManagerDashboard() {
  const router = useRouter();

  // Authentication & Session
  const [manager, setManager] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'fleet' | 'operations'

  // Data States
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [riders, setRiders] = useState([]);
  const [storeStatus, setStoreStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [orderFilter, setOrderFilter] = useState('ALL'); // ALL, ORDER_PLACED, PACKING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('ALL');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modals & Drawers
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastNotification, setLastNotification] = useState(null);

  // Live Clock
  const [currentTime, setCurrentTime] = useState('');

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    customerLocation: 'Kankarbagh, Patna',
    selectedItems: [{ id: 1, name: 'Amul Taaza Toned Milk', weight: '500 ml', price: 27, quantity: 2 }],
    paymentMethod: 'cash',
    notes: 'Walk-in / Phone order from Manager desk',
  });

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Dairy & Breakfast',
    weight: '500 g',
    price: '',
    mrp: '',
    stock: '',
    minThreshold: '10',
    shelfLocation: 'Aisle A-01',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=640&q=85',
  });

  // New Rider Form State
  const [newRiderForm, setNewRiderForm] = useState({
    name: '',
    phone: '',
    vehicle: 'Hero Splendor (BR-01-XX-0000)',
    status: 'AVAILABLE',
  });

  // Sound chime using Web Audio API
  const playChime = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      // Cheerful double chime
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // AudioContext policy fallback
    }
  };

  // Clock tick
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!mounted) return;
    const session = localStorage.getItem('managerSession');
    if (!session) {
      router.push('/manager/login');
    } else {
      try {
        setManager(JSON.parse(session));
      } catch {
        router.push('/manager/login');
      }
    }
  }, [mounted, router]);

  // Initial Data Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, invRes, ridersRes, statusRes] = await Promise.all([
        fetch('/api/manager/orders').then((r) => r.json()),
        fetch('/api/manager/inventory').then((r) => r.json()),
        fetch('/api/manager/riders').then((r) => r.json()),
        fetch('/api/manager/store-status').then((r) => r.json()),
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders);
      if (invRes.success) setInventory(invRes.inventory);
      if (ridersRes.success) setRiders(ridersRes.riders);
      if (statusRes.success) setStoreStatus(statusRes.storeStatus);
    } catch (err) {
      console.error('Failed to load manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('managerSession');
    router.push('/manager/login');
  };

  // Order Actions
  const updateOrderStatus = async (orderId, newStatus, assignedRider = null) => {
    const updates = { status: newStatus };
    if (assignedRider) updates.assignedRider = assignedRider;
    if (newStatus === 'DELIVERED') updates.paymentStatus = 'PAID';

    try {
      const res = await fetch('/api/manager/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, ...updates }));
        }
        playChime();
        setLastNotification(`Order ${orderId} moved to ${newStatus.replace(/_/g, ' ')}`);
        setTimeout(() => setLastNotification(null), 4000);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Assign Rider
  const handleAssignRider = async (orderId, riderName) => {
    await updateOrderStatus(orderId, 'OUT_FOR_DELIVERY', riderName);
    // Also update rider activeOrderId in local fleet
    setRiders((prev) =>
      prev.map((r) =>
        r.name === riderName
          ? { ...r, status: 'DELIVERING', activeOrderId: orderId }
          : r.activeOrderId === orderId
          ? { ...r, status: 'AVAILABLE', activeOrderId: null }
          : r
      )
    );
  };

  // Simulate Incoming Order (For quick interactive demonstration)
  const handleSimulateNewOrder = async () => {
    const sampleCustomers = [
      { name: 'Neha Chaurasia', mobile: '9822334455', address: 'B-14, Doctors Colony, Kankarbagh', location: 'Kankarbagh, Patna' },
      { name: 'Abhishek Ranjan', mobile: '9934112233', address: 'Flat 201, Shanti Tower, Saguna More', location: 'Saguna More, Patna' },
      { name: 'Suman Sinha', mobile: '9123445566', address: 'House 56, Patliputra Main Road', location: 'Patliputra, Patna' },
    ];
    const randomCustomer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    const sampleItems = [
      { id: 1, name: 'Amul Taaza Toned Milk', weight: '500 ml', price: 27, quantity: 2 },
      { id: 13, name: "Lay's Magic Masala Chips", weight: '50 g', price: 20, quantity: 3 },
      { id: 21, name: 'Coca-Cola', weight: '750 ml', price: 40, quantity: 1 },
    ];
    const total = sampleItems.reduce((acc, i) => acc + i.price * i.quantity, 0) + 15;

    const payload = {
      customer: randomCustomer,
      items: sampleItems,
      paymentMethod: Math.random() > 0.5 ? 'upi' : 'cod',
      paymentStatus: 'PAID',
      total,
      status: 'ORDER_PLACED',
      notes: 'Urgent: Customer requested fastest delivery.',
    };

    try {
      const res = await fetch('/api/manager/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        playChime();
        setLastNotification(`⚡ New Live Order Arrived: ${data.order.id} from ${randomCustomer.name}`);
        setTimeout(() => setLastNotification(null), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Inventory Stock Adjustment
  const handleStockAdjust = async (id, delta) => {
    const item = inventory.find((p) => p.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.stock + delta);

    try {
      const res = await fetch('/api/manager/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { stock: newStock } }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) =>
          prev.map((prod) => (prod.id === id ? { ...prod, stock: newStock, isAvailable: newStock > 0 } : prod))
        );
      }
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  // Toggle Inventory Availability
  const handleToggleProductAvailability = async (id) => {
    const item = inventory.find((p) => p.id === id);
    if (!item) return;
    const newAvailability = !item.isAvailable;
    const newStock = newAvailability ? (item.stock > 0 ? item.stock : 10) : 0;

    try {
      const res = await fetch('/api/manager/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { isAvailable: newAvailability, stock: newStock } }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) =>
          prev.map((prod) => (prod.id === id ? { ...prod, isAvailable: newAvailability, stock: newStock } : prod))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Store Open / Paused
  const handleToggleStoreStatus = async () => {
    if (!storeStatus) return;
    const nextStatus = !storeStatus.isOpen;
    try {
      const res = await fetch('/api/manager/store-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreStatus((prev) => ({ ...prev, isOpen: nextStatus }));
        setLastNotification(nextStatus ? '🟢 Store is now OPEN & accepting orders' : '🔴 Store is now PAUSED');
        setTimeout(() => setLastNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Speed Mode
  const handleToggleSpeedMode = async (mode) => {
    try {
      const res = await fetch('/api/manager/store-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speedMode: mode }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreStatus((prev) => ({ ...prev, speedMode: mode }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Rider Status
  const handleRiderStatusChange = async (riderId, newStatus) => {
    try {
      const res = await fetch('/api/manager/riders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: riderId, updates: { status: newStatus } }),
      });
      const data = await res.json();
      if (data.success) {
        setRiders((prev) => prev.map((r) => (r.id === riderId ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Manual Order
  const handleCreateManualOrder = async (e) => {
    e.preventDefault();
    if (!newOrderForm.customerName || !newOrderForm.customerMobile) return;

    const total = newOrderForm.selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0) + 15;
    const payload = {
      customer: {
        name: newOrderForm.customerName,
        mobile: newOrderForm.customerMobile,
        address: newOrderForm.customerAddress || 'Direct Store Counter Pickup',
        location: newOrderForm.customerLocation,
      },
      items: newOrderForm.selectedItems,
      paymentMethod: newOrderForm.paymentMethod,
      paymentStatus: newOrderForm.paymentMethod === 'cod' ? 'PENDING_COLLECTION' : 'PAID',
      total,
      status: 'ORDER_PLACED',
      notes: newOrderForm.notes,
    };

    try {
      const res = await fetch('/api/manager/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        setShowNewOrderModal(false);
        playChime();
        setLastNotification(`✅ Order ${data.order.id} registered successfully!`);
        setTimeout(() => setLastNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) return;

    const payload = {
      ...newProductForm,
      price: Number(newProductForm.price),
      mrp: Number(newProductForm.mrp || newProductForm.price),
      stock: Number(newProductForm.stock || 0),
      minThreshold: Number(newProductForm.minThreshold || 10),
    };

    try {
      const res = await fetch('/api/manager/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) => [data.item, ...prev]);
        setShowAddProductModal(false);
        setNewProductForm({
          name: '',
          category: 'Dairy & Breakfast',
          weight: '500 g',
          price: '',
          mrp: '',
          stock: '',
          minThreshold: '10',
          shelfLocation: 'Aisle A-01',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=640&q=85',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Rider Submit
  const handleAddRiderSubmit = async (e) => {
    e.preventDefault();
    if (!newRiderForm.name || !newRiderForm.phone) return;

    try {
      const res = await fetch('/api/manager/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRiderForm),
      });
      const data = await res.json();
      if (data.success) {
        setRiders((prev) => [...prev, data.rider]);
        setShowAddRiderModal(false);
        setNewRiderForm({
          name: '',
          phone: '',
          vehicle: 'Hero Splendor (BR-01-XX-0000)',
          status: 'AVAILABLE',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const pendingOrders = orders.filter((o) => ['ORDER_PLACED', 'PACKING'].includes(o.status)).length;
    const outForDelivery = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
    const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
    const totalSalesToday = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const lowStockCount = inventory.filter((i) => i.stock <= i.minThreshold).length;
    const availableRiders = riders.filter((r) => r.status === 'AVAILABLE').length;

    return {
      pendingOrders,
      outForDelivery,
      deliveredCount,
      totalSalesToday,
      lowStockCount,
      availableRiders,
      totalRiders: riders.length,
    };
  }, [orders, inventory, riders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchFilter = orderFilter === 'ALL' || order.status === orderFilter;
      const searchTerms = `${order.id} ${order.customer?.name} ${order.customer?.mobile} ${order.customer?.location}`.toLowerCase();
      const matchSearch = searchQuery.trim() === '' || searchTerms.includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchCategory = inventoryCategory === 'ALL' || item.category === inventoryCategory;
      const matchSearch =
        inventorySearch.trim() === '' ||
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.shelfLocation?.toLowerCase().includes(inventorySearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [inventory, inventoryCategory, inventorySearch]);

  const categories = ['ALL', 'Dairy & Breakfast', 'Vegetables & Fruits', 'Snacks', 'Instant Food', 'Beverages', 'Cooking Essentials'];

  if (!mounted || !manager) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-sm tracking-wide text-emerald-400">Loading Manager Control Desk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. TOP OPERATIONS LIVE BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Brand & Store Location */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                  Apna Store <span className="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">MANAGER</span>
                </h1>
                {storeStatus?.isOpen ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    PAUSED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <MapPin size={12} className="text-emerald-400" />
                {storeStatus?.storeName || manager.hubName} • {manager.area}
              </p>
            </div>
          </div>

          {/* Quick Operation Toggles (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Speed mode badge */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => handleToggleSpeedMode('EXPRESS_10M')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  storeStatus?.speedMode === 'EXPRESS_10M'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap size={14} className={storeStatus?.speedMode === 'EXPRESS_10M' ? 'fill-white' : ''} /> 10-Min Fast
              </button>
              <button
                onClick={() => handleToggleSpeedMode('RAIN_SURGE_25M')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  storeStatus?.speedMode === 'RAIN_SURGE_25M'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌧️ Rain Surge (25m)
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
              className={`p-2 rounded-xl border transition-all ${
                audioEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Clock */}
            <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Clock size={13} /> {currentTime}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Simulate Order Button (Demo & testing) */}
            <button
              onClick={handleSimulateNewOrder}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Sparkles size={14} /> + Live Order
            </button>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition"
              title="Open Customer Store in new tab"
            >
              <ExternalLink size={18} />
            </Link>

            {/* Manager Profile Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                {manager.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-200 leading-tight">{manager.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{manager.badgeId}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout from manager panel"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Real-time Notification Banner */}
      {lastNotification && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-300">
          <Sparkles size={14} /> {lastNotification}
        </div>
      )}

      {/* 2. STATS & KPI METRICS */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Orders In Pipeline</span>
              <Package size={15} className="text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.pendingOrders}</p>
            <span className="text-[10px] text-amber-400 font-bold">Needs Pick & Pack</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Out for Delivery</span>
              <Bike size={15} className="text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.outForDelivery}</p>
            <span className="text-[10px] text-blue-400 font-bold">With Active Riders</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Delivered Today</span>
              <CheckCircle2 size={15} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.deliveredCount}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Avg 8.4 mins</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Hub Revenue</span>
              <TrendingUp size={15} className="text-teal-400" />
            </div>
            <p className="text-2xl font-black text-white">₹{stats.totalSalesToday.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-teal-400 font-bold">Gross Today</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Available Fleet</span>
              <Truck size={15} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.availableRiders} <span className="text-xs text-slate-500 font-normal">/ {stats.totalRiders}</span></p>
            <span className="text-[10px] text-indigo-400 font-bold">Riders at Hub</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Low Stock Alert</span>
              <AlertCircle size={15} className={stats.lowStockCount > 0 ? 'text-rose-400' : 'text-slate-500'} />
            </div>
            <p className={`text-2xl font-black ${stats.lowStockCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {stats.lowStockCount}
            </p>
            <span className="text-[10px] text-rose-400 font-bold">SKUs below min</span>
          </div>

        </div>
      </section>

      {/* 3. TABS NAVIGATION */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-20 z-30 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Package size={16} /> Live Orders & Fulfillment
              {stats.pendingOrders > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                  {stats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 ${
                activeTab === 'inventory'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag size={16} /> Inventory & Stock
              {stats.lowStockCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                  {stats.lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 ${
                activeTab === 'fleet'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bike size={16} /> Delivery Fleet & Riders
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-bold">
                {stats.availableRiders} Idle
              </span>
            </button>

            <button
              onClick={() => setActiveTab('operations')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 ${
                activeTab === 'operations'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sliders size={16} /> Hub Operations & Controls
            </button>
          </div>

          {/* Quick Action Button for current tab */}
          <div className="hidden sm:block shrink-0">
            {activeTab === 'orders' && (
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                <Plus size={15} /> Manual Walk-in Order
              </button>
            )}
            {activeTab === 'inventory' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                <Plus size={15} /> Add New SKU
              </button>
            )}
            {activeTab === 'fleet' && (
              <button
                onClick={() => setShowAddRiderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                <Plus size={15} /> Register New Rider
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ---------------- TAB 1: LIVE ORDERS ---------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              
              {/* Order Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'ALL', label: 'All Orders', count: orders.length },
                  { id: 'ORDER_PLACED', label: 'New / Incoming', count: orders.filter((o) => o.status === 'ORDER_PLACED').length },
                  { id: 'PACKING', label: 'Packing', count: orders.filter((o) => o.status === 'PACKING').length },
                  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length },
                  { id: 'DELIVERED', label: 'Delivered', count: orders.filter((o) => o.status === 'DELIVERED').length },
                  { id: 'CANCELLED', label: 'Cancelled', count: orders.filter((o) => o.status === 'CANCELLED').length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setOrderFilter(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      orderFilter === item.id
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-black">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Order ID, Name, Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800/80">
                <Package size={42} className="mx-auto text-slate-600 mb-3" />
                <h3 className="font-black text-lg text-slate-300">No Orders in this view</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  There are no orders matching your current filter. You can simulate an order or create a manual one.
                </p>
                <button
                  onClick={handleSimulateNewOrder}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition"
                >
                  ⚡ Simulate Test Order
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const isNew = order.status === 'ORDER_PLACED';
                  const isPacking = order.status === 'PACKING';
                  const isDispatched = order.status === 'OUT_FOR_DELIVERY';
                  const isDone = order.status === 'DELIVERED';
                  const isCancelled = order.status === 'CANCELLED';

                  return (
                    <div
                      key={order.id}
                      className={`bg-slate-900 border rounded-3xl p-5 shadow-lg transition-all flex flex-col justify-between ${
                        isNew
                          ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-emerald-950/30'
                          : isPacking
                          ? 'border-amber-500/40'
                          : isDispatched
                          ? 'border-blue-500/40'
                          : 'border-slate-800'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-base text-white tracking-wide">
                                {order.id}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isNew
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse'
                                    : isPacking
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : isDispatched
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    : isDone
                                    ? 'bg-slate-800 text-slate-300'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Est. {order.preparationTimeEstimate || '8 mins'}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-black text-base text-white">₹{order.total}</p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                order.paymentStatus === 'PAID'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              }`}
                            >
                              {order.paymentMethod?.toUpperCase()} ({order.paymentStatus || 'PENDING'})
                            </span>
                          </div>
                        </div>

                        {/* Customer & Location */}
                        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 mb-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">{order.customer?.name}</span>
                            <a
                              href={`tel:${order.customer?.mobile}`}
                              className="text-emerald-400 font-mono font-semibold flex items-center gap-1 hover:underline"
                            >
                              <Phone size={11} /> {order.customer?.mobile}
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-start gap-1">
                            <MapPin size={12} className="text-slate-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{order.customer?.address}</span>
                          </p>
                        </div>

                        {/* Items list summary */}
                        <div className="space-y-1.5 mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Items ({order.items?.length || 0})
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/40 border border-slate-800/40"
                              >
                                <span className="font-medium text-slate-300">
                                  <span className="text-emerald-400 font-bold font-mono mr-1.5">
                                    {item.quantity}x
                                  </span>
                                  {item.name}
                                </span>
                                <span className="text-slate-400 font-mono text-[11px]">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rider assignment */}
                        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs mb-4">
                          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                            <Bike size={13} className="text-emerald-400" /> Assigned Rider:
                          </span>
                          {order.assignedRider ? (
                            <span className="font-bold text-emerald-300">{order.assignedRider}</span>
                          ) : (
                            <select
                              onChange={(e) => handleAssignRider(order.id, e.target.value)}
                              defaultValue=""
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                            >
                              <option value="" disabled>Assign Delivery Rider...</option>
                              {riders
                                .filter((r) => r.status === 'AVAILABLE')
                                .map((r) => (
                                  <option key={r.id} value={r.name}>
                                    {r.name} ({r.vehicle.split(' ')[0]})
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Bottom Pipeline Progress Buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                        {isNew && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PACKING')}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
                          >
                            <Package size={14} /> Accept & Start Packing
                          </button>
                        )}

                        {isPacking && (
                          <button
                            onClick={() => {
                              const defaultRider = riders.find((r) => r.status === 'AVAILABLE')?.name || 'Sunil Yadav';
                              updateOrderStatus(order.id, 'OUT_FOR_DELIVERY', order.assignedRider || defaultRider);
                            }}
                            className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-700/20"
                          >
                            <Bike size={14} /> Mark Packed & Dispatch
                          </button>
                        )}

                        {isDispatched && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                            className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-700/20"
                          >
                            <CheckCircle2 size={14} /> Confirm Delivery
                          </button>
                        )}

                        {isDone && (
                          <span className="flex-1 text-center py-2 text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                            <Check size={14} className="text-emerald-500" /> Fulfillment Complete
                          </span>
                        )}

                        {isCancelled && (
                          <span className="flex-1 text-center py-2 text-xs font-bold text-rose-400">
                            Order Cancelled
                          </span>
                        )}

                        {/* View Drawer Button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                          title="View Full Order Details"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ---------------- TAB 2: INVENTORY & STOCK ---------------- */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Inventory Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInventoryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      inventoryCategory === cat
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search SKU, product, aisle..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Inventory Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Item & SKU</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Price / MRP</th>
                      <th className="px-5 py-4">Stock Level</th>
                      <th className="px-5 py-4">Quick Adjust</th>
                      <th className="px-5 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredInventory.map((item) => {
                      const isLow = item.stock <= item.minThreshold && item.stock > 0;
                      const isOut = item.stock === 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-3.5 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-xl border border-slate-700/60 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-200 text-sm">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Pack: {item.weight} • Min: {item.minThreshold}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 font-semibold text-slate-400">
                            {item.category}
                          </td>

                          <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">
                            {item.shelfLocation || 'Main Hub'}
                          </td>

                          <td className="px-5 py-3.5 font-bold text-white">
                            ₹{item.price}{' '}
                            {item.mrp > item.price && (
                              <span className="text-[10px] text-slate-500 line-through">₹{item.mrp}</span>
                            )}
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`font-black font-mono text-sm px-2.5 py-1 rounded-lg ${
                                isOut
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : isLow
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-400'
                              }`}
                            >
                              {item.stock} units
                            </span>
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStockAdjust(item.id, -1)}
                                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center font-black active:scale-95 transition"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleStockAdjust(item.id, 1)}
                                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg flex items-center justify-center font-black active:scale-95 transition"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleStockAdjust(item.id, 10)}
                                className="px-2 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-lg font-bold transition"
                                title="Add 10 units"
                              >
                                +10
                              </button>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleToggleProductAvailability(item.id)}
                              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${
                                item.isAvailable
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                              }`}
                            >
                              {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- TAB 3: FLEET & RIDERS ---------------- */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-black text-sm text-white">Store Delivery Fleet</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track rider status, active deliveries, and manage availability in Patna Central zone.
                </p>
              </div>
              <button
                onClick={() => setShowAddRiderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                <Plus size={15} /> Add Rider
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riders.map((rider) => {
                const isAvailable = rider.status === 'AVAILABLE';
                const isDelivering = rider.status === 'DELIVERING';
                const isOnBreak = rider.status === 'ON_BREAK';

                return (
                  <div
                    key={rider.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 ${rider.avatarColor || 'bg-emerald-600'} rounded-2xl flex items-center justify-center text-white font-black text-base shadow`}>
                            {rider.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-200 text-sm">{rider.name}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Phone size={11} className="text-emerald-400" /> {rider.phone}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAvailable
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isDelivering
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : isOnBreak
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {rider.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2 mb-4 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Vehicle:</span>
                          <span className="font-medium text-slate-200">{rider.vehicle}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Deliveries Today:</span>
                          <span className="font-bold text-emerald-400">{rider.deliveriesToday} trips</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Customer Rating:</span>
                          <span className="font-bold text-amber-400">★ {rider.rating}</span>
                        </div>
                        {rider.activeOrderId && (
                          <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                            <span>Active Order:</span>
                            <span className="font-mono font-bold text-blue-400">{rider.activeOrderId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Toggle Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-bold">
                      <button
                        onClick={() => handleRiderStatusChange(rider.id, 'AVAILABLE')}
                        className={`py-1.5 rounded-xl transition ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        Idle / Ready
                      </button>
                      <button
                        onClick={() => handleRiderStatusChange(rider.id, 'ON_BREAK')}
                        className={`py-1.5 rounded-xl transition ${
                          isOnBreak
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                        }`}
                      >
                        On Break
                      </button>
                      <button
                        onClick={() => handleRiderStatusChange(rider.id, 'OFFLINE')}
                        className={`py-1.5 rounded-xl transition ${
                          rider.status === 'OFFLINE'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        Offline
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ---------------- TAB 4: HUB OPERATIONS & CONTROLS ---------------- */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            
            {/* Store Operational Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Store className="text-emerald-400" /> {storeStatus?.storeName || 'Patna Central Dark Store'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Hub Code: <strong className="text-slate-300 font-mono">{storeStatus?.hubCode}</strong> • {storeStatus?.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Store Order Acceptance:</span>
                  <button
                    onClick={handleToggleStoreStatus}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 ${
                      storeStatus?.isOpen
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/20'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-700/20'
                    }`}
                  >
                    {storeStatus?.isOpen ? '🟢 Open (Accepting Orders)' : '🔴 Paused (Store Offline)'}
                  </button>
                </div>
              </div>

              {/* Operational Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* Packing Bays */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-400" /> Active Packing Stations
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-3xl font-black text-white">{storeStatus?.activePackingBays || 3} Bays</p>
                    <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      100% Operational
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Average picker turnaround: 2.1 mins per order.
                  </p>
                </div>

                {/* Cold Chain Health */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Thermometer size={14} className="text-blue-400" /> Cold Storage Sensors
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-3xl font-black text-blue-400">{storeStatus?.coldRoomTemp || '3.6°C'}</p>
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg">
                      Optimal Chill
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Dairy & Beverages chiller safety certified within limits.
                  </p>
                </div>

                {/* Manager on Shift */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-amber-400" /> Manager on Duty
                  </h4>
                  <div className="mt-3">
                    <p className="text-base font-bold text-slate-200">{manager?.name}</p>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">{manager?.badgeId} • {manager?.shift}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Contact: {manager?.email}
                  </p>
                </div>

              </div>

              {/* Hub Broadcast Announcement */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Live Operations Announcement (Store Broadcast)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={storeStatus?.announcement || 'Peak rush active: Maintain under 3-minute pick & pack.'}
                    id="announcementInput"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('announcementInput');
                      if (input) {
                        setLastNotification(`📢 Broadcast updated: "${input.value}"`);
                        setTimeout(() => setLastNotification(null), 4000);
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition"
                  >
                    Broadcast
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 5. ORDER DETAIL DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-slate-900 border-l sm:border border-slate-800 sm:rounded-3xl h-full max-h-screen overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-black text-xl text-white">{selectedOrder.id}</h3>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {selectedOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Customer Details */}
              <div className="py-4 border-b border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer & Delivery</p>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                  <p className="font-bold text-slate-200 text-sm">{selectedOrder.customer?.name}</p>
                  <p className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <Phone size={13} /> {selectedOrder.customer?.mobile}
                  </p>
                  <p className="text-slate-300 flex items-start gap-1">
                    <MapPin size={13} className="text-slate-500 shrink-0 mt-0.5" />
                    <span>{selectedOrder.customer?.address}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Zone: {selectedOrder.customer?.location}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="py-4 border-b border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Itemized Manifest ({selectedOrder.items?.length || 0})
                </p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-200">
                          <span className="text-emerald-400 font-mono mr-1.5">{item.quantity}x</span>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{item.weight}</p>
                      </div>
                      <span className="font-mono font-bold text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-center text-sm font-black text-white px-1">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="py-4 border-b border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Manager Notes</p>
                  <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    "{selectedOrder.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Printer size={15} /> Print Packing KOT
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'CANCELLED');
                    setSelectedOrder(null);
                  }}
                  className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold text-xs transition"
                >
                  Cancel Order
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl font-bold text-xs transition"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL: CREATE MANUAL ORDER */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Plus className="text-emerald-400" size={18} /> New Manual / Walk-in Order
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">10-Digit Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="98XXXXXXXX"
                  value={newOrderForm.customerMobile}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerMobile: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Flat/House No., Street (or Counter Pickup)"
                  value={newOrderForm.customerAddress}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Payment Method</label>
                <select
                  value={newOrderForm.paymentMethod}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="cash">Cash / Counter Payment</option>
                  <option value="upi">Direct UPI Scan</option>
                  <option value="cod">Cash on Delivery (Rider Collect)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 transition"
                >
                  Place Order into Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD PRODUCT SKU */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <ShoppingBag className="text-emerald-400" size={18} /> Add New Store SKU
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother Dairy Paneer"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {categories.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pack Size / Weight</label>
                  <input
                    type="text"
                    required
                    placeholder="200 g"
                    value={newProductForm.weight}
                    onChange={(e) => setNewProductForm({ ...newProductForm, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="85"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Min Threshold</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newProductForm.minThreshold}
                    onChange={(e) => setNewProductForm({ ...newProductForm, minThreshold: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Aisle / Shelf Location</label>
                <input
                  type="text"
                  placeholder="e.g. Aisle A-03 (Chiller 2)"
                  value={newProductForm.shelfLocation}
                  onChange={(e) => setNewProductForm({ ...newProductForm, shelfLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 transition"
                >
                  Save Product to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD RIDER */}
      {showAddRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Bike className="text-emerald-400" size={18} /> Register Fleet Rider
              </h3>
              <button onClick={() => setShowAddRiderModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRiderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Rider Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Santosh Tiwari"
                  value={newRiderForm.name}
                  onChange={(e) => setNewRiderForm({ ...newRiderForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9871100XXX"
                  value={newRiderForm.phone}
                  onChange={(e) => setNewRiderForm({ ...newRiderForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Vehicle Details & Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TVS Jupiter (BR-01-PQ-5544)"
                  value={newRiderForm.vehicle}
                  onChange={(e) => setNewRiderForm({ ...newRiderForm, vehicle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 transition"
                >
                  Onboard Delivery Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hide scrollbars css */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
}
