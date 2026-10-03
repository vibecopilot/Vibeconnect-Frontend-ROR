import axios from './axiosInstance';
import { getItemInLocalStorage } from "../utils/localStorage";

// Account Groups API
export const getAccountGroups = async (siteId = null) => {
  const params = siteId ? { site_id: siteId } : {};
  const response = await axios.get('/account_groups.json', { params });
  return response;
};

export const getAccountGroup = async (id) => {
  const response = await axios.get(`/account_groups/${id}.json`);
  return response;
};

export const createAccountGroup = async (data) => {
  const response = await axios.post('/account_groups.json', data);
  return response;
};

export const updateAccountGroup = async (id, data) => {
  const response = await axios.put(`/account_groups/${id}.json`, data);
  return response;
};

export const deleteAccountGroup = async (id) => {
  const response = await axios.delete(`/account_groups/${id}.json`);
  return response;
};

export const seedDefaultAccountGroups = async () => {
  const response = await axios.post('/account_groups/seed_defaults.json');
  return response;
};

// Ledgers API
export const getLedgers = async (params = {}) => {
  const response = await axios.get('/ledgers.json', { params });
  return response;
};

export const getLedger = async (id) => {
  const response = await axios.get(`/ledgers/${id}.json`);
  return response;
};

export const createLedger = async (data) => {
  const response = await axios.post('/ledgers.json', data);
  return response;
};

export const updateLedger = async (id, data) => {
  const response = await axios.put(`/ledgers/${id}.json`, data);
  return response;
};

export const deleteLedger = async (id) => {
  const response = await axios.delete(`/ledgers/${id}.json`);
  return response;
};

export const getLedgerTransactions = async (id, params = {}) => {
  const response = await axios.get(`/ledgers/${id}/transactions.json`, { params });
  return response;
};

export const getLedgerBalanceSheet = async (id) => {
  const response = await axios.get(`/ledgers/${id}/balance_sheet.json`);
  return response;
};

export const seedDefaultLedgers = async () => {
  const response = await axios.post('/ledgers/seed_defaults.json');
  return response;
};

export const getLedgersByGroup = async (params = {}) => {
  const response = await axios.get('/ledgers/by_group.json', { params });
  return response;
};

// Tax Rates API
export const getTaxRates = async (params = {}) => {
  const response = await axios.get('/tax_rates.json', { params });
  return response;
};

export const getTaxRate = async (id) => {
  const response = await axios.get(`/tax_rates/${id}.json`);
  return response;
};

export const createTaxRate = async (data) => {
  const response = await axios.post('/tax_rates.json', data);
  return response;
};

export const updateTaxRate = async (id, data) => {
  const response = await axios.put(`/tax_rates/${id}.json`, data);
  return response;
};

export const deleteTaxRate = async (id) => {
  const response = await axios.delete(`/tax_rates/${id}.json`);
  return response;
};

export const seedDefaultTaxRates = async () => {
  const response = await axios.post('/tax_rates/seed_defaults.json');
  return response;
};

export const getActiveTaxRates = async () => {
  const response = await axios.get('/tax_rates/active.json');
  return response;
};

// Accounting Invoices API
export const getAccountingInvoices = async (params = {}) => {
  const response = await axios.get('/accounting_invoices.json', { params });
  return response;
};

export const getAccountingInvoice = async (id) => {
  const response = await axios.get(`/accounting_invoices/${id}.json`);
  return response;
};

export const createAccountingInvoice = async (data) => {
  const response = await axios.post('/accounting_invoices.json', data);
  return response;
};

export const updateAccountingInvoice = async (id, data) => {
  const response = await axios.put(`/accounting_invoices/${id}.json`, data);
  return response;
};

export const deleteAccountingInvoice = async (id) => {
  const response = await axios.delete(`/accounting_invoices/${id}.json`);
  return response;
};

export const sendInvoice = async (id) => {
  const response = await axios.post(`/accounting_invoices/${id}/send_invoice.json`);
  return response;
};

export const addPaymentToInvoice = async (id, data) => {
  const response = await axios.post(`/accounting_invoices/${id}/add_payment.json`, data);
  return response;
};

export const getOverdueAccountingInvoices = async () => {
  const response = await axios.get('/accounting_invoices/overdue.json');
  return response;
};

export const getInvoicesByUnit = async (params = {}) => {
  const response = await axios.get('/accounting_invoices/by_unit.json', { params });
  return response;
};

export const getOverdueInvoices = async (params = {}) => {
  const response = await axios.get('/accounting_invoices/overdue.json', { params });
  return response;
};

