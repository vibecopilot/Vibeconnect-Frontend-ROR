import axios from './axiosInstance';

// Account Groups API
export const getAccountGroups = async (siteId = null) => {
  const params = siteId ? { site_id: siteId } : {};
  const response = await axios.get('/account_groups', { params });
  return response.data;
};

export const getAccountGroup = async (id) => {
  const response = await axios.get(`/account_groups/${id}`);
  return response.data;
};

export const createAccountGroup = async (data) => {
  const response = await axios.post('/account_groups', data);
  return response.data;
};

export const updateAccountGroup = async (id, data) => {
  const response = await axios.put(`/account_groups/${id}`, data);
  return response.data;
};

export const deleteAccountGroup = async (id) => {
  const response = await axios.delete(`/account_groups/${id}`);
  return response.data;
};

export const seedDefaultAccountGroups = async () => {
  const response = await axios.post('/account_groups/seed_defaults');
  return response.data;
};

// Ledgers API
export const getLedgers = async (params = {}) => {
  const response = await axios.get('/ledgers', { params });
  return response.data;
};

export const getLedger = async (id) => {
  const response = await axios.get(`/ledgers/${id}`);
  return response.data;
};

export const createLedger = async (data) => {
  const response = await axios.post('/ledgers', data);
  return response.data;
};

export const updateLedger = async (id, data) => {
  const response = await axios.put(`/ledgers/${id}`, data);
  return response.data;
};

export const deleteLedger = async (id) => {
  const response = await axios.delete(`/ledgers/${id}`);
  return response.data;
};

export const getLedgerTransactions = async (id, params = {}) => {
  const response = await axios.get(`/ledgers/${id}/transactions`, { params });
  return response.data;
};

export const getLedgerBalanceSheet = async (id) => {
  const response = await axios.get(`/ledgers/${id}/balance_sheet`);
  return response.data;
};

export const seedDefaultLedgers = async () => {
  const response = await axios.post('/ledgers/seed_defaults');
  return response.data;
};

export const getLedgersByGroup = async (params = {}) => {
  const response = await axios.get('/ledgers/by_group', { params });
  return response.data;
};

// Tax Rates API
export const getTaxRates = async (params = {}) => {
  const response = await axios.get('/tax_rates', { params });
  return response.data;
};

export const getTaxRate = async (id) => {
  const response = await axios.get(`/tax_rates/${id}`);
  return response.data;
};

export const createTaxRate = async (data) => {
  const response = await axios.post('/tax_rates', data);
  return response.data;
};

export const updateTaxRate = async (id, data) => {
  const response = await axios.put(`/tax_rates/${id}`, data);
  return response.data;
};

export const deleteTaxRate = async (id) => {
  const response = await axios.delete(`/tax_rates/${id}`);
  return response.data;
};

export const seedDefaultTaxRates = async () => {
  const response = await axios.post('/tax_rates/seed_defaults');
  return response.data;
};

export const getActiveTaxRates = async () => {
  const response = await axios.get('/tax_rates/active');
  return response.data;
};

// Accounting Invoices API
export const getAccountingInvoices = async (params = {}) => {
  const response = await axios.get('/accounting_invoices', { params });
  return response.data;
};

export const getAccountingInvoice = async (id) => {
  const response = await axios.get(`/accounting_invoices/${id}`);
  return response.data;
};

export const createAccountingInvoice = async (data) => {
  const response = await axios.post('/accounting_invoices', data);
  return response.data;
};

export const updateAccountingInvoice = async (id, data) => {
  const response = await axios.put(`/accounting_invoices/${id}`, data);
  return response.data;
};

export const deleteAccountingInvoice = async (id) => {
  const response = await axios.delete(`/accounting_invoices/${id}`);
  return response.data;
};

export const sendInvoice = async (id) => {
  const response = await axios.post(`/accounting_invoices/${id}/send_invoice`);
  return response.data;
};

export const addPaymentToInvoice = async (id, data) => {
  const response = await axios.post(`/accounting_invoices/${id}/add_payment`, data);
  return response.data;
};

export const getOverdueAccountingInvoices = async () => {
  const response = await axios.get('/accounting_invoices/overdue');
  return response.data;
};

export const getInvoicesByUnit = async (params = {}) => {
  const response = await axios.get('/accounting_invoices/by_unit', { params });
  return response.data;
};

// Legacy Invoice Functions (keeping for backward compatibility)
export const getInvoices = async (params = {}) => {
  const response = await axios.get('/invoices', { params });
  return response.data;
};

