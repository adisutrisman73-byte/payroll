import { PayrollItem, VendorPreset } from './types';

export const INDONESIAN_BANKS = [
  { code: 'BCA', name: 'Bank Central Asia (BCA)' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
  { code: 'BSI', name: 'Bank Syariah Indonesia (BSI)' },
  { code: 'SEABANK', name: 'SeaBank' },
  { code: 'DANA', name: 'DANA' },
  { code: 'CIMB', name: 'CIMB Niaga' },
  { code: 'PERMATA', name: 'Permata Bank' },
  { code: 'DANAMON', name: 'Bank Danamon' },
  { code: 'BTN', name: 'Bank Tabungan Negara (BTN)' },
  { code: 'OTHER', name: 'Bank Lainnya (Ketik Manual)' },
];

export const TERMIN_OPTIONS = [
  'Termin-1',
  'Termin-3',
  'Termin-5',
  'Termin-6',
  'Termin-7',
  'Termin-10',
  '1x bayar (Pelunasan)',
  'Termin Akhir (Pelunasan 100%)',
  'Gaji Bulanan / Monthly',
  'Upah Mingguan',
  'Upah Harian',
  'Borongan Proyek',
  'Lain-lain / Custom',
];

export const DEFAULT_WA_TEMPLATE = `*DAFTAR PENGAJUAN PAYROLL VENDOR* 📋
Hari/Tanggal: {tanggal}

Halo Keuangan, berikut kami ajukan daftar transfer upah/gaji vendor untuk proyek aktif:

{daftar_gaji}

*Total Pengajuan:* {total_pengajuan}

Mohon dapat segera diproses transfer ke rekening masing-masing vendor di atas. Terima kasih 🙏`;

export const INITIAL_VENDORS: VendorPreset[] = [
  {
    id: 'v_bahar',
    name: 'Pak Bahar V.Listrik',
    bankName: 'SEABANK',
    bankAccount: '',
    accountHolder: 'Pak Bahar',
  },
  {
    id: 'v_muliadi',
    name: 'Pak Muliadi',
    bankName: 'DANA',
    bankAccount: '89508008988033768',
    accountHolder: 'Mulyadi',
  },
  {
    id: 'v_tiro',
    name: 'Pak Tiro Vendor Sipil',
    bankName: 'BRI',
    bankAccount: '508601022524534',
    accountHolder: 'Nursiah',
  },
  {
    id: 'v_ruslan',
    name: 'Pak Ruslan',
    bankName: 'SEABANK',
    bankAccount: '901952557401',
    accountHolder: 'Ahmad Fathi Fauzi',
  },
  {
    id: 'v_iwan',
    name: 'Pak Iwan Vendor Listrik',
    bankName: 'BRI',
    bankAccount: '313401023086530',
    accountHolder: 'Iwan Wicaksono',
  },
  {
    id: 'v_rico',
    name: 'Mas Rico',
    bankName: 'BCA',
    bankAccount: '8735586188',
    accountHolder: 'Riko Setiawan',
  },
  {
    id: 'v_jerre',
    name: 'Dg Jerre',
    bankName: 'BNI',
    bankAccount: '1277914976',
    accountHolder: 'Atta Lariksyah',
  },
  {
    id: 'v_agus',
    name: 'Pak Agus',
    bankName: 'SEABANK',
    bankAccount: '901266623550',
    accountHolder: 'Pak Agus',
  },
  {
    id: 'v_udin_ardi',
    name: 'Pak Udin Ardi',
    bankName: 'BRI',
    bankAccount: '305701052154538',
    accountHolder: 'Ardi',
  },
];

export const INITIAL_DRAFTS: PayrollItem[] = [
  {
    id: 'seed_d1',
    projectName: 'IDI',
    vendorName: 'Pak Bahar V.Listrik',
    term: 'Termin-10',
    amount: 0,
    bankName: 'SEABANK',
    bankAccount: '',
    bankHolderName: 'Pak Bahar',
    status: 'Pending',
    dateCreated: '2026-06-06T08:00:00.000Z',
    notes: 'Upah Listrik'
  },
  {
    id: 'seed_d2',
    projectName: 'IDI',
    vendorName: 'Pak Muliadi',
    term: 'Termin-3',
    amount: 0,
    bankName: 'DANA',
    bankAccount: '89508008988033768',
    bankHolderName: 'Mulyadi (atau Mandiri Hibatur)',
    status: 'Pending',
    dateCreated: '2026-06-06T08:10:00.000Z',
    notes: 'Pas.Pintu'
  },
  {
    id: 'seed_d3',
    projectName: 'ANGKASA',
    vendorName: 'Pak Bahar V.Listrik',
    term: 'Termin-3',
    amount: 800000,
    bankName: 'SEABANK',
    bankAccount: '',
    bankHolderName: 'Pak Bahar',
    status: 'Pending',
    dateCreated: '2026-06-06T08:20:00.000Z',
    notes: 'Upah Listrik'
  },
  {
    id: 'seed_d4',
    projectName: 'ANGKASA',
    vendorName: 'Pak Tiro Vendor Sipil',
    term: 'Termin-10',
    amount: 4000000,
    bankName: 'BRI',
    bankAccount: '508601022524534',
    bankHolderName: 'Nursiah',
    status: 'Pending',
    dateCreated: '2026-06-06T08:30:00.000Z',
    notes: 'Vendor Sipil'
  },
  {
    id: 'seed_d5',
    projectName: 'LALABATA SOPPENG',
    vendorName: 'Pak Ruslan',
    term: 'Termin-7',
    amount: 8700000,
    bankName: 'SEABANK',
    bankAccount: '901952557401',
    bankHolderName: 'Ahmad Fathi Fauzi',
    status: 'Pending',
    dateCreated: '2026-06-06T08:40:00.000Z',
    notes: 'Pek. Sipil'
  },
  {
    id: 'seed_d6',
    projectName: 'MASJID UMARAYN',
    vendorName: 'Pak Iwan Vendor Listrik',
    term: 'Termin-7',
    amount: 2500000,
    bankName: 'BRI',
    bankAccount: '313401023086530',
    bankHolderName: 'Iwan Wicaksono',
    status: 'Pending',
    dateCreated: '2026-06-06T08:50:00.000Z',
    notes: 'Vendor Listrik'
  },
  {
    id: 'seed_d7',
    projectName: 'MASJID UMARAYN',
    vendorName: 'Mas Rico',
    term: 'Termin-6',
    amount: 600000,
    bankName: 'BCA',
    bankAccount: '8735586188',
    bankHolderName: 'Riko Setiawan',
    status: 'Pending',
    dateCreated: '2026-06-06T09:00:00.000Z',
    notes: 'Vendor Sipil'
  },
  {
    id: 'seed_d8',
    projectName: 'MASJID UMARAYN',
    vendorName: 'Dg Jerre',
    term: 'Termin-5',
    amount: 9000000,
    bankName: 'BNI',
    bankAccount: '1277914976',
    bankHolderName: 'Atta Lariksyah',
    status: 'Pending',
    dateCreated: '2026-06-06T09:10:00.000Z',
    notes: 'Vendor Sipil'
  },
  {
    id: 'seed_d9',
    projectName: 'MASJID UMARAYN',
    vendorName: 'Pak Muliadi',
    term: '1x bayar (Pelunasan)',
    amount: 350000,
    bankName: 'DANA',
    bankAccount: '89508008988033768',
    bankHolderName: 'Mulyadi (atau Mandiri Hibatur)',
    status: 'Pending',
    dateCreated: '2026-06-06T09:20:00.000Z',
    notes: 'Pas.Pintu Kayu'
  },
  {
    id: 'seed_d10',
    projectName: 'PALOPO',
    vendorName: 'Pak Agus',
    term: 'Termin-1',
    amount: 11000000,
    bankName: 'SEABANK',
    bankAccount: '901266623550',
    bankHolderName: 'Pak Agus',
    status: 'Pending',
    dateCreated: '2026-06-06T09:30:00.000Z',
    notes: 'Vend. Sipil'
  },
  {
    id: 'seed_d11',
    projectName: 'ANDI TONRO',
    vendorName: 'Pak Udin Ardi',
    term: 'Termin-1',
    amount: 4000000,
    bankName: 'BRI',
    bankAccount: '305701052154538',
    bankHolderName: 'Ardi',
    status: 'Pending',
    dateCreated: '2026-06-06T09:40:00.000Z',
    notes: 'Vend. Sipil'
  }
];

export const INITIAL_PAYROLLS: PayrollItem[] = INITIAL_DRAFTS.map(item => ({
  ...item,
  id: item.id.replace('seed_d', 'seed_h')
}));
