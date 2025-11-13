import { useState } from 'react';
import { getTrialBalance } from '../../../api/accounting';
import AccountingNavbar from '../../../components/navbars/AccountingNavbar';
import Navbar from '../../../components/Navbar';

const TrialBalanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    site_id: '',
    date_from: '',
    date_to: ''
  });

  const generateReport = async () => {
    if (!filters.date_from || !filters.date_to) {
      alert('Please select date range');
      return;
    }

    setLoading(true);
    try {
      const data = await getTrialBalance(filters);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const exportToPDF = () => {
    window.print();
  };

  const groupAccountsByType = () => {
    if (!reportData?.accounts) return {};
    
    const grouped = {
      asset: [],
      liability: [],
      equity: [],
      revenue: [],
      expense: []
    };

    reportData.accounts.forEach(account => {
      const type = account.account_type?.toLowerCase();
      if (grouped[type]) {
        grouped[type].push(account);
      }
    });

    return grouped;
  };

  const groupedAccounts = reportData ? groupAccountsByType() : {};

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <AccountingNavbar />
        <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Trial Balance Report</h1>
          <p className="text-gray-600 mt-1">Summary of all ledger balances</p>
        </div>
        {reportData && (
          <div className="flex gap-3">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / PDF
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
            <select
              value={filters.site_id}
              onChange={(e) => setFilters(prev => ({ ...prev, site_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {/* Add site options */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
            <input
              type="date"
              required
              value={filters.date_from}
              onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
            <input
              type="date"
              required
              value={filters.date_to}
              onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportData && (
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
          {/* Report Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <h2 className="text-2xl font-bold text-gray-800">Trial Balance Report</h2>
            <p className="text-gray-600 mt-2">
              {reportData.site_name ? `Site: ${reportData.site_name}` : 'All Sites'}
            </p>
            <p className="text-gray-600 mt-1">
              Period: {formatDate(filters.date_from)} to {formatDate(filters.date_to)}
            </p>
          </div>

          {/* Report Table */}
          {Object.entries(groupedAccounts).map(([type, accounts]) => (
            accounts.length > 0 && (
              <div key={type} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize bg-gray-100 p-3 rounded">
                  {type === 'asset' ? 'Assets' : 
                   type === 'liability' ? 'Liabilities' : 
                   type === 'equity' ? 'Equity' : 
                   type === 'revenue' ? 'Revenue' : 
                   'Expenses'}
                </h3>
                <table className="min-w-full mb-4">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ledger Name</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Opening Balance</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Debit</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Credit</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-700">{account.ledger_name}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">
                          {formatCurrency(account.opening_balance || 0)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">
                          {formatCurrency(account.debit || 0)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">
                          {formatCurrency(account.credit || 0)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-gray-800">
                          {formatCurrency(account.closing_balance || 0)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        Total {type === 'asset' ? 'Assets' : 
                               type === 'liability' ? 'Liabilities' : 
                               type === 'equity' ? 'Equity' : 
                               type === 'revenue' ? 'Revenue' : 
                               'Expenses'}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-800">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.opening_balance || 0), 0))}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-800">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.debit || 0), 0))}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-800">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.credit || 0), 0))}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-800">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.closing_balance || 0), 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          ))}

          {/* Grand Totals */}
          <div className="mt-8 border-t-4 border-gray-400 pt-6">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Grand Total</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-800">-</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-800">
                    {formatCurrency(reportData.totals?.total_debit || 0)}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-800">
                    {formatCurrency(reportData.totals?.total_credit || 0)}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-800">-</th>
                </tr>
              </thead>
            </table>
            {reportData.totals?.difference !== 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ⚠️ Warning: Trial balance is not balanced. Difference: {formatCurrency(reportData.totals?.difference || 0)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!reportData && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">Select date range and click Generate Report</p>
        </div>
      )}
        </div>
      </div>
    </section>
  );
};

export default TrialBalanceReport;