// Legacy Invoice Functions (kept for backward compatibility with existing pages)
export const getInvoices = async (params = {}) => {
  const response = await axios.get('/invoices', { params });
  return response;
};

export const getInvoice = async (id) => {
  const response = await axios.get(`/invoices/${id}`);
  return response;
};

export const createInvoice = async (data) => {
  const response = await axios.post('/invoices', data);
  return response;
};

export const updateInvoice = async (id, data) => {
  const response = await axios.put(`/invoices/${id}`, data);
  return response;
};

export const deleteInvoice = async (id) => {
  const response = await axios.delete(`/invoices/${id}`);
  return response;
};

export const postInvoice = async (id) => {
  const response = await axios.post(`/invoices/${id}/post`);
  return response;
};

export const getUnitInvoices = async (unitId) => {
  const response = await axios.get(`/invoices/unit/${unitId}`);
  return response;
};

// Accounting Payments API
export const getAccountingPayments = async (params = {}) => {
  const response = await axios.get('/accounting_payments.json', { params });
  return response;
};

export const getAccountingPayment = async (id) => {
  const response = await axios.get(`/accounting_payments/${id}.json`);
  return response;
};

export const createAccountingPayment = async (data) => {
  const response = await axios.post('/accounting_payments.json', data);
  return response;
};

export const updateAccountingPayment = async (id, data) => {
  const response = await axios.put(`/accounting_payments/${id}.json`, data);
  return response;
};

export const deleteAccountingPayment = async (id) => {
  const response = await axios.delete(`/accounting_payments/${id}.json`);
  return response;
};

export const getPaymentsByInvoice = async (params = {}) => {
  const response = await axios.get('/accounting_payments/by_invoice.json', { params });
  return response;
};

// Legacy Payments Functions (kept for backward compatibility with existing pages)
export const getPayments = async (params = {}) => {
  const response = await axios.get('/payments', { params });
  return response;
};

export const getPayment = async (id) => {
  const response = await axios.get(`/payments/${id}`);
  return response;
};

export const createPayment = async (data) => {
  const response = await axios.post('/payments', data);
  return response;
};

export const updatePayment = async (id, data) => {
  const response = await axios.put(`/payments/${id}`, data);
  return response;
};

export const deletePayment = async (id) => {
  const response = await axios.delete(`/payments/${id}`);
  return response;
};

// Journal Entries API
export const getJournalEntries = async (params = {}) => {
  const response = await axios.get('/journal_entries.json', { params });
  return response;
};

export const getJournalEntry = async (id) => {
  const response = await axios.get(`/journal_entries/${id}.json`);
  return response;
};

export const createJournalEntry = async (data) => {
  const response = await axios.post('/journal_entries.json', data);
  return response;
};

export const updateJournalEntry = async (id, data) => {
  const response = await axios.put(`/journal_entries/${id}.json`, data);
  return response;
};

export const deleteJournalEntry = async (id) => {
  const response = await axios.delete(`/journal_entries/${id}.json`);
  return response;
};

export const postJournalEntry = async (id) => {
  const response = await axios.post(`/journal_entries/${id}/post.json`);
  return response;
};

export const cancelJournalEntry = async (id) => {
  const response = await axios.post(`/journal_entries/${id}/cancel.json`);
  return response;
};

// Accounting Reports API
export const getAccountingTrialBalance = async (params) => {
  const response = await axios.get('/accounting_reports/trial_balance.json', { params });
  return response;
};

export const getAccountingBalanceSheet = async (params) => {
  const response = await axios.get('/accounting_reports/balance_sheet.json', { params });
  return response;
};

export const getAccountingProfitLoss = async (params) => {
  const response = await axios.get('/accounting_reports/profit_and_loss.json', { params });
  return response;
};

export const getAccountingLedgerStatement = async (params) => {
  const response = await axios.get('/accounting_reports/ledger_statement.json', { params });
  return response;
};

export const getAccountingUnitStatement = async (params) => {
  const response = await axios.get('/accounting_reports/unit_statement.json', { params });
  return response;
};

export const getReceivablesSummary = async (params) => {
  const response = await axios.get('/accounting_reports/receivables_summary.json', { params });
  return response;
};

export const getTrialBalance = async (params) => {
  const response = await axios.get('/accounting_reports/trial_balance.json', { params });
  return response;
};

export const getBalanceSheet = async (params) => {
  const response = await axios.get('/accounting_reports/balance_sheet.json', { params });
  return response;
};

export const getLedgerStatement = async (params) => {
  const response = await axios.get('/accounting_reports/ledger_statement.json', { params });
  return response;
};

export const getUnitStatement = async (params) => {
  const response = await axios.get('/accounting_reports/unit_statement.json', { params });
  return response;
};

