'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut, MapPin, Package, User, LayoutDashboard, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../useAuthStore';
import { useEffect, useState } from 'react';

export default function GlobalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on admin routes, login routes, or if not logged in
  if (!mounted) return null;
  if (pathname.startsWith('/admin') || pathname === '/login' || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Shop Groceries', icon: ShoppingCart, path: '/' },
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, path: '/dashboard?tab=overview' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/dashboard?tab=orders' },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, path: '/dashboard?tab=addresses' },
    { id: 'profile', label: 'Profile Details', icon: User, path: '/dashboard?tab=profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    // For dashboard tabs, read searchParams via window location to keep it simple in Client Component
    return pathname.startsWith('/dashboard') && typeof window !== 'undefined' && window.location.search.includes(path.split('?')[1]);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-20 left-4 z-[60] p-2 bg-white rounded-lg shadow-md border border-gray-100 text-purple-700"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[50]"
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-4rem)] md:top-16 z-[55] w-64 bg-white border-r border-gray-100 shadow-sm shrink-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-full flex flex-col overflow-y-auto pt-16 md:pt-0">
          {/* User Info */}
          <div className="p-6 bg-purple-50 text-center border-b border-purple-100">
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-md">
              {user.name?.charAt(0) || 'U'}
            </div>
            <h2 className="font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs font-semibold text-gray-500 truncate">{user.email}</p>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    router.push(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    active 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} /> 
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="p-3 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="text-red-500" /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
