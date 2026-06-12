import React, { useState } from 'react';
import { PayrollItem, WAConfig } from '../types';
import { formatRupiah, formatDate, parseWATemplate, generateWAUrl } from '../utils';
import { 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Printer, 
  Send, 
  TrendingUp, 
  AlertCircle, 
  Download, 
  RefreshCw,
  Eye,
  X,
  CornerUpLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayrollListProps {
  history: PayrollItem[];
  waConfig: WAConfig;
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'Selesai Dibayar') => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onRestoreToDraft: (item: PayrollItem) => void;
  onSwitchTab?: (tab: 'form' | 'history' | 'vendors' | 'settings') => void;
}

export default function PayrollList({
  history,
  waConfig,
  onUpdateStatus,
  onDeleteItem,
  onClearHistory,
  onRestoreToDraft,
  onSwitchTab,
}: PayrollListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Selesai Dibayar'>('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [selectedItemForSlip, setSelectedItemForSlip] = useState<PayrollItem | null>(null);
  const [restoredMessage, setRestoredMessage] = useState('');

  // Derive unique projects for filters
  const uniqueProjects = Array.from(new Set(history.map((h) => h.projectName)));

  // Filter lists
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bankAccount.includes(searchTerm) ||
      item.bankHolderName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesProject = projectFilter === 'ALL' || item.projectName === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  // Calculate statistics
  const totalAmountSubmitted = history.reduce((acc, item) => acc + item.amount, 0);
  const totalPaid = history
    .filter((item) => item.status === 'Selesai Dibayar')
    .reduce((acc, item) => acc + item.amount, 0);
  const totalPending = history
    .filter((item) => item.status === 'Pending')
    .reduce((acc, item) => acc + item.amount, 0);

  // Single resend to wa helper
  const handleResendSingle = (item: PayrollItem) => {
    const singleText = `*DAFTAR PENGAJUAN PENGGAYAN VENDOR (RESUBMIT)* 📋
Hari/Tanggal: ${formatDate(new Date().toISOString(), false)}

Halo Keuangan, mohon bantuan untuk memproses transfer upah/gaji berikut:

1. *Proyek:* ${item.projectName}
   *Vendor:* ${item.vendorName}
   *Termin:* ${item.term}
   *Gaji/Upah:* ${formatRupiah(item.amount)}
   *Bank:* ${item.bankName}
   *No Rekening:* ${item.bankAccount}
   *A.N:* ${item.bankHolderName}${item.notes ? `\n   *Catatan:* ${item.notes}` : ''}

Mohon dapat segera diproses transfer. Terima kasih 🙏`;
    
    const url = generateWAUrl(waConfig.phoneNumber, singleText);
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  const triggerPrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Kolom Informasi Ringkas (Summary Stats Card Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Pengajuan */}
        <div className="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-1">TOTAL PENGAJUAN</div>
            <div className="text-2xl font-black font-mono text-[#141414]">{formatRupiah(totalAmountSubmitted)}</div>
            <div className="text-[11px] font-mono text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Dari total {history.length} transaksi
            </div>
          </div>
          <div className="w-12 h-12 bg-[#f2f2f0] border-2 border-[#141414] text-[#141414] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Sudah Dibayar */}
        <div className="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#25D366] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-1">TELAH DIBAYAR</div>
            <div className="text-2xl font-black font-mono text-emerald-700">{formatRupiah(totalPaid)}</div>
            <div className="text-[11px] font-mono text-gray-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
              {history.filter((h) => h.status === 'Selesai Dibayar').length} transaksi lunas
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Masih Terhutang (Pending) */}
        <div className="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#4f46e5] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-1">MENUNGGU TRANSFER</div>
            <div className="text-2xl font-black font-mono text-indigo-700">{formatRupiah(totalPending)}</div>
            <div className="text-[11px] font-mono text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              {history.filter((h) => h.status === 'Pending').length} pending transfer
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-50 border-2 border-indigo-500 text-indigo-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Banner / Feedback restore */}
      <AnimatePresence>
        {restoredMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 text-emerald-950 border-2 border-emerald-500 font-mono text-xs font-bold uppercase p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[4px_4px_0px_#25D366]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{restoredMessage}</span>
            </div>
            {onSwitchTab && (
              <button
                onClick={() => onSwitchTab('form')}
                className="bg-[#141414] text-white px-3.5 py-1.5 hover:bg-gray-900 transition-all font-bold tracking-wider text-[10px] uppercase cursor-pointer shrink-0 border border-[#141414]"
              >
                LIHAT DRAF AKTIF ➜
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Area Filter Pencarian */}
      <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              placeholder="Cari histori berdasarkan nama vendor, nomor rekening, pemilik tabungan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-mono bg-white border-2 border-[#141414] pl-10 pr-4 py-2.5 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="font-bold font-mono text-xs border-2 border-[#141414] px-3 py-2 bg-white text-gray-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">SEMUA STATUS</option>
              <option value="Pending">PENDING (BELUM DIBAYAR)</option>
              <option value="Selesai Dibayar">LUNAS (SUDAH DIBAYAR)</option>
            </select>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="font-bold font-mono text-xs border-2 border-[#141414] px-3 py-2 bg-white text-gray-800 max-w-[200px] focus:outline-hidden cursor-pointer truncate"
            >
              <option value="ALL">SEMUA PROYEK</option>
              {uniqueProjects.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Print Action */}
            {history.length > 0 && (
              <button
                onClick={triggerPrintReport}
                className="flex items-center gap-1.5 text-xs font-bold font-mono bg-white border-2 border-[#141414] text-gray-800 px-3 py-2 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                CETAK
              </button>
            )}

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat data transaksi penggajian?')) {
                    onClearHistory();
                  }
                }}
                className="text-xs font-bold font-mono bg-white border-2 border-red-650 text-red-600 px-3 py-2 hover:bg-red-50 transition-all cursor-pointer"
              >
                CLEAR ALL
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Histori Utama */}
      <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f2f0] border-b-2 border-[#141414] text-gray-800 text-xs font-bold uppercase tracking-wider font-mono">
                <th className="px-6 py-4 border-r border-[#141414]">Tanggal Pengajuan</th>
                <th className="px-6 py-4 border-r border-[#141414]">Project / Termin</th>
                <th className="px-6 py-4 border-r border-[#141414]">Nama Vendor</th>
                <th className="px-6 py-4 border-r border-[#141414]">Detail Rekening</th>
                <th className="px-6 py-4 border-r border-[#141414]">Upah / Gaji</th>
                <th className="px-6 py-4 border-r border-[#141414]">Realisasi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#141414] text-xs">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-mono">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    TIDAK ADA DATA TRANSAKSI DALAM DATABASE HISTORI.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500 border-r border-gray-200">
                      {formatDate(item.dateCreated, true)}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="font-extrabold text-gray-900 truncate max-w-[200px]" title={item.projectName}>
                        {item.projectName.toUpperCase()}
                      </div>
                      <div className="text-[10px] font-bold font-mono text-gray-400 mt-0.5">{item.term}</div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="font-extrabold text-gray-900">{item.vendorName.toUpperCase()}</div>
                      {item.notes && (
                        <div className="text-[10px] italic text-gray-500 font-mono mt-0.5 truncate max-w-[150px]">
                          Ket: {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="font-bold text-gray-900 font-mono">
                        <span className="bg-[#141414] text-white px-1.5 py-0.5 mr-1.5 text-[9px] font-mono uppercase">
                          {item.bankName}
                        </span>
                        {item.bankAccount}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">A.N: {item.bankHolderName.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 font-black font-mono text-gray-950 border-r border-gray-200">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <button
                        onClick={() => {
                          const next = item.status === 'Pending' ? 'Selesai Dibayar' : 'Pending';
                          onUpdateStatus(item.id, next);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#141414] text-[10px] font-bold font-mono cursor-pointer select-none transition-all ${
                          item.status === 'Selesai Dibayar'
                            ? 'bg-emerald-100 text-emerald-800 shadow-[1px_1px_0px_#141414]'
                            : 'bg-amber-100 text-amber-800 shadow-[1px_1px_0px_#141414]'
                        }`}
                        title="Klik untuk mengubah status realisasi"
                      >
                        {item.status === 'Selesai Dibayar' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            LUNAS
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            PENDING
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedItemForSlip(item)}
                          className="bg-white border border-[#141414] hover:bg-gray-100 text-[#141414] p-1.5 transition-colors cursor-pointer"
                          title="Lihat Slip Gaji"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResendSingle(item)}
                          className="bg-white border border-[#141414] hover:bg-emerald-50 text-emerald-700 p-1.5 transition-colors cursor-pointer"
                          title="Kirim ulang WA"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onRestoreToDraft(item);
                            setRestoredMessage(`Berhasil menyalin "${item.vendorName}" (${item.projectName}) kembali ke Draf Aktif!`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white border border-[#141414] hover:bg-indigo-100 text-indigo-700 p-1.5 transition-colors cursor-pointer"
                          title="Masukkan kembali ke Draf Aktif (Copy ke draf asli)"
                        >
                          <CornerUpLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus transaksi ini dari histori?')) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="bg-white border border-[#141414] hover:bg-red-50 text-red-650 p-1.5 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Overlay Box: Slip Gaji Vendor Printable */}
      <AnimatePresence>
        {selectedItemForSlip && (
          <div className="fixed inset-0 bg-[#141414]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 md:p-8 max-w-lg w-full border-2 border-[#141414] shadow-[8px_8px_0px_#141414] relative"
            >
              <button
                onClick={() => setSelectedItemForSlip(null)}
                className="absolute right-5 top-5 p-1 px-2 border-2 border-[#141414] hover:bg-red-50 text-gray-700 font-bold transition-colors cursor-pointer"
              >
                X
              </button>

              <div id="payroll-slip-content" className="space-y-6 pt-2 font-mono">
                {/* Header Slip */}
                <div className="text-center pb-4 border-b-2 border-dashed border-[#141414]">
                  <h3 className="font-extrabold text-xl text-gray-900 tracking-tight font-serif italic">PAYROLL RECEIPT</h3>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">Sistem Otomasi Payroll Vendor - {formatDate(selectedItemForSlip.dateCreated)}</p>
                </div>

                {/* Grid Rincian Slip */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">NAMA PROYEK:</span>
                    <span className="font-bold text-gray-900 text-right max-w-[65%]">{selectedItemForSlip.projectName.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">DIBERIKAN KEPADA:</span>
                    <span className="font-bold text-gray-900 text-right">{selectedItemForSlip.vendorName.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">TERMIN PEMBAYARAN:</span>
                    <span className="font-bold text-gray-800 text-right">{selectedItemForSlip.term.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">BANK TRANSFER:</span>
                    <span className="font-bold text-gray-900 text-right">
                      {selectedItemForSlip.bankName} - {selectedItemForSlip.bankAccount}
                    </span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">NAMA REKENING:</span>
                    <span className="font-bold text-gray-900 text-right">{selectedItemForSlip.bankHolderName.toUpperCase()}</span>
                  </div>

                  {selectedItemForSlip.notes && (
                    <div className="bg-[#f2f2f0] p-3 border border-[#141414] text-[11px] text-gray-700 leading-relaxed">
                      💡 <strong>Catatan Internal:</strong> {selectedItemForSlip.notes}
                    </div>
                  )}

                  {/* Nominal Total */}
                  <div className="bg-[#f2f2f0] p-4 border-2 border-[#141414] flex justify-between items-center mt-4">
                    <span className="font-bold text-gray-800">TOTAL DIBAYARKAN:</span>
                    <span className="text-xl font-bold font-mono text-[#141414]">{formatRupiah(selectedItemForSlip.amount)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px]">
                    <span className="text-gray-500">STATUS TRANSAKSI:</span>
                    <span
                      className={`font-mono font-bold px-2.5 py-0.5 border border-[#141414] ${
                        selectedItemForSlip.status === 'Selesai Dibayar'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedItemForSlip.status === 'Selesai Dibayar' ? 'LUNAS (PAID)' : 'MENUNGGU TRANSFER (PENDING)'}
                    </span>
                  </div>
                </div>

                {/* Footer Slip */}
                <div className="border-t-2 border-dashed border-[#141414] pt-5 flex justify-between gap-3 font-mono font-bold">
                  <button
                    onClick={() => {
                      const printSlip = () => {
                        const originalContent = document.body.innerHTML;
                        const printContent = document.getElementById('payroll-slip-content')?.innerHTML;
                        if (printContent) {
                          document.body.innerHTML = `<div style="padding: 40px; font-family: monospace; max-width: 600px; margin: 0 auto;">${printContent}</div>`;
                          window.print();
                          document.body.innerHTML = originalContent;
                          window.location.reload(); // Refresh to restore react attachments
                        }
                      };
                      printSlip();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#141414] text-white font-bold py-2.5 px-4 hover:bg-gray-900 transition-all cursor-pointer text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Slip
                  </button>
                  <button
                    onClick={() => setSelectedItemForSlip(null)}
                    className="flex-1 border-2 border-[#141414] hover:bg-gray-100 text-gray-700 font-bold py-2.5 px-4 transition-all cursor-pointer text-xs text-center"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Layout Cetak Laporan (Di luar viewport standar, aktif hanya saat window.print() di-trigger) */}
      <div className="hidden print:block p-10 bg-white text-gray-900 space-y-6 font-mono text-xs">
        <div className="text-center pb-6 border-b-2 border-[#141414]">
          <h1 className="text-2xl font-black uppercase font-serif italic text-[#141414]">LAPORAN REKAPITULASI PENGAJUAN PENGGAYAN VENDOR</h1>
          <p className="text-sm text-gray-600 mt-1">Dicetak pada tanggal: {formatDate(new Date().toISOString(), true)}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 border-2 border-[#141414] p-4 bg-[#f2f2f0]">
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">TOTAL PENGAJUAN</div>
            <div className="text-base font-bold">{formatRupiah(totalAmountSubmitted)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">TOTAL DIRECONSIL (LUNAS)</div>
            <div className="text-base font-bold text-emerald-800">{formatRupiah(totalPaid)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">TOTAL MENUNGGU (PENDING)</div>
            <div className="text-base font-bold text-amber-800">{formatRupiah(totalPending)}</div>
          </div>
        </div>

        <table className="w-full text-left border-collapse border-2 border-[#141414] mt-6">
          <thead>
            <tr className="bg-[#f2f2f0] text-xs font-bold uppercase border-b-2 border-[#141414]">
              <th className="p-3 border border-[#141414]">Tanggal</th>
              <th className="p-3 border border-[#141414]">Project</th>
              <th className="p-3 border border-[#141414]">Vendor</th>
              <th className="p-3 border border-[#141414]">Termin</th>
              <th className="p-3 border border-[#141414]">No. Rekening</th>
              <th className="p-3 border border-[#141414]">Status</th>
              <th className="p-3 border border-[#141414] text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={`print-${item.id}`} className="border-b border-gray-300">
                <td className="p-3 border border-[#141414] text-[10px] font-mono">{formatDate(item.dateCreated, false)}</td>
                <td className="p-3 border border-[#141414] font-bold">{item.projectName.toUpperCase()}</td>
                <td className="p-3 border border-[#141414] font-bold">{item.vendorName.toUpperCase()}</td>
                <td className="p-3 border border-[#141414] text-[10px]">{item.term}</td>
                <td className="p-3 border border-[#141414] text-[10px] font-mono">{item.bankName} - {item.bankAccount} (A.N {item.bankHolderName.toUpperCase()})</td>
                <td className="p-3 border border-[#141414] text-[10px] font-bold">{item.status.toUpperCase()}</td>
                <td className="p-3 border border-[#141414] text-right font-bold">{formatRupiah(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pt-10 flex justify-between text-xs text-gray-500">
          <div>Disiapkan oleh: _______________________</div>
          <div>Disetujui oleh: _______________________</div>
        </div>
      </div>
    </div>
  );
}
