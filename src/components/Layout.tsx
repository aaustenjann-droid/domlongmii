import { ReactNode } from 'react';
import { FileText, PlusCircle, Settings as SettingsIcon, Package, Scale, RefreshCw } from 'lucide-react';
import { useStore } from '../store';

interface LayoutProps {
  children: ReactNode;
  currentView: 'dashboard' | 'create' | 'products' | 'view' | 'settings';
  onNavigate: (view: 'dashboard' | 'create' | 'products' | 'settings') => void;
}

export default function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const { settings, resetToSampleData } = useStore();

  const coreNavItems = [
    { id: 'dashboard', label: 'វិក្កយបត្រ (Invoices)', icon: FileText, viewKeys: ['dashboard', 'view'] },
    { id: 'create', label: 'បង្កើតវិក្កយបត្រថ្មី (New)', icon: PlusCircle, viewKeys: ['create'] },
    { id: 'products', label: 'គ្រប់គ្រងទំនិញ (Products)', icon: Package, viewKeys: ['products'] },
  ];

  const operationsNavItems = [
    { id: 'settings', label: 'ការកំណត់ (Settings)', icon: SettingsIcon, viewKeys: ['settings'] },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-khmer text-slate-900">
      {/* Desktop Dark SaaS Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0b0f19] text-slate-300 border-r border-slate-800/80 shrink-0 sticky top-0 h-screen z-40">
        {/* Brand / Logo */}
        <div 
          className="p-5 border-b border-slate-800/80 flex items-center gap-3 cursor-pointer hover:bg-slate-900/50 transition-colors"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold font-moul leading-snug text-white truncate" title={settings.companyNameKhmer}>
              {settings.companyNameKhmer || 'ដេប៉ូទិញដំឡូងមី'}
            </h1>
            <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider font-mono truncate">
              {settings.companyNameEnglish || 'CASSAVA WEIGHBRIDGE'}
            </p>
          </div>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Core Management */}
          <div className="space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              CORE MANAGEMENT
            </div>
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.viewKeys.includes(currentView);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Operations & Bot */}
          <div className="space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              OPERATIONS & BOT
            </div>
            {operationsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.viewKeys.includes(currentView);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer: Exchange Rate & User Info */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#070a12]">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-medium">Exchange Rate</span>
              <span className="font-mono text-xs font-bold text-white">
                1$ = {settings.exchangeRate.toLocaleString()}៛
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              {settings.sellerName ? settings.sellerName.substring(0, 2).toUpperCase() : 'CM'}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
            <span>Systems Live</span>
            <span className="text-emerald-400 font-bold">● v3.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold font-moul leading-snug text-slate-900 truncate max-w-[180px]">
              {settings.companyNameKhmer || 'ដេប៉ូទិញដំឡូងមី'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-right">
            <span className="font-mono text-[11px] font-bold text-slate-900">
              {settings.exchangeRate.toLocaleString()}៛
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 pb-28 md:pb-10 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 print:hidden z-40 shadow-lg px-1 pb-[env(safe-area-inset-bottom,0px)]">
        {[...coreNavItems, ...operationsNavItems].map((item) => {
          const Icon = item.icon;
          const isActive = item.viewKeys.includes(currentView);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id as any)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-colors cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-blue-600 font-bold border-t-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.id === 'dashboard' ? 'វិក្កយបត្រ' : item.id === 'create' ? 'បង្កើតថ្មី' : item.id === 'products' ? 'ទំនិញ' : 'ការកំណត់'}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