// Legacy Report Functions (kept for backward compatibility with existing pages)
export const getProfitLoss = async (params) => {
  const response = await axios.get('/reports/profit_loss', { params });
  return response;
};

export const getSiteSummary = async () => {
  const response = await axios.get('/reports/site_summary');
  return response;
};

// Settings API
export const getAccountingSettings = async () => {
  const response = await axios.get('/settings/accounting.json');
  return response;
};

export const updateAccountingSettings = async (data) => {
  const response = await axios.put('/settings/accounting.json', data);
  return response;
};

// =============================================================================
// The following functions are cloned from Myciti (project_coms) accountingApi.js
// to provide the full accounting feature set (CAM, MIS, dashboard, analytics,
// billing configurations, income entries, advanced reports, etc.)
// =============================================================================

// Bulk Journal Entries
export const bulkPostJournalEntries = (ids) => axios.post("/journal_entries/bulk_post.json", { journal_entry_ids: ids });

// Invoice extras
export const bulkSendInvoices = (ids) => axios.post("/accounting_invoices/bulk_send.json", { invoice_ids: ids });
export const downloadInvoicePdf = (id) => axios.get(`/accounting_invoices/${id}/download_pdf.json`, { responseType: 'blob' });
export const findInvoiceByNumber = (invoiceNumber) =>
    axios.get("/accounting_invoices/find_by_number.json", { params: { invoice_number: invoiceNumber } });
export const getAccountingPaymentById = (id) => axios.get(`/accounting_payments/${id}.json`);

// Advanced Reports
export const getUnitStatementDetailed = (params) => axios.get("/accounting_reports/unit_statement_detailed.json", { params });
export const getProfitAndLoss = (params) => axios.get("/accounting_reports/profit_and_loss.json", { params });

// PDF Exports
export const exportCamStatementPdf = (params) => axios.get("/cam_statement_pdf", { params, responseType: "blob" });

// Dashboard / Analytics
export const getAccountingDashboard = (params = {}) => {
  const token = getItemInLocalStorage("TOKEN");
  return axios.get("/accounting_reports/dashboard.json", {
    params: {
      ...(token ? { token } : {}),
      ...params,
    },
  });
};
export const getAccountingAnalytics = (params = {}) => {
  const token = getItemInLocalStorage("TOKEN");
  return axios.get("/accounting_reports/analytics.json", {
    params: {
      ...(token ? { token } : {}),
      ...params,
    },
  });
};

// MIS (Excel)
export const downloadExpensesMIS = (params) =>
  axios.get("/accounting_reports/expenses_mis.xlsx", { params, responseType: "blob" });
export const downloadIncomeMIS = (params) =>
  axios.get("/accounting_reports/income_mis.xlsx", { params, responseType: "blob" });
export const downloadIndividualMIS = (params) =>
  axios.get("/accounting_reports/individual_mis.xlsx", { params, responseType: "blob" });

export const importExpensesMIS = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getItemInLocalStorage("TOKEN");
  return axios.post("/accounting_reports/expenses_mis/import.json", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: token ? { token } : undefined,
  });
};

export const importIncomeMIS = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getItemInLocalStorage("TOKEN");
  return axios.post("/accounting_reports/income_mis/import.json", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: token ? { token } : undefined,
  });
};

export const importIndividualMIS = (file, year, month) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = getItemInLocalStorage("TOKEN");
  return axios.post('/accounting_reports/individual_mis/import.json', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { token, year, month },
  });
};

// CAM (Common Area Maintenance) - Society Maintenance APIs
export const getCamSettings = () => axios.get("/api/cam/settings");
export const upsertCamSettings = (data) => axios.post("/api/cam/settings", data);

export const getUnitCamConfigs = (params) => axios.get("/api/cam/unit_configs", { params });
export const createUnitCamConfig = (data) => axios.post("/api/cam/unit_configs", data);
export const updateUnitCamConfig = (id, data) => axios.put(`/api/cam/unit_configs/${id}`, data);
export const deleteUnitCamConfig = (id) => axios.delete(`/api/cam/unit_configs/${id}`);

export const getMonthlyExpenses = (params) => axios.get("/api/cam/monthly_expenses", { params });
export const createMonthlyExpense = (data) => axios.post("/api/cam/monthly_expenses", data);
export const updateMonthlyExpense = (id, data) => axios.put(`/api/cam/monthly_expenses/${id}`, data);
export const deleteMonthlyExpense = (id) => axios.delete(`/api/cam/monthly_expenses/${id}`);
export const getMonthlyExpensesTotal = (params) => axios.get("/api/cam/monthly_expenses/total", { params });

