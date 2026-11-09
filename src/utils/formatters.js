// Currency and Number formatting utilities

export function formatCurrency(amount, currency = "so'm") {
  if (amount === undefined || amount === null || isNaN(amount)) return `0 ${currency}`;
  const rounded = Math.round(Number(amount));
  
  if (currency === "so'm" || currency === "UZS") {
    // Formats like: 14 500 000 so'm
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${formatted} so'm`;
  } else if (currency === "$") {
    return `$${rounded.toLocaleString('en-US')}`;
  } else {
    return `${rounded.toLocaleString()} ${currency}`;
  }
}

export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

export function formatCompactNumber(num) {
  if (!num) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function calculateMargin(sellingPrice, purchasePrice) {
  if (!sellingPrice || sellingPrice <= 0) return 0;
  return Math.round(((sellingPrice - purchasePrice) / sellingPrice) * 100);
}

