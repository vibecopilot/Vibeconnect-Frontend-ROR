/**
 * Accounting Utility Functions
 * Reusable helper functions for the accounting module
 */

/**
 * Format currency amount to Indian Rupees
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

/**
 * Format date to localized string
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };
  
  return dateObj.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Get status badge color classes
 * @param {string} status - Status value
 * @param {string} type - Type of status ('invoice', 'payment', 'journal')
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status, type = 'invoice') => {
  const statusColors = {
    invoice: {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-600'
    },
    journal: {
      draft: 'bg-gray-100 text-gray-800',
      posted: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    },
    payment: {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
  };
  
  return statusColors[type]?.[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Calculate invoice totals from line items
 * @param {Array} items - Array of invoice line items
 * @returns {Object} Object containing subtotal, tax, and total
 */
export const calculateInvoiceTotals = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const taxAmount = items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);
  const total = subtotal + taxAmount;
  
  return {
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2)
  };
};

/**
 * Calculate line item amounts with tax
 * @param {number} quantity - Item quantity
 * @param {number} unitPrice - Unit price
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} Object containing amount, tax amount, and total
 */
export const calculateLineItemAmounts = (quantity, unitPrice, taxRate = 0) => {
  const amount = parseFloat(quantity || 0) * parseFloat(unitPrice || 0);
  const taxAmount = (amount * parseFloat(taxRate || 0)) / 100;
  const total = amount + taxAmount;
  
  return {
    amount: amount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2)
  };
};

/**
 * Validate journal entry balance
 * @param {Array} lines - Array of journal entry lines
 * @returns {Object} Object containing totals and balance status
 */
export const validateJournalBalance = (lines = []) => {
  const totalDebit = lines.reduce((sum, line) => sum + parseFloat(line.debit_amount || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + parseFloat(line.credit_amount || 0), 0);
  const difference = totalDebit - totalCredit;
  
  return {
    totalDebit: totalDebit.toFixed(2),
    totalCredit: totalCredit.toFixed(2),
    difference: difference.toFixed(2),
    isBalanced: Math.abs(difference) < 0.01 // Allow small rounding errors
  };
};

/**
 * Generate invoice number
 * @param {string} prefix - Invoice prefix (default: 'INV')
 * @param {number} sequence - Sequence number
 * @param {string} format - Format type ('simple', 'date', 'year')
 * @returns {string} Generated invoice number
 */
export const generateInvoiceNumber = (prefix = 'INV', sequence = 1, format = 'simple') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const paddedSequence = String(sequence).padStart(4, '0');
  
  const formats = {
    simple: `${prefix}-${paddedSequence}`,
    date: `${prefix}-${year}${month}-${paddedSequence}`,
    year: `${prefix}-${year}-${paddedSequence}`
  };
  
  return formats[format] || formats.simple;
};

/**
 * Calculate due date from invoice date
 * @param {string|Date} invoiceDate - Invoice date
 * @param {number} paymentTerms - Payment terms in days
 * @returns {string} Due date in YYYY-MM-DD format
 */
export const calculateDueDate = (invoiceDate, paymentTerms = 30) => {
  const date = typeof invoiceDate === 'string' ? new Date(invoiceDate) : invoiceDate;
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split('T')[0];
};

/**
 * Check if invoice is overdue
 * @param {string|Date} dueDate - Due date
 * @param {string} status - Invoice status
 * @returns {boolean} True if overdue
 */
export const isInvoiceOverdue = (dueDate, status) => {
  if (status === 'paid' || status === 'cancelled') return false;
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date();
};

/**
 * Format account type for display
 * @param {string} type - Account type
 * @returns {string} Formatted account type
 */
export const formatAccountType = (type) => {
  const types = {
    asset: 'Assets',
    liability: 'Liabilities',
    equity: 'Equity',
    revenue: 'Revenue',
    expense: 'Expenses'
  };
  return types[type] || type;
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename for download
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Group array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0);
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {string} Percentage with 2 decimal places
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return '0.00';
  return ((value / total) * 100).toFixed(2);
};

/**
 * Get financial year from date
 * @param {Date} date - Date object
 * @returns {string} Financial year (e.g., '2024-25')
 */
export const getFinancialYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Assuming April to March financial year
  if (month >= 3) { // April onwards
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export default {
  formatCurrency,
  formatDate,
  getStatusColor,
  calculateInvoiceTotals,
  calculateLineItemAmounts,
  validateJournalBalance,
  generateInvoiceNumber,
  calculateDueDate,
  isInvoiceOverdue,
  formatAccountType,
  exportToCSV,
  groupBy,
  debounce,
  isValidEmail,
  formatNumber,
  calculatePercentage,
  getFinancialYear,
  truncateText,
  sortByKey
};