export const previewCamBills = (data) => axios.post("/api/cam/bills/preview", data);
export const generateCamBills = (data) => axios.post("/api/cam/bills/generate", data);
export const getCamBills = (params) => axios.get("/api/cam/bills", { params });
export const getCamBill = (id) => axios.get(`/api/cam/bills/${id}`);
export const downloadCamBillPdf = (params) => axios.get("/cam_statement_pdf", { params, responseType: "blob" });
export const sendCamBillEmail = (data) => axios.post("/api/cam/bills/send_email", data);
export const getCamBillDetails = (params) => axios.get("/api/cam/bills/details", { params });

export const recordAdvanceMaintenance = (data) => axios.post("/api/cam/advance_maintenances/generate", data);
export const getAdvanceMaintenances = (params) => axios.get("/api/cam/advance_maintenances", { params });

export const createTenantCharge = (data) => axios.post("/api/cam/tenant_charges", data);
export const getTenantCharges = (params) => axios.get("/api/cam/tenant_charges", { params });

export const getCamIncomeExpenseSummary = (params) => axios.get("/api/cam/income_expense_summary", { params });

export const recordAdvancePayment = (data) => axios.post("/accounting/advance-payments/record", data);
export const getAdvancePaymentStatus = (unitId) =>
    axios.get("/accounting/advance-payments/status", { params: { unit_id: unitId } });

export const invoiceTenantFee = (data) => axios.post("/accounting/tenant-fees/invoice", data);
export const getTenantFeeConfig = () => axios.get("/accounting/tenant-fees/config");

export const generateMonthlyCam = (period) =>
    axios.post("/accounting/cam/generate", null, { params: { period } });
export const getMonthlyCamSummary = (period) =>
    axios.get("/accounting/cam/summary", { params: { period } });

// Billing Configurations
export const getBillingConfigurations = () => axios.get("/billing_configurations.json");
export const getBillingConfiguration = (id) => axios.get(`/billing_configurations/${id}.json`);
export const createBillingConfiguration = (data) => axios.post("/billing_configurations.json", data);
export const updateBillingConfiguration = (id, data) => axios.put(`/billing_configurations/${id}.json`, data);
export const deleteBillingConfiguration = (id) => axios.delete(`/billing_configurations/${id}.json`);
export const uploadBillingLogo = (billingConfigId, formData) =>
    axios.post(`/billing_configurations/${billingConfigId}/upload_logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Income Entries
export const getIncomeEntries = (params) => axios.get("/income_entries.json", { params });
export const getIncomeEntry = (id) => axios.get(`/income_entries/${id}.json`);
export const createIncomeEntry = (data) => axios.post("/income_entries.json", data);
export const updateIncomeEntry = (id, data) => axios.put(`/income_entries/${id}.json`, data);
export const deleteIncomeEntry = (id) => axios.delete(`/income_entries/${id}.json`);
export const getReconciliationReport = (params) => axios.get("/income_entries/reconciliation_report.json", { params });

// Calculations
export const calculateMonthlyExpenseTotal = (params) => axios.get("/api/cam/monthly_expenses/total", { params });
export const calculateInterest = (data) => axios.post("/api/accounting/calculate-interest.json", data);
export const calculateIncomeTotal = (params) => axios.post("/api/accounting/calculate-income-total.json", params);

export const getMonthlyIncome = (params) => axios.get("/api/cam/monthly_income", { params });
export const getMonthlyIncomeTotal = (params) => axios.get("/api/cam/monthly_income/total", { params });

export const getDetailedIncomeSummary = (params) => axios.get("/api/cam/detailed_income_summary", { params });

// Backend calculations for Income & Expense Reports
export const calculateIncomeAllocation = (params) => axios.post("/api/cam/calculate_income_allocation", params);
export const calculateExpenseAllocation = (params) => axios.post("/api/cam/calculate_expense_allocation", params);
export const calculateIncomeVsExpense = (params) => axios.post("/api/cam/calculate_income_vs_expense", params);
export const getIncomeByCategory = (params) => axios.get("/api/cam/income_by_category", { params });
export const getExpenseByCategory = (params) => axios.get("/api/cam/expense_by_category", { params });
export const getDailyIncomeReport = (params) => axios.get("/api/cam/daily_income_report", { params });
export const getDailyExpenseReport = (params) => axios.get("/api/cam/daily_expense_report", { params });
export const getUnitWiseIncomeSummary = (params) => axios.get("/api/cam/unit_wise_income_summary", { params });
export const getUnitWiseExpenseSummary = (params) => axios.get("/api/cam/unit_wise_expense_summary", { params });
export const getUnitCamStatement = (params) => axios.get("/api/cam/unit_cam_statement", { params });
