import axios from './axiosInstance';

// Account Groups API
export const getAccountGroups = async (siteId = null) => {
  const params = siteId ? { site_id: siteId } : {};
  const response = await axios.get('/api/account_groups', { params });
  return response.data;
};

export const getAccountGroup = async (id) => {
  const response = await axios.get(`/api/account_groups/${id}`);
  return response.data;
};

export const createAccountGroup = async (data) => {
  const response = await axios.post('/api/account_groups', data);
  return response.data;
};

export const updateAccountGroup = async (id, data) => {
  const response = await axios.put(`/api/account_groups/${id}`, data);
  return response.data;
};

export const deleteAccountGroup = async (id) => {
  const response = await axios.delete(`/api/account_groups/${id}`);
  return response.data;
};

// Ledgers API
export const getLedgers = async (params = {}) => {
  const response = await axios.get('/api/ledgers', { params });
  return response.data;
};

export const getLedger = async (id) => {
  const response = await axios.get(`/api/ledgers/${id}`);
  return response.data;
};

export const createLedger = async (data) => {
  const response = await axios.post('/api/ledgers', data);
  return response.data;
};

export const updateLedger = async (id, data) => {
  const response = await axios.put(`/api/ledgers/${id}`, data);
  return response.data;
};

export const deleteLedger = async (id) => {
  const response = await axios.delete(`/api/ledgers/${id}`);
  return response.data;
};

export const getLedgerTransactions = async (id, params = {}) => {
  const response = await axios.get(`/api/ledgers/${id}/transactions`, { params });
  return response.data;
};

// Tax Rates API
export const getTaxRates = async (params = {}) => {
  const response = await axios.get('/api/tax_rates', { params });
  return response.data;
};

export const getTaxRate = async (id) => {
  const response = await axios.get(`/api/tax_rates/${id}`);
  return response.data;
};

export const createTaxRate = async (data) => {
  const response = await axios.post('/api/tax_rates', data);
  return response.data;
};

export const updateTaxRate = async (id, data) => {
  const response = await axios.put(`/api/tax_rates/${id}`, data);
  return response.data;
};

export const deleteTaxRate = async (id) => {
  const response = await axios.delete(`/api/tax_rates/${id}`);
  return response.data;
};

// Invoices API
export const getInvoices = async (params = {}) => {
  const response = await axios.get('/api/invoices', { params });
  return response.data;
};

export const getInvoice = async (id) => {
  const response = await axios.get(`/api/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (data) => {
  const response = await axios.post('/api/invoices', data);
  return response.data;
};

export const updateInvoice = async (id, data) => {
  const response = await axios.put(`/api/invoices/${id}`, data);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await axios.delete(`/api/invoices/${id}`);
  return response.data;
};

export const postInvoice = async (id) => {
  const response = await axios.post(`/api/invoices/${id}/post`);
  return response.data;
};

export const getUnitInvoices = async (unitId) => {
  const response = await axios.get(`/api/invoices/unit/${unitId}`);
  return response.data;
};

export const getOverdueInvoices = async () => {
  const response = await axios.get('/api/invoices/overdue');
  return response.data;
};

// Payments API
export const getPayments = async (params = {}) => {
  const response = await axios.get('/api/payments', { params });
  return response.data;
};

export const getPayment = async (id) => {
  const response = await axios.get(`/api/payments/${id}`);
  return response.data;
};

export const createPayment = async (data) => {
  const response = await axios.post('/api/payments', data);
  return response.data;
};

export const updatePayment = async (id, data) => {
  const response = await axios.put(`/api/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await axios.delete(`/api/payments/${id}`);
  return response.data;
};

// Journal Entries API
export const getJournalEntries = async (params = {}) => {
  const response = await axios.get('/api/journal_entries', { params });
  return response.data;
};

export const getJournalEntry = async (id) => {
  const response = await axios.get(`/api/journal_entries/${id}`);
  return response.data;
};

export const createJournalEntry = async (data) => {
  const response = await axios.post('/api/journal_entries', data);
  return response.data;
};

export const updateJournalEntry = async (id, data) => {
  const response = await axios.put(`/api/journal_entries/${id}`, data);
  return response.data;
};

export const deleteJournalEntry = async (id) => {
  const response = await axios.delete(`/api/journal_entries/${id}`);
  return response.data;
};

export const postJournalEntry = async (id) => {
  const response = await axios.post(`/api/journal_entries/${id}/post`);
  return response.data;
};

// Reports API
export const getTrialBalance = async (params) => {
  const response = await axios.get('/api/reports/trial_balance', { params });
  return response.data;
};

export const getBalanceSheet = async (params) => {
  const response = await axios.get('/api/reports/balance_sheet', { params });
  return response.data;
};

export const getProfitLoss = async (params) => {
  const response = await axios.get('/api/reports/profit_loss', { params });
  return response.data;
};

export const getLedgerStatement = async (params) => {
  const response = await axios.get('/api/reports/ledger_statement', { params });
  return response.data;
};

export const getSiteSummary = async (params) => {
  const response = await axios.get('/api/reports/site_summary', { params });
  return response.data;
};

export const getUnitStatement = async (params) => {
  const response = await axios.get('/api/reports/unit_statement', { params });
  return response.data;
};

// Settings API
export const getAccountingSettings = async () => {
  const response = await axios.get('/api/settings/accounting');
  return response.data;
};

export const updateAccountingSettings = async (data) => {
  const response = await axios.put('/api/settings/accounting', data);
  return response.data;
};
