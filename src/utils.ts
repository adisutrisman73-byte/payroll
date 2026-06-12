import { PayrollItem } from './types';

/**
 * Formats a number into Indonesian Rupiah (Rp) currency format
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO string into standard Indonesian date format
 */
export function formatDate(isoString: string, includeTime = false): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    
    const datePart = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (includeTime) {
      const timePart = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${datePart} ${timePart} WIB`;
    }
    
    return datePart;
  } catch (e) {
    return isoString;
  }
}

/**
 * Parses and replaces placeholders in the WhatsApp template
 */
export function parseWATemplate(
  template: string,
  items: PayrollItem[],
  customDate = new Date()
): string {
  const dateStr = formatDate(customDate.toISOString(), false);
  
  let totalAmount = 0;
  const listText = items
    .map((item, index) => {
      totalAmount += item.amount;
      return `${index + 1}. *Proyek:* ${item.projectName}
   *Vendor:* ${item.vendorName}
   *Termin:* ${item.term}
   *Gaji/Upah:* ${formatRupiah(item.amount)}
   *Bank:* ${item.bankName}
   *No Rekening:* ${item.bankAccount}
   *A.N:* ${item.bankHolderName}${item.notes ? `\n   *Catatan:* ${item.notes}` : ''}`;
    })
    .join('\n\n');

  return template
    .replace(/{tanggal}/g, dateStr)
    .replace(/{daftar_gaji}/g, listText)
    .replace(/{total_pengajuan}/g, formatRupiah(totalAmount).replace('Rp', '').trim());
}

/**
 * Generates an direct WhatsApp send URL
 */
export function generateWAUrl(phoneNumber: string, text: string): string {
  // Clean phone number: remove non-digit characters, replace leading 0 with 62
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  
  const encodedText = encodeURIComponent(text);
  
  // Use wa.me link
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}
