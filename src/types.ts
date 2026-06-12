export interface VendorPreset {
  id: string;
  name: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
}

export interface PayrollItem {
  id: string;
  projectName: string;
  vendorName: string;
  term: string; // e.g., "Termin 1 (DP)", "Termin 2", "Pelunasan / 100%"
  amount: number;
  bankName: string;
  bankAccount: string;
  bankHolderName: string;
  status: 'Pending' | 'Selesai Dibayar';
  dateCreated: string;
  notes?: string;
}

export interface WAConfig {
  phoneNumber: string;
  messageTemplate: string;
}
