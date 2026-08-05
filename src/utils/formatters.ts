export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatBillingCycle = (cycle?: string, durationDays?: number): string => {
  if (!cycle && durationDays) {
    if (durationDays === 30) return 'MENSUAL';
    if (durationDays === 180) return 'SEMESTRAL';
    if (durationDays === 365) return 'ANUAL';
    return `${durationDays} DÍAS`;
  }

  if (!cycle) return 'MENSUAL';

  const normalized = cycle.trim().toUpperCase();

  switch (normalized) {
    case 'MONTHLY':
    case 'MENSUAL':
      return 'MENSUAL';
    case 'BIANNUAL':
    case 'SEMESTRAL':
      return 'SEMESTRAL';
    case 'YEARLY':
    case 'ANNUAL':
    case 'ANUAL':
      return 'ANUAL';
    case 'TRIAL':
    case 'PRUEBA':
      return 'PRUEBA 30 DÍAS';
    default:
      return normalized;
  }
};

export const formatCyclePeriod = (cycle?: string, durationDays?: number): string => {
  const formatted = formatBillingCycle(cycle, durationDays);
  switch (formatted) {
    case 'MENSUAL':
      return 'mes';
    case 'SEMESTRAL':
      return 'semestre';
    case 'ANUAL':
      return 'año';
    default:
      return 'periodo';
  }
};