export const getInvoice = async (id) => {
  const response = await axios.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (data) => {
  const response = await axios.post('/invoices', data);
  return response.data;
};

export const updateInvoice = async (id, data) => {
  const response = await axios.put(`/invoices/${id}`, data);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await axios.delete(`/invoices/${id}`);
  return response.data;
};

export const postInvoice = async (id) => {
  const response = await axios.post(`/invoices/${id}/post`);
  return response.data;
};

export const getUnitInvoices = async (unitId) => {
  const response = await axios.get(`/invoices/unit/${unitId}`);
  return response.data;
};

export const getOverdueInvoices = async () => {
  const response = await axios.get('/invoices/overdue');
  return response.data;
};

// Accounting Payments API
export const getAccountingPayments = async (params = {}) => {
  const response = await axios.get('/accounting_payments', { params });
  return response.data;
};

export const getAccountingPayment = async (id) => {
  const response = await axios.get(`/accounting_payments/${id}`);
  return response.data;
};

export const createAccountingPayment = async (data) => {
  const response = await axios.post('/accounting_payments', data);
  return response.data;
};

export const updateAccountingPayment = async (id, data) => {
  const response = await axios.put(`/accounting_payments/${id}`, data);
  return response.data;
};

export const deleteAccountingPayment = async (id) => {
  const response = await axios.delete(`/accounting_payments/${id}`);
  return response.data;
};

export const getPaymentsByInvoice = async (params = {}) => {
  const response = await axios.get('/accounting_payments/by_invoice', { params });
  return response.data;
};

// Legacy Payments Functions (keeping for backward compatibility)
export const getPayments = async (params = {}) => {
  const response = await axios.get('/payments', { params });
  return response.data;
};

export const getPayment = async (id) => {
  const response = await axios.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (data) => {
  const response = await axios.post('/payments', data);
  return response.data;
};

export const updatePayment = async (id, data) => {
  const response = await axios.put(`/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await axios.delete(`/payments/${id}`);
  return response.data;
};

// Journal Entries API
export const getJournalEntries = async (params = {}) => {
  const response = await axios.get('/journal_entries', { params });
  return response.data;
};

export const getJournalEntry = async (id) => {
  const response = await axios.get(`/journal_entries/${id}`);
  return response.data;
};

export const createJournalEntry = async (data) => {
  const response = await axios.post('/journal_entries', data);
  return response.data;
};

export const updateJournalEntry = async (id, data) => {
  const response = await axios.put(`/journal_entries/${id}`, data);
  return response.data;
};

export const deleteJournalEntry = async (id) => {
  const response = await axios.delete(`/journal_entries/${id}`);
  return response.data;
};

export const postJournalEntry = async (id) => {
  const response = await axios.post(`/journal_entries/${id}/post`);
  return response.data;
};

export const cancelJournalEntry = async (id) => {
  const response = await axios.post(`/journal_entries/${id}/cancel`);
  return response.data;
};

// Accounting Reports API
export const getAccountingTrialBalance = async (params) => {
  const response = await axios.get('/accounting_reports/trial_balance', { params });
  return response.data;
};

export const getAccountingBalanceSheet = async (params) => {
  const response = await axios.get('/accounting_reports/balance_sheet', { params });
  return response.data;
};

export const getAccountingProfitLoss = async (params) => {
  const response = await axios.get('/accounting_reports/profit_and_loss', { params });
  return response.data;
};

export const getAccountingLedgerStatement = async (params) => {
  const response = await axios.get('/accounting_reports/ledger_statement', { params });
  return response.data;
};

export const getAccountingUnitStatement = async (params) => {
  const response = await axios.get('/accounting_reports/unit_statement', { params });
  return response.data;
};

export const getReceivablesSummary = async (params) => {
  const response = await axios.get('/accounting_reports/receivables_summary', { params });
  return response.data;
};

// Legacy Reports Functions (keeping for backward compatibility)
export const getTrialBalance = async (params) => {
  const response = await axios.get('/reports/trial_balance', { params });
  return response.data;
};

export const getBalanceSheet = async (params) => {
  const response = await axios.get('/reports/balance_sheet', { params });
  return response.data;
};

export const getProfitLoss = async (params) => {
  const response = await axios.get('/reports/profit_loss', { params });
  return response.data;
};

export const getLedgerStatement = async (params) => {
  const response = await axios.get('/reports/ledger_statement', { params });
  return response.data;
};

export const getSiteSummary = async (params) => {
  const response = await axios.get('/reports/site_summary', { params });
  return response.data;
};

export const getUnitStatement = async (params) => {
  const response = await axios.get('/reports/unit_statement', { params });
  return response.data;
};

// Settings API
export const getAccountingSettings = async () => {
  const response = await axios.get('/settings/accounting');
  return response.data;
};

export const updateAccountingSettings = async (data) => {
  const response = await axios.put('/settings/accounting', data);
  return response.data;
};
