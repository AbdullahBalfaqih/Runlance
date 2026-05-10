'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Menu, LogOut, Settings, Home, Briefcase, Mic, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Silk from '@/components/ui/silk';
import BorderGlow from '@/components/ui/border-glow';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'My Personas', href: '/dashboard/personas' },
    { icon: FileText, label: 'My Resume', href: '/dashboard/resume' },
    { icon: Mic, label: 'Interview Prep', href: '/dashboard/interview' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="h-screen w-full flex relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 opacity-100">
        <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-black/95 backdrop-blur-2xl text-white transition-all duration-500 flex flex-col z-[50] border-r border-white/10 fixed md:relative h-screen ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header */}
        <div className={`flex items-center p-6 border-b border-white/10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {(sidebarOpen || isMobileMenuOpen) && (
            <div className="flex items-center gap-3">
              <img src="/logo-white.png" alt="Runlance Logo" className="w-10 h-10 object-contain" />
              <span className="font-bold text-xl tracking-tighter">Runlance</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden md:block"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 rounded-lg hover:bg-white/5 transition ${sidebarOpen ? 'px-4' : 'justify-center'}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`button2 w-full !bg-transparent border border-white/10 hover:!bg-rose-500/10 hover:!border-rose-500/20 !text-rose-400 flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} !py-3`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-black/50 backdrop-blur-lg sticky top-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white/5 rounded-lg border border-white/10"
          >
            <Menu size={20} className="text-white" />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <img src="/logo-white.png" alt="Runlance" className="w-6 h-6 object-contain" />
            <span className="font-bold text-sm tracking-tight">Runlance</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          <div className="relative w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out">
            <BorderGlow
              borderRadius={32}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
            >
              <div className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Sign Out</h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  Are you sure you want to log out? You'll need to sign back in to access your personas.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => router.push('/')}
                    className="button2 w-full !py-3 !bg-red-600 !text-white border-none hover:!bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                  >
                    Yes, Sign Out
                  </button>
                  <button 
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="button2 w-full !py-3 !bg-transparent border border-white/10 hover:!bg-white/5 !text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      )}
    </div>
  );
}

