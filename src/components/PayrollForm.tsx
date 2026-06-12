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
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayrollFormProps {
  vendors: VendorPreset[];
  draftItems: PayrollItem[];
  waConfig: WAConfig;
  onAddDraft: (item: Omit<PayrollItem, 'id' | 'dateCreated'>) => void;
  onRemoveDraft: (id: string) => void;
  onClearDraft: () => void;
  onSubmitDrafts: (items: PayrollItem[]) => void;
}

export default function PayrollForm({
  vendors,
  draftItems,
  waConfig,
  onAddDraft,
  onRemoveDraft,
  onClearDraft,
  onSubmitDrafts,
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

  // Suggested project names from existing draft or previous saves (can be loaded)
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([]);

  // Update suggestions or pull projects from localStorage
  useEffect(() => {
    try {
      const persisted = localStorage.getItem('payroll_history');
      if (persisted) {
        const history: PayrollItem[] = JSON.parse(persisted);
        const projects = Array.from(new Set(history.map(h => h.projectName))).slice(0, 5);
        setProjectSuggestions(projects);
      }
    } catch (e) {
      console.error(e);
    }
  }, [draftItems]);

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

          <form onSubmit={handleAddDraftItem} className="space-y-4">
            {/* Quick Preset database vendor */}
            {vendors.length > 0 && (
              <div className="bg-[#f2f2f0] border-2 border-[#141414] p-4 relative">
                <label className="block text-[11px] font-bold font-mono tracking-wider text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>🚀 PILIH DARI DATABASE VENDOR</span>
                  <span className="text-[9px] bg-[#141414] text-white px-1.5 py-0.5 font-mono">HOTKEY</span>
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
                    <button
                      onClick={() => onRemoveDraft(item.id)}
                      className="absolute right-3 top-3 text-red-600 hover:text-white border border-red-600 hover:bg-red-600 transition-all p-1 cursor-pointer"
                      title="Hapus draf ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] font-bold font-mono text-[#4f46e5] truncate max-w-[80%] uppercase">{item.projectName}</div>
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
