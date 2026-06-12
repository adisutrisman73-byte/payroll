import React, { useState } from 'react';
import { WAConfig } from '../types';
import { DEFAULT_WA_TEMPLATE } from '../constants';
import { Settings, Save, RefreshCw, AlertCircle, Phone, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TemplateSettingsProps {
  waConfig: WAConfig;
  onSaveConfig: (config: WAConfig) => void;
}

export default function TemplateSettings({
  waConfig,
  onSaveConfig,
}: TemplateSettingsProps) {
  const [phoneNumber, setPhoneNumber] = useState(waConfig.phoneNumber);
  const [messageTemplate, setMessageTemplate] = useState(waConfig.messageTemplate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      phoneNumber: phoneNumber.trim(),
      messageTemplate: messageTemplate,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const resetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan template bawaan pabrik?')) {
      setMessageTemplate(DEFAULT_WA_TEMPLATE);
    }
  };

  return (
    <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 border-2 border-[#141414] bg-[#f2f2f0] flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#141414]" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif italic text-gray-950">Pengaturan WhatsApp & Template</h2>
          <p className="text-[11px] font-mono text-gray-500 mt-0.5 uppercase">UBAH NOMOR TUJUAN DAN FORMAT PESAN OTOMATIS BERIKUT</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Nomor WhatsApp Penerima */}
        <div>
          <label className="block text-xs font-bold font-mono text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[#141414]" />
            NOMOR WHATSAPP FINANCE / KEUANGAN
          </label>
          <input
            type="text"
            placeholder="Contoh: 08123456789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, ''))}
            className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2.5 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5] placeholder:text-gray-300"
          />
          <p className="text-[11px] text-gray-500 font-mono mt-1 leading-relaxed uppercase">
            MASUKKAN KODE NEGARA TANPA "+" (MISAL: <strong className="text-black font-extrabold">6281234567890</strong>) ATAU NOMOR LOG (MISAL: <strong className="text-black font-extrabold">08123456789</strong>). JIKA KOSONG, AKAN MEMBUKA DIALOG SHARE UMUM.
          </p>
        </div>

        {/* Template Pesan WA */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold font-mono text-gray-700 flex items-center gap-1.5 uppercase">
              <FileText className="w-4 h-4 text-[#141414]" />
              Format Struktur Pesan WhatsApp
            </label>
            <button
              type="button"
              onClick={resetToDefault}
              className="text-[10px] text-indigo-700 font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white border border-[#141414] px-2 py-1"
            >
              <RefreshCw className="w-3 h-3" />
              RESET TEMPLATE
            </button>
          </div>
          <textarea
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            rows={10}
            className="w-full text-xs font-mono bg-white border-2 border-[#141414] p-4 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5] leading-relaxed"
            required
          />

          {/* Placeholder Cheat-sheet */}
          <div className="mt-3 bg-[#f2f2f0] p-4 border-2 border-[#141414] space-y-2">
            <div className="text-xs font-bold font-mono text-[#141414] flex items-center gap-1 uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              FORMAT DUMMY KEYWORD OTOMATIS:
            </div>
            <ul className="text-[11px] font-mono text-gray-700 list-disc pl-4 space-y-1 leading-relaxed">
              <li>
                <code className="bg-[#141414] text-white px-1.5 py-0.2 rounded-xs font-bold font-mono">{'{tanggal}'}</code> : Hari/Tanggal real-time pengajuan saat ini.
              </li>
              <li>
                <code className="bg-[#141414] text-white px-1.5 py-0.2 rounded-xs font-bold font-mono">{'{daftar_gaji}'}</code> : Rincian lengkap seluruh item draf vendor saat ini.
              </li>
              <li>
                <code className="bg-[#141414] text-white px-1.5 py-0.2 rounded-xs font-bold font-mono">{'{total_pengajuan}'}</code> : Jumlah total akumulasi upah dari seluruh draf.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span></span>
          <button
            type="submit"
            className="flex items-center gap-2 brutalist-button-primary py-3.5 px-6 font-bold font-mono uppercase text-xs cursor-pointer shadow-[3px_3px_0px_#25D366]"
          >
            <Save className="w-4.5 h-4.5" />
            Simpan Konfigurasi
          </button>
        </div>
      </form>

      {/* Pop up Sukses */}
      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bottom-6 right-6 bg-[#141414] text-[#25D366] font-mono text-xs font-bold px-5 py-4 border-2 border-[#141414] flex items-center gap-2 shadow-[4px_4px_0px_#141414] z-50"
        >
          <CheckCircle className="w-5 h-5 text-[#25D366]" />
          KONFIGURASI WA BERHASIL DISIMPAN KE PENYIMPANAN LOKAL!
        </motion.div>
      )}
    </div>
  );
}
