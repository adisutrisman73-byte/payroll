import React, { useState } from 'react';
import { VendorPreset } from '../types';
import { INDONESIAN_BANKS } from '../constants';
import { Plus, Trash2, Edit2, Check, X, Search, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VendorManagerProps {
  vendors: VendorPreset[];
  onAddVendor: (vendor: Omit<VendorPreset, 'id'>) => void;
  onEditVendor: (vendor: VendorPreset) => void;
  onDeleteVendor: (id: string) => void;
}

export default function VendorManager({
  vendors,
  onAddVendor,
  onEditVendor,
  onDeleteVendor,
}: VendorManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('BCA');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const [editName, setEditName] = useState('');
  const [editBankName, setEditBankName] = useState('');
  const [editBankAccount, setEditBankAccount] = useState('');
  const [editAccountHolder, setEditAccountHolder] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bankAccount || !accountHolder) {
      alert('Mohon isi semua data vendor dengan lengkap!');
      return;
    }
    onAddVendor({
      name,
      bankName,
      bankAccount,
      accountHolder,
    });
    // Reset form
    setName('');
    setBankName('BCA');
    setBankAccount('');
    setAccountHolder('');
    setIsAdding(false);
  };

  const startEdit = (vendor: VendorPreset) => {
    setEditingId(vendor.id);
    setEditName(vendor.name);
    setEditBankName(vendor.bankName);
    setEditBankAccount(vendor.bankAccount);
    setEditAccountHolder(vendor.accountHolder);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName || !editBankAccount || !editAccountHolder) {
      alert('Mohon isi semua data vendor!');
      return;
    }
    onEditVendor({
      id,
      name: editName,
      bankName: editBankName,
      bankAccount: editBankAccount,
      accountHolder: editAccountHolder,
    });
    setEditingId(null);
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.bankAccount.includes(searchTerm) ||
      v.accountHolder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif italic text-gray-950 flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#141414]" />
            Master Data Vendor
          </h2>
          <p className="text-[11px] font-mono text-gray-500 mt-0.5 uppercase">
            Kelola rincian rekening vendor langganan Anda untuk pengisian draf instan.
          </p>
        </div>
        {!isAdding && (
          <button
            id="btn-add-vendor-toggle"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 brutalist-button-primary py-2.5 px-4 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Vendor
          </button>
        )}
      </div>

      {/* Form Tambah Vendor */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleCreate}
              className="bg-indigo-50 border-2 border-[#141414] p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="col-span-1 md:col-span-2 flex justify-between items-center pb-2 border-b border-[#141414]">
                <h3 className="font-bold font-mono text-xs text-indigo-950">FORMULIR PENDAFTARAN VENDOR</h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-gray-500 hover:text-black font-bold p-1 border border-[#141414] bg-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-gray-700 mb-1.5 uppercase">Nama Vendor / Perusahaan *</label>
                <input
                  type="text"
                  placeholder="Contoh: CV. Berkah Abadi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-gray-700 mb-1.5 uppercase">Nama Pemilik Rekening *</label>
                <input
                  type="text"
                  placeholder="Sesuai buku tabungan"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-gray-700 mb-1.5 uppercase">Pilih Bank *</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3 py-2 cursor-pointer focus:outline-hidden"
                >
                  {INDONESIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-gray-700 mb-1.5 uppercase">Nomor Rekening Rekan *</label>
                <input
                  type="text"
                  placeholder="Contoh: 1245902133"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-3.5 py-2 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border-2 border-[#141414] text-gray-800 font-bold font-mono bg-white hover:bg-gray-100 text-xs cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141414] border-2 border-[#141414] text-white font-bold font-mono hover:bg-gray-900 text-xs cursor-pointer shadow-[2px_2px_0px_#25D366]"
                >
                  SIMPAN VENDOR
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kolom Pencarian */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Cari vendor berdasarkan nama, rekening, atau pemilik..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs font-mono bg-white border-2 border-[#141414] pl-10 pr-4 py-2.5 focus:outline-hidden focus:shadow-[2px_2px_0px_#4f46e5]"
        />
      </div>

      {/* Tabel Data Vendor */}
      <div className="overflow-x-auto border-2 border-[#141414]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f2f2f0] border-b-2 border-[#141414] text-gray-800 text-xs font-bold uppercase tracking-wider font-mono">
              <th className="px-6 py-4 border-r border-[#141414]">Nama Vendor</th>
              <th className="px-6 py-4 border-r border-[#141414]">Nama Rekening</th>
              <th className="px-6 py-4 border-r border-[#141414]">Informasi Bank</th>
              <th className="px-6 py-4 border-r border-[#141414]">Nomor Rekening</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#141414] text-xs">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 font-mono">
                  {searchTerm ? 'PENCARIAN TIDAK DITEMUKAN' : 'BELUM ADA DATA VENDOR TERDAFTAR'}
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => {
                const isEditing = editingId === vendor.id;
                return (
                  <tr key={vendor.id} className="hover:bg-gray-100/50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-2 py-1 focus:outline-hidden"
                        />
                      ) : (
                        <span className="font-extrabold text-gray-900">{vendor.name.toUpperCase()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editAccountHolder}
                          onChange={(e) => setEditAccountHolder(e.target.value)}
                          className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-2 py-1 focus:outline-hidden"
                        />
                      ) : (
                        <span className="font-bold text-gray-800">{vendor.accountHolder.toUpperCase()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {isEditing ? (
                        <select
                          value={editBankName}
                          onChange={(e) => setEditBankName(e.target.value)}
                          className="w-full text-xs font-mono bg-white border-2 border-[#141414] py-1 focus:outline-hidden"
                        >
                          {INDONESIAN_BANKS.map((b) => (
                            <option key={b.code} value={b.code}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 border border-[#141414] text-[9px] font-mono font-bold bg-[#141414] text-white">
                          {vendor.bankName}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-900 font-extrabold border-r border-gray-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editBankAccount}
                          onChange={(e) => setEditBankAccount(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-xs font-mono bg-white border-2 border-[#141414] px-2 py-2 focus:outline-hidden"
                        />
                      ) : (
                        vendor.bankAccount
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(vendor.id)}
                            className="bg-white border border-[#141414] hover:bg-emerald-50 text-emerald-800 p-1.5 transition-colors cursor-pointer"
                            title="Simpan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-white border border-[#141414] hover:bg-gray-100 text-gray-700 p-1.5 transition-colors cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => startEdit(vendor)}
                            className="bg-white border border-[#141414] hover:bg-gray-100 text-indigo-700 p-1.5 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus vendor "${vendor.name}"?`)) {
                                onDeleteVendor(vendor.id);
                              }
                            }}
                            className="bg-white border border-[#141414] hover:bg-red-50 text-red-650 p-1.5 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
