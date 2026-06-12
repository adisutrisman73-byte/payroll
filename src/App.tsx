import React, { useState, useEffect } from 'react';
import { VendorPreset, PayrollItem, WAConfig } from './types';
import { INITIAL_VENDORS, INITIAL_PAYROLLS, INITIAL_DRAFTS, DEFAULT_WA_TEMPLATE } from './constants';
import VendorManager from './components/VendorManager';
import PayrollForm from './components/PayrollForm';
import PayrollList from './components/PayrollList';
import TemplateSettings from './components/TemplateSettings';
import { 
  PlusCircle, 
  History, 
  Users, 
  Settings2, 
  CreditCard, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'vendors' | 'settings'>('form');

  // Core App states load from local storage or constants
  const [vendors, setVendors] = useState<VendorPreset[]>([]);
  const [history, setHistory] = useState<PayrollItem[]>([]);
  const [draftItems, setDraftItems] = useState<PayrollItem[]>([]);
  const [waConfig, setWaConfig] = useState<WAConfig>({
    phoneNumber: '',
    messageTemplate: DEFAULT_WA_TEMPLATE,
  });

  // Load state on mount with forced seeding version check
  useEffect(() => {
    try {
      const seededVersion = localStorage.getItem('payroll_seeded_v4');
      if (seededVersion !== 'true') {
        setVendors(INITIAL_VENDORS);
        setHistory(INITIAL_PAYROLLS);
        setDraftItems(INITIAL_DRAFTS);
        
        localStorage.setItem('payroll_vendors', JSON.stringify(INITIAL_VENDORS));
        localStorage.setItem('payroll_history', JSON.stringify(INITIAL_PAYROLLS));
        localStorage.setItem('payroll_drafts', JSON.stringify(INITIAL_DRAFTS));
        localStorage.setItem('payroll_seeded_v4', 'true');
        
        const savedWa = localStorage.getItem('payroll_wa_config');
        if (savedWa) {
          setWaConfig(JSON.parse(savedWa));
        } else {
          const defaultWa = { phoneNumber: '', messageTemplate: DEFAULT_WA_TEMPLATE };
          setWaConfig(defaultWa);
          localStorage.setItem('payroll_wa_config', JSON.stringify(defaultWa));
        }
      } else {
        const savedVendors = localStorage.getItem('payroll_vendors');
        if (savedVendors) {
          setVendors(JSON.parse(savedVendors));
        } else {
          setVendors(INITIAL_VENDORS);
          localStorage.setItem('payroll_vendors', JSON.stringify(INITIAL_VENDORS));
        }

        const savedHistory = localStorage.getItem('payroll_history');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        } else {
          setHistory(INITIAL_PAYROLLS);
          localStorage.setItem('payroll_history', JSON.stringify(INITIAL_PAYROLLS));
        }

        const savedDrafts = localStorage.getItem('payroll_drafts');
        if (savedDrafts) {
          setDraftItems(JSON.parse(savedDrafts));
        } else {
          setDraftItems(INITIAL_DRAFTS);
          localStorage.setItem('payroll_drafts', JSON.stringify(INITIAL_DRAFTS));
        }

        const savedWa = localStorage.getItem('payroll_wa_config');
        if (savedWa) {
          setWaConfig(JSON.parse(savedWa));
        } else {
          const defaultWa = { phoneNumber: '', messageTemplate: DEFAULT_WA_TEMPLATE };
          setWaConfig(defaultWa);
          localStorage.setItem('payroll_wa_config', JSON.stringify(defaultWa));
        }
      }
    } catch (e) {
      console.error('Failed to load application state from localStorage', e);
    }
  }, []);

  // Save updates helper
  const updateVendors = (newVendors: VendorPreset[]) => {
    setVendors(newVendors);
    localStorage.setItem('payroll_vendors', JSON.stringify(newVendors));
  };

  const updateHistory = (newHistory: PayrollItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('payroll_history', JSON.stringify(newHistory));
  };

  const updateDrafts = (newDrafts: PayrollItem[]) => {
    setDraftItems(newDrafts);
    localStorage.setItem('payroll_drafts', JSON.stringify(newDrafts));
  };

  // Vendor Action Handlers
  const handleAddVendor = (vendor: Omit<VendorPreset, 'id'>) => {
    const newVendor: VendorPreset = {
      ...vendor,
      id: `v_${Date.now()}`,
    };
    const updated = [...vendors, newVendor];
    updateVendors(updated);
  };

  const handleEditVendor = (updatedVendor: VendorPreset) => {
    const updated = vendors.map((v) => (v.id === updatedVendor.id ? updatedVendor : v));
    updateVendors(updated);
  };

  const handleDeleteVendor = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    updateVendors(updated);
  };

  // Payroll Action Handlers
  const handleAddDraft = (item: Omit<PayrollItem, 'id' | 'dateCreated'>) => {
    const newItem: PayrollItem = {
      ...item,
      id: `p_${Date.now()}`,
      dateCreated: new Date().toISOString(),
    };
    const updated = [...draftItems, newItem];
    updateDrafts(updated);
  };

  const handleRemoveDraft = (id: string) => {
    const updated = draftItems.filter((item) => item.id !== id);
    updateDrafts(updated);
  };

  const handleClearDraft = () => {
    updateDrafts([]);
  };

  const handleSubmitDrafts = (itemsToSubmit: PayrollItem[]) => {
    // Add all drafted items to global history
    const submittedItems = itemsToSubmit.map((item) => ({
      ...item,
      dateCreated: new Date().toISOString(), // reset timestamp of submission
    }));
    const updatedHistory = [...submittedItems, ...history];
    updateHistory(updatedHistory);
  };

  // History Action Handlers
  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Selesai Dibayar') => {
    const updated = history.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    updateHistory(updated);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    updateHistory(updated);
  };

  const handleClearHistory = () => {
    updateHistory([]);
  };

  const handleRestoreToDraft = (item: PayrollItem) => {
    const newItem: PayrollItem = {
      ...item,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: 'Pending',
      dateCreated: new Date().toISOString(),
    };
    const updated = [...draftItems, newItem];
    updateDrafts(updated);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#141414] font-sans print:bg-white antialiased flex flex-col">
      {/* Navigation Top Header */}
      <nav className="bg-white border-b-2 border-[#141414] sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#141414] bg-[#141414] flex items-center justify-center text-white">
                <CreditCard className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#141414] block">
                  Daftar Penggajian Vendor
                </span>
                <span className="text-[10px] bg-[#25D366]/10 text-emerald-850 px-2 py-0.5 border border-[#141414] font-mono font-bold inline-flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></span>
                  WA AUTOMATOR ACTIVE
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex gap-2 text-xs">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2.5 font-bold uppercase tracking-wider border-2 border-[#141414] transition-all cursor-pointer ${
                  activeTab === 'form' 
                    ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                Form Pengisian
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 font-bold uppercase tracking-wider border-2 border-[#141414] transition-all cursor-pointer ${
                  activeTab === 'history' 
                    ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                Histori & Rekap
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-4 py-2.5 font-bold uppercase tracking-wider border-2 border-[#141414] transition-all cursor-pointer ${
                  activeTab === 'vendors' 
                    ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                Database Vendor
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 font-bold uppercase tracking-wider border-2 border-[#141414] transition-all cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                Template WA
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner Area */}
      <header className="bg-[#f2f2f0] border-b-2 border-[#141414] text-[#141414] py-8 px-4 ps-6 pb-10 relative overflow-hidden print:hidden">
        {/* Background grid accent */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white border border-[#141414] px-3 py-1 font-mono text-[10px] font-bold uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                <span>OTOMASI PAYROLL VENDOR</span>
              </div>
              <h1 className="text-3xl sm:text-4xl tracking-tight leading-none text-[#141414] font-serif italic font-extrabold">
                Vendor Payroll Automator
              </h1>
              <p className="mt-2 text-gray-600 max-w-2xl text-xs md:text-sm leading-relaxed font-medium">
                Tulis nama proyek, isi nominal, pilih rekening bank vendor terdaftar, lalu kumpulkan beberapa transaksi sekaligus untuk disubmit langsung ke WhatsApp keuangan grup secara rapi dan instan!
              </p>
            </div>
            
            {/* Quick status card widget */}
            <div className="bg-white border-2 border-[#141414] p-4 max-w-xs w-full shadow-[4px_4px_0px_#141414]">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                <span>REKAPITULASI BATCH</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] border border-[#141414]"></span>
              </div>
              <div className="mt-2 text-sm sm:text-base font-extrabold font-serif text-[#141414]">
                {draftItems.length > 0 ? (
                  <span className="flex items-center gap-1.5 text-indigo-750">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-300" />
                    {draftItems.length} DRAF SIAP KIRIM
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 font-mono">Draf Pengajuan Kosong</span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-1.5 pt-1.5 border-t border-gray-200">
                DATABASE: {vendors.length} VENDOR | {history.length} HISTORI
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Navigation Tabs on Mobile Device (Carousel/Select Button list style) */}
        <div className="flex sm:hidden overflow-x-auto pb-4 gap-2 mb-6 scrollbar-none print:hidden -mx-4 px-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-2 border-[#141414] font-bold text-xxs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === 'form' 
                ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                : 'bg-white text-[#141414]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Form Pengisian
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-2 border-[#141414] font-bold text-xxs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                : 'bg-white text-[#141414]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Histori & Rekap
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-2 border-[#141414] font-bold text-xxs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === 'vendors' 
                ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                : 'bg-white text-[#141414]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Master Vendor
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-2 border-[#141414] font-bold text-xxs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-[#141414] text-white shadow-[2px_2px_0px_#4f46e5]' 
                : 'bg-white text-[#141414]'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Template WA
          </button>
        </div>

        {/* Dynamic Panel Content with Animation */}
        <div className="mb-10">
          {activeTab === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PayrollForm
                vendors={vendors}
                draftItems={draftItems}
                waConfig={waConfig}
                onAddDraft={handleAddDraft}
                onRemoveDraft={handleRemoveDraft}
                onClearDraft={handleClearDraft}
                onSubmitDrafts={handleSubmitDrafts}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PayrollList
                history={history}
                waConfig={waConfig}
                onUpdateStatus={handleUpdateStatus}
                onDeleteItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
                onRestoreToDraft={handleRestoreToDraft}
                onSwitchTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'vendors' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VendorManager
                vendors={vendors}
                onAddVendor={handleAddVendor}
                onEditVendor={handleEditVendor}
                onDeleteVendor={handleDeleteVendor}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateSettings
                waConfig={waConfig}
                onSaveConfig={(newConfig) => {
                  setWaConfig(newConfig);
                  localStorage.setItem('payroll_wa_config', JSON.stringify(newConfig));
                }}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Styled Footer */}
      <footer className="bg-white border-t-2 border-[#141414] py-8 text-center text-xs text-gray-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold">© 2026 Aplikasi Otomatisasi Payroll Vendor. All Rights Reserved.</p>
          <p className="mt-1 font-mono text-[10px] text-gray-400">THEME_HIGH_DENSITY_SWISS_EDITION v1.0.0</p>
        </div>
      </footer>
    </div>
  );
}
