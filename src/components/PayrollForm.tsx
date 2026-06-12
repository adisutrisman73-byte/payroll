import React, { useState, useEffect } from 'react';
import { VendorPreset, PayrollItem, WAConfig } from '../types';
import { TERMIN_OPTIONS, INDONESIAN_BANKS } from '../constants';
import { formatRupiah, parseWATemplate, generateWAUrl } from '../utils';
import { 
  Plus, 
  Trash2, 
  Send, 
  FileText, 
  Building, 
  User, 
  CreditCard, 
  DollarSign, 
  Layers,
  Settings,
  X,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCheck,
  History,
  Search,
  Edit3,
  CornerUpLeft,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayrollFormProps {
  vendors: VendorPreset[];
  history: PayrollItem[];
  draftItems: PayrollItem[];
  waConfig: WAConfig;
  onAddDraft: (item: Omit<PayrollItem, 'id' | 'dateCreated'>) => void;
  onRemoveDraft: (id: string) => void;
  onClearDraft: () => void;
  onSubmitDrafts: (items: PayrollItem[]) => void;
  onSetDrafts?: (items: PayrollItem[]) => void;
}

export default function PayrollForm({
  vendors,
  history = [],
  draftItems,
  waConfig,
  onAddDraft,
  onRemoveDraft,
  onClearDraft,
  onSubmitDrafts,
  onSetDrafts,
}: PayrollFormProps) {
  // Input fields state
  const [selectedPresetVendorId, setSelectedPresetVendorId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [term, setTerm] = useState(TERMIN_OPTIONS[0]);
  const [customTerm, setCustomTerm] = useState('');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('BCA');
  const [customBankName, setCustomBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankHolderName, setBankHolderName] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // States for importing history records
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  // States for bulk export/import panel
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkErrorMessage, setBulkErrorMessage] = useState('');

  // Autofill form inputs from selected active draft item
  const handleAutofillFromDraft = (item: PayrollItem) => {
    setProjectName(item.projectName);
    setVendorName(item.vendorName);
    
    if (TERMIN_OPTIONS.includes(item.term)) {
      setTerm(item.term);
      setCustomTerm('');
    } else {
      setTerm('Lain-lain / Custom');
      setCustomTerm(item.term);
    }
    
    setAmount(item.amount.toString());
    
    const standardBanks = INDONESIAN_BANKS.map(b => b.code.toUpperCase());
    const matchBank = item.bankName.toUpperCase();
    if (standardBanks.includes(matchBank)) {
      setBankName(matchBank);
      setCustomBankName('');
    } else {
      setBankName('OTHER');
      setCustomBankName(item.bankName);
    }
    
    setBankAccount(item.bankAccount || '');
    setBankHolderName(item.bankHolderName || '');
    setNotes(item.notes || '');
    
    setImportSuccessMessage(`BERHASIL MEMUAT DATA DRAF "${item.vendorName.toUpperCase()}" KE FORM INPUT!`);
    setTimeout(() => setImportSuccessMessage(''), 4000);
    
    // Smooth scroll to form top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duplicate an active draft item
  const handleDuplicateDraft = (item: PayrollItem) => {
    onAddDraft({
      projectName: item.projectName,
      vendorName: item.vendorName,
      term: item.term,
      amount: item.amount,
      bankName: item.bankName,
      bankAccount: item.bankAccount,
      bankHolderName: item.bankHolderName,
      status: 'Pending',
      notes: item.notes,
    });
    setImportSuccessMessage(`BERHASIL MENDUPLIKASI DRAF "${item.vendorName.toUpperCase()}"!`);
    setTimeout(() => setImportSuccessMessage(''), 4000);
  };

  // Suggested project names from existing draft or previous saves (can be loaded)
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([]);

  // Update suggestions or pull projects from localStorage
  useEffect(() => {
    try {
      const persisted = localStorage.getItem('payroll_history');
      if (persisted) {
        const historyData: PayrollItem[] = JSON.parse(persisted);
        const projects = Array.from(new Set(historyData.map(h => h.projectName))).slice(0, 5);
        setProjectSuggestions(projects);
      }
    } catch (e) {
      console.error(e);
    }
  }, [draftItems, history]);

  // When a preset vendor is selected, auto-populate the inputs!
  const handleVendorSelect = (vendorId: string) => {
    setSelectedPresetVendorId(vendorId);
    if (!vendorId) {
      setVendorName('');
      setBankName('BCA');
      setBankAccount('');
      setBankHolderName('');
      return;
    }
    const vendor = vendors.find((v) => v.id === vendorId);
    if (vendor) {
      setVendorName(vendor.name);
      setBankName(vendor.bankName);
      setBankAccount(vendor.bankAccount);
      setBankHolderName(vendor.accountHolder);
    }
  };

  // Autofill form inputs from selected history item
  const handleAutofillFromHistory = (item: PayrollItem) => {
    setProjectName(item.projectName);
    setVendorName(item.vendorName);
    
    if (TERMIN_OPTIONS.includes(item.term)) {
      setTerm(item.term);
      setCustomTerm('');
    } else {
      setTerm('Lain-lain / Custom');
      setCustomTerm(item.term);
    }
    
    setAmount(item.amount.toString());
    
    const standardBanks = INDONESIAN_BANKS.map(b => b.code.toUpperCase());
    const matchBank = item.bankName.toUpperCase();
    if (standardBanks.includes(matchBank)) {
      setBankName(matchBank);
      setCustomBankName('');
    } else {
      setBankName('OTHER');
      setCustomBankName(item.bankName);
    }
    
    setBankAccount(item.bankAccount || '');
    setBankHolderName(item.bankHolderName || '');
    setNotes(item.notes || '');
    
    setImportSuccessMessage(`BERHASIL MEMUAT DATA "${item.vendorName.toUpperCase()}" KE FORM INPUT!`);
    setTimeout(() => setImportSuccessMessage(''), 4000);
  };

  // Directly insert history item as a new active draft
  const handleDirectAddFromHistory = (item: PayrollItem) => {
    onAddDraft({
      projectName: item.projectName,
      vendorName: item.vendorName,
      term: item.term,
      amount: item.amount,
      bankName: item.bankName,
      bankAccount: item.bankAccount,
      bankHolderName: item.bankHolderName,
      status: 'Pending',
      notes: item.notes,
    });
    setImportSuccessMessage(`BERHASIL MENYALIN "${item.vendorName.toUpperCase()}" LANGSUNG KE DRAF AKTIF!`);
    setTimeout(() => setImportSuccessMessage(''), 4000);
  };

  const handleAddDraftItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Mohon masukkan nama project!');
      return;
    }
    if (!vendorName.trim()) {
      alert('Mohon masukkan atau pilih nama vendor!');
      return;
    }
    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Mohon masukkan jumlah pembayaran/gaji yang valid!');
      return;
    }
    if (!bankAccount.trim()) {
      alert('Mohon masukkan nomor rekening vendor!');
      return;
    }
    if (!bankHolderName.trim()) {
      alert('Mohon masukkan nama pemilik rekening!');
      return;
    }

    const finalTerm = term === 'Lain-lain / Custom' ? (customTerm || 'Termin Custom') : term;
    const finalBank = bankName === 'OTHER' ? (customBankName || 'Lainnya') : bankName;

    onAddDraft({
      projectName: projectName.trim(),
      vendorName: vendorName.trim(),
      term: finalTerm,
      amount: numAmount,
      bankName: finalBank,
      bankAccount: bankAccount.trim(),
      bankHolderName: bankHolderName.trim(),
      status: 'Pending',
      notes: notes.trim() || undefined,
    });

    // Keep project name but reset vendor-specific inputs for the next entry
    setSelectedPresetVendorId('');
    setVendorName('');
    setBankAccount('');
    setBankHolderName('');
    setAmount('');
    setNotes('');
    setCustomTerm('');
    setCustomBankName('');
  };

  // Derived state to filter past history based on quick search
  const filteredHistoryItems = history.filter((item) => {
    if (!historySearchQuery) return true;
    const query = historySearchQuery.toLowerCase();
    return (
      item.projectName.toLowerCase().includes(query) ||
      item.vendorName.toLowerCase().includes(query) ||
      item.term.toLowerCase().includes(query) ||
      (item.bankName && item.bankName.toLowerCase().includes(query))
    );
  }).slice(0, 10);

  const currentBatchTotal = draftItems.reduce((acc, item) => acc + item.amount, 0);
  const waPreviewText = parseWATemplate(waConfig.messageTemplate, draftItems);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(waPreviewText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleWAAndSave = () => {
    if (draftItems.length === 0) return;
    
    // Save drafts to main history state
    onSubmitDrafts(draftItems);

    // Generate WA URL and open in new tab
    const url = generateWAUrl(waConfig.phoneNumber, waPreviewText);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Mark as finished drafting
    onClearDraft();
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 4000);
  };

  // Quick fill project helper
  const selectProjectSuggestion = (proj: string) => {
    setProjectName(proj);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Input Gaji / Upah */}
      <div className="lg:col-span-7 bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 border-2 border-[#141414] bg-[#f2f2f0] flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#141414]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif italic text-gray-900">Form Penggajian Baru</h2>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">ISI FORMULIR SENSITIF BERIKUT SECARA TELITI</p>
            </div>
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {importSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-indigo-50 text-indigo-950 border-2 border-indigo-500 font-mono text-[10px] font-bold p-3 flex items-center gap-2 shadow-[2px_2px_0px_#4f46e5]"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                <span>{importSuccessMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAddDraftItem} className="space-y-4">
            {/* Importer dari Histori Terakhir */}
            <div className="bg-[#eef2ff] border-2 border-[#141414] p-4 relative space-y-3 shadow-[2px_2px_0px_#141414]">
              <label className="block text-[11px] font-bold font-mono tracking-wider text-indigo-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-extrabold text-[#4f46e5]">
                  <History className="w-4 h-4 text-[#4f46e5]" />
                  📥 IMPORT DARI HISTORI SEBELUMNYA
                </span>
                <span className="text-[9px] bg-indigo-700 text-white px-1.5 py-0.5 font-mono">FAST COPY</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-indigo-700" />
                </div>
                <input
                  type="text"
                  placeholder="Cari berdasarkan Project, Vendor, atau Termin..."
                  value={historySearchQuery}
                  onChange={(e) => {
                    setHistorySearchQuery(e.target.value);
                    setShowHistoryDropdown(true);
                  }}
                  onFocus={() => setShowHistoryDropdown(true)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] pl-9 pr-8 py-2 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5] text-gray-800"
                />
                {historySearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHistorySearchQuery('');
                      setShowHistoryDropdown(false);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions / Dropdown results */}
              {showHistoryDropdown && (
                <div className="relative">
                  <div className="absolute z-30 left-0 right-0 max-h-[220px] overflow-y-auto bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-1 space-y-1">
                    <div className="flex justify-between items-center px-2 py-1 border-b border-gray-150 bg-[#f8f9fa]">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider col-title">
                        Hasil Pencarian ({filteredHistoryItems.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHistoryDropdown(false)}
                        className="text-[9px] font-mono font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        TUTUP
                      </button>
                    </div>

                    {filteredHistoryItems.length === 0 ? (
                      <div className="text-center py-4 text-xs text-gray-500 font-mono">
                        Tidak ada histori yang cocok.
                      </div>
                    ) : (
                      filteredHistoryItems.map((item) => (
                        <div
                          key={`hist-opt-${item.id}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-indigo-50 border border-transparent hover:border-[#141414] transition-all gap-2 text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-extrabold uppercase bg-red-100 text-red-800 px-1 border border-red-200">
                                {item.projectName}
                              </span>
                              <span className="text-[10px] font-bold text-gray-800 truncate">
                                {item.vendorName}
                              </span>
                            </div>
                            <div className="text-[9px] font-mono text-gray-500 mt-1 uppercase flex items-center gap-1.5 flex-wrap">
                              <span>Termin: {item.term}</span>
                              <span>•</span>
                              <span>{item.bankName} - {item.bankAccount || '(No Rek)'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                            <span className="text-[10px] font-black font-mono text-gray-900 mr-2">
                              {formatRupiah(item.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleAutofillFromHistory(item);
                                setShowHistoryDropdown(false);
                              }}
                              className="bg-indigo-700 hover:bg-indigo-800 text-white text-[9px] font-bold font-mono px-2 py-1 border border-indigo-700 transition-all cursor-pointer uppercase"
                              title="Salin isi data ini ke form input"
                            >
                              Isi Form
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleDirectAddFromHistory(item);
                                setShowHistoryDropdown(false);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold font-mono px-2 py-1 border border-emerald-600 transition-all cursor-pointer uppercase"
                              title="Masukkan langsung ke draf aktif"
                            >
                              + Draf
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Informative quick items for rapid access */}
              {!historySearchQuery && history.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-indigo-950 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>⚡ CARI ATAU PILIH HISTORI CEPAT:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.slice(0, 4).map((item) => (
                      <div
                        key={`hist-quick-${item.id}`}
                        className="bg-white border-2 border-[#141414] p-2 hover:bg-indigo-50 hover:shadow-[1px_1px_0px_#141414] transition-all flex flex-col justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 justify-between flex-wrap">
                            <span className="text-[8px] font-extrabold uppercase bg-red-100 text-red-800 px-1 border border-red-200 truncate max-w-[80px]">
                              {item.projectName}
                            </span>
                            <span className="text-[9px] font-black font-mono text-gray-900">
                              {formatRupiah(item.amount)}
                            </span>
                          </div>
                          <div className="text-[10px] font-extrabold text-gray-800 mt-1 truncate">
                            {item.vendorName}
                          </div>
                          <div className="text-[9px] font-mono text-gray-500 truncate mt-0.5">
                            {item.term}
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-gray-150 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAutofillFromHistory(item)}
                            className="text-[9px] text-indigo-700 hover:underline font-mono font-bold cursor-pointer uppercase animate-none"
                          >
                            Isi Form
                          </button>
                          <span className="text-gray-300 text-[9px] font-mono">|</span>
                          <button
                            type="button"
                            onClick={() => handleDirectAddFromHistory(item)}
                            className="text-[9px] text-emerald-600 hover:underline font-mono font-bold cursor-pointer uppercase"
                          >
                            + Draf Aktif
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Preset database vendor */}
            {vendors.length > 0 && (
              <div className="bg-[#f2f2f0] border-2 border-[#141414] p-4 relative shadow-[2px_2px_0px_#141414]">
                <label className="block text-[11px] font-bold font-mono tracking-wider text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>🚀 PILIH DARI DATABASE VENDOR</span>
                  <span className="text-[9px] bg-[#141414] text-white px-1.5 py-0.5 font-mono">DATABASE</span>
                </label>
                <select
                  value={selectedPresetVendorId}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3 py-2.5 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5] cursor-pointer text-gray-800"
                >
                  <option value="">-- PILIH VENDOR YANG SUDAH TERDAFTAR --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name.toUpperCase()} ({v.bankName} - {v.bankAccount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nama Project */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#141414]" />
                NAMA PROJECT / PEKERJAAN *
              </label>
              <input
                type="text"
                placeholder="Contoh: Pembangunan Ruko - Serpong"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="brutalist-input"
                required
              />
              {projectSuggestions.length > 0 && !projectName && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-500 font-bold self-center mr-1 font-mono">REKOMENDASI:</span>
                  {projectSuggestions.map((proj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectProjectSuggestion(proj)}
                      className="text-[10px] font-mono bg-white border border-[#141414] hover:bg-gray-100 text-gray-600 px-2 py-0.5 transition-all text-left truncate max-w-[150px]"
                    >
                      {proj}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Vendor / Penerima */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#141414]" />
                  NAMA VENDOR / PEKERJA *
                </label>
                <input
                  type="text"
                  placeholder="Nama individu atau perusahaan"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="brutalist-input"
                  required
                />
              </div>

              {/* Termin Ke */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#141414]" />
                  TERMIN PEMBAYARAN *
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2.5 focus:outline-hidden text-gray-850"
                >
                  {TERMIN_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {term === 'Lain-lain / Custom' && (
                  <input
                    type="text"
                    placeholder="Masukkan termin manual"
                    value={customTerm}
                    onChange={(e) => setCustomTerm(e.target.value)}
                    className="w-full text-xs font-mono bg-white border-2 border-[#141414] mt-2 px-3 py-2"
                    required
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilihan Bank */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#141414]" />
                  PILIH BANK REKENING *
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2.5 focus:outline-hidden text-gray-850"
                >
                  {INDONESIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {bankName === 'OTHER' && (
                  <input
                    type="text"
                    placeholder="Masukkan nama bank manual"
                    value={customBankName}
                    onChange={(e) => setCustomBankName(e.target.value)}
                    className="w-full text-xs font-mono bg-white border-2 border-[#141414] mt-2 px-3 py-2"
                    required
                  />
                )}
              </div>

              {/* Nomor Rekening */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#141414]" />
                  NOMOR REKENING *
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor rekening"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  className="brutalist-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Pemilik Rekening */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#141414]" />
                  NAMA PEMILIK REKENING *
                </label>
                <input
                  type="text"
                  placeholder="Harus sesuai sistem / buku tabungan"
                  value={bankHolderName}
                  onChange={(e) => setBankHolderName(e.target.value)}
                  className="brutalist-input"
                  required
                />
              </div>

              {/* Jumlah Upah / Gaji */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#141414]" />
                  JUMLAH UPAH / GAJI (RUPIAH) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-[#141414]">Rp</span>
                  <input
                    type="text"
                    placeholder="Contoh: 15.500.000"
                    value={amount ? parseInt(amount.replace(/\D/g, '')).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setAmount(clean);
                    }}
                    className="w-full text-sm bg-white border-2 border-[#141414] pl-10 pr-3.5 py-2.5 font-bold font-mono text-gray-900 focus:outline-hidden focus:shadow-[3px_3px_0px_#4f46e5]"
                    required
                  />
                </div>
                {amount && (
                  <p className="text-[10px] text-indigo-700 mt-1 font-bold font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    BACAAN: {formatRupiah(parseInt(amount))}
                  </p>
                )}
              </div>
            </div>

            {/* Catatan / Keterangan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">KETERANGAN / CATATAN TAMBAHAN (OPSIONAL)</label>
              <textarea
                placeholder="Contoh: Include PPN 11% / Potongan pinjaman kasbon Rp 500.000"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2 focus:outline-hidden focus:shadow-[3px_3px_0px_#4f46e5]"
              />
            </div>

            <button
              id="btn-add-draft"
              type="submit"
              className="w-full flex items-center justify-center gap-2 brutalist-button-primary py-3.5 px-4 cursor-pointer"
            >
              <Plus className="w-5 h-5 text-[#25D366]" />
              Tambahkan Ke Draf Pengajuan
            </button>
          </form>
        </div>

        {/* Informasi Bantuan Penggunaan */}
        <div className="mt-6 border-t-2 border-[#141414] pt-4 text-xxs font-mono text-gray-500">
          💡 TIPS: HUBUNGKAN TAB <strong className="text-gray-900 font-bold">"DATABASE VENDOR"</strong> UNTUK MENYIMPAN REKENING LANGGANAN AGAR TIDAK PERLU MENGETIK ULANG SETIAP ACARA PAYROLL.
        </div>
      </div>

      {/* Kolom Kanan: Draf Aktif & Preview WhatsApp */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Keranjang Draf Aktif */}
        <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <div>
              <h3 className="font-extrabold font-serif text-gray-900 text-lg flex items-center gap-1.5">
                Draf Aktif
                <span className="bg-[#141414] text-white text-[10px] px-2.5 py-0.5 font-mono">
                  {draftItems.length}
                </span>
              </h3>
              <p className="text-[11px] text-gray-500 font-mono">ITEM SIAP SUBMIT ATAU KIRIM WA.</p>
            </div>
            {draftItems.length > 0 && (
              <button
                type="button"
                onClick={onClearDraft}
                className="text-xxs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-white border border-red-600 px-2.5 py-1 transition-all cursor-pointer"
              >
                Hapus Semua
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {draftItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 border-2 border-dashed border-gray-300 bg-gray-50"
                >
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-[11px] font-mono text-gray-500 px-4">Draf kosong. Masukkan data di form sebelah kiri untuk memulai kompilasi batch.</p>
                </motion.div>
              ) : (
                draftItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 bg-gray-50 border-2 border-[#141414] relative transition-all"
                  >
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-gray-50 pl-2">
                      <button
                        onClick={() => handleAutofillFromDraft(item)}
                        className="text-indigo-600 hover:text-white border border-indigo-600 hover:bg-indigo-600 transition-all p-1 cursor-pointer bg-white"
                        title="Edit / Salin isi draf ini ke Form input"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateDraft(item)}
                        className="text-emerald-600 hover:text-white border border-emerald-600 hover:bg-emerald-600 transition-all p-1 cursor-pointer bg-white"
                        title="Duplikat draf ini langsung"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveDraft(item.id)}
                        className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 transition-all p-1 cursor-pointer bg-white"
                        title="Hapus draf ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] font-bold font-mono text-[#4f46e5] truncate max-w-[65%] uppercase">{item.projectName}</div>
                    <div className="font-extrabold text-[#141414] mt-0.5 text-sm">{item.vendorName}</div>
                    <div className="text-xxs text-gray-600 font-mono mt-1">
                      {item.term} • {item.bankName} - {item.bankAccount} ({item.bankHolderName})
                    </div>
                    {item.notes && (
                      <div className="text-[11px] italic text-gray-500 mt-1 truncate border-t border-gray-200 pt-1">
                        Catatan: {item.notes}
                      </div>
                    )}
                    {item.amount === 0 && (
                      <div className="mt-2 bg-amber-100 border-2 border-amber-500 text-amber-900 font-bold font-mono text-[10px] p-2 leading-normal">
                        ⚠️ RP 0 (MASUKKAN NOMINAL)
                        <div className="font-normal text-[9px] text-amber-800 mt-1">
                          Silakan hapus draf ini, isi nominal yang benar di form kiri, dan masukkan kembali ke draf.
                        </div>
                      </div>
                    )}
                    <div className="text-right font-black font-mono text-[#141414] mt-2 text-sm">
                      {formatRupiah(item.amount)}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Panel Ekspor/Impor Batch */}
          <div className="mt-4 pt-3 border-t-2 border-[#141414]">
            <button
              type="button"
              onClick={() => {
                setShowBulkPanel(!showBulkPanel);
                // Pre-populate with current draft JSON when opened
                if (!showBulkPanel) {
                  setBulkInputText(JSON.stringify(draftItems.map(({ id, dateCreated, ...rest }) => rest), null, 2));
                }
              }}
              className="text-xxs font-mono font-bold text-indigo-700 hover:underline uppercase flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ⚙️ EKSPOR / IMPOR BATCH JSON DRAF ({draftItems.length} ITEM)
            </button>

            {showBulkPanel && (
              <div className="mt-3 bg-[#eef2ff] border-2 border-[#141414] p-4 space-y-3 font-mono text-xs shadow-[2px_2px_0px_#141414]">
                <p className="text-[10px] text-indigo-950 leading-normal font-bold">
                  Kopi format JSON draf siap kirim di bawah ini untuk disimpan / dibagikan. Atau, Anda dapat menempel (paste) kode draf lama Anda di kotak ini untuk diimpor kembali ke Draf Baru.
                </p>
                <textarea
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  placeholder="[{ 'projectName': '...', 'vendorName': '...', 'amount': 100000 }, ...]"
                  rows={4}
                  className="w-full text-[10px] font-mono bg-white p-2 border-2 border-[#141414] focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
                />
                
                {bulkErrorMessage && (
                  <div className="text-red-500 text-xxs font-bold uppercase">⚠️ {bulkErrorMessage}</div>
                )}

                <div className="flex gap-2 justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          if (!bulkInputText.trim()) {
                            setBulkErrorMessage('Kotak input kosong.');
                            return;
                          }
                          const items = JSON.parse(bulkInputText);
                          if (!Array.isArray(items)) {
                            throw new Error('Data harus berupa array objek data draf.');
                          }
                          
                          // Convert/sanitize to draft items
                          const sanitized: PayrollItem[] = items.map((item: any, index: number) => ({
                            id: `p_${Date.now()}_index_${index}_${Math.floor(Math.random() * 1000)}`,
                            projectName: String(item.projectName || 'Project Tanpa Nama'),
                            vendorName: String(item.vendorName || 'Vendor Tanpa Nama'),
                            term: String(item.term || 'Termin 1'),
                            amount: typeof item.amount === 'number' ? item.amount : Number(String(item.amount || '0').replace(/\D/g, '')) || 0,
                            bankName: String(item.bankName || 'BCA'),
                            bankAccount: String(item.bankAccount || ''),
                            bankHolderName: String(item.bankHolderName || ''),
                            notes: String(item.notes || ''),
                            status: 'Pending',
                            dateCreated: new Date().toISOString(),
                          }));

                          if (onSetDrafts) {
                            onSetDrafts([...draftItems, ...sanitized]);
                            setImportSuccessMessage(`BERHASIL MENGIMPOR ${sanitized.length} DRAF SIAP KIRIM SECARA BATCH!`);
                            setTimeout(() => setImportSuccessMessage(''), 4000);
                            setBulkErrorMessage('');
                            setShowBulkPanel(false);
                          } else {
                            // Fallback
                            sanitized.forEach(it => onAddDraft(it));
                            setImportSuccessMessage(`BERHASIL MENAMBAHKAN ${sanitized.length} DRAF!`);
                            setTimeout(() => setImportSuccessMessage(''), 4000);
                            setBulkErrorMessage('');
                            setShowBulkPanel(false);
                          }
                        } catch (err: any) {
                          setBulkErrorMessage(`Format salah: ${err.message}`);
                        }
                      }}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[9px] px-2.5 py-1.5 cursor-pointer uppercase border border-[#141414] transition-all"
                    >
                      Masukkan ke Draf Aktif
                    </button>
                    {draftItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(bulkInputText);
                          setImportSuccessMessage('JSON DRAF BERHASIL DISALIN KE CLIPBOARD!');
                          setTimeout(() => setImportSuccessMessage(''), 4000);
                        }}
                        className="bg-white hover:bg-gray-100 text-[#141414] font-bold text-[9px] px-2.5 py-1.5 cursor-pointer uppercase border border-[#141414] transition-all"
                      >
                        Salin JSON
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkPanel(false)}
                    className="text-gray-500 hover:text-black font-semibold uppercase text-[9px] font-mono cursor-pointer self-center"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {draftItems.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-[#141414] flex justify-between items-center bg-[#f2f2f0] -mx-6 -mb-6 p-6">
              <div>
                <div className="text-[9px] text-gray-500 font-black font-mono uppercase tracking-wider">TOTAL BATCH PAYROLL</div>
                <div className="text-xl font-extrabold font-mono text-[#141414]">{formatRupiah(currentBatchTotal)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Pesan WhatsApp */}
        {draftItems.length > 0 && (
          <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold font-serif text-gray-900 text-sm flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#25D366]" />
                  Pratinjau Pesan WA
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1 text-[10px] font-mono bg-white border border-[#141414] hover:bg-gray-100 text-gray-700 font-bold px-2 py-1 transition-all cursor-pointer"
                    title="Salin Teks"
                  >
                    {copiedToClipboard ? (
                      <>
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">TERSALIN</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>SALIN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Box Teks Script Format */}
              <div className="bg-[#141414] text-emerald-400 p-4 font-mono text-xs overflow-y-auto max-h-[320px] whitespace-pre-wrap leading-relaxed border-2 border-[#141414]">
                {waPreviewText}
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>TUJUAN WA: <strong className="text-black font-extrabold">{waConfig.phoneNumber || 'Ketik di tab pengaturan'}</strong></span>
              </div>
            </div>

            <div className="mt-5">
              <button
                id="btn-submit-wa"
                onClick={handleWAAndSave}
                className="w-full flex items-center justify-center gap-2.5 brutalist-button-wa py-4 px-5 cursor-pointer"
              >
                <Send className="w-5 h-5 text-white" />
                Submit & Kirim ke WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Feedbacks setelah kirim */}
        {whatsappSent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border-2 border-emerald-500 text-xs text-emerald-900 font-bold font-mono text-center"
          >
            🎉 BERHASIL DISUBMIT! DRAF TELAH DIKOSONGKAN DAN DIMASUKKAN KE HISTORI TRANSAKSI.
          </motion.div>
        )}
      </div>
    </div>
  );
}
