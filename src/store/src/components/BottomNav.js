'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Package, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // Hide on admin or login
  if (pathname.startsWith('/admin') || pathname === '/login') return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'search', label: 'Search', icon: Search, path: '/?search=true' }, // we can use ?search to focus search on home
    { id: 'orders', label: 'Orders', icon: Package, path: '/dashboard?tab=orders' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard?tab=profile' },
  ];

  const isActive = (item) => {
    if (item.path === '/') return pathname === '/' && typeof window !== 'undefined' && !window.location.search.includes('search=true');
    if (item.id === 'search') return pathname === '/' && typeof window !== 'undefined' && window.location.search.includes('search=true');
    if (pathname.startsWith('/dashboard')) {
       return typeof window !== 'undefined' && window.location.search.includes(item.id);
    }
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe pt-2">
      <div className="max-w-md mx-auto px-6 py-2 flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button 
              key={item.id}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 transition-all active:scale-95"
            >
              <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-purple-100' : 'bg-transparent'}`}>
                <Icon size={24} className={active ? 'text-purple-700' : 'text-gray-400'} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-purple-700' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
      `}} />
    </div>
  );
}
