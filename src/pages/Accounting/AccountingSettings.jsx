import { useState, useEffect } from 'react';
import { getTaxRates, createTaxRate, updateTaxRate, deleteTaxRate } from '../../api/accounting';
import AccountingNavbar from '../../components/navbars/AccountingNavbar';
import Navbar from '../../components/Navbar';

const AccountingSettings = () => {
  const [activeTab, setActiveTab] = useState('tax-rates');
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [taxFormData, setTaxFormData] = useState({
    name: '',
    rate: 0,
    tax_type: 'GST',
    site_id: '',
    active: true
  });

  useEffect(() => {
    if (activeTab === 'tax-rates') {
      fetchTaxRates();
    }
  }, [activeTab]);

  const fetchTaxRates = async () => {
    setLoading(true);
    try {
      const data = await getTaxRates();
      setTaxRates(data);
    } catch (error) {
      console.error('Error fetching tax rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTax = async (e) => {
    e.preventDefault();
    try {
      if (editingTax) {
        await updateTaxRate(editingTax.id, taxFormData);
      } else {
        await createTaxRate(taxFormData);
      }
      setShowTaxModal(false);
      setEditingTax(null);
      setTaxFormData({ name: '', rate: 0, tax_type: 'GST', site_id: '', active: true });
      fetchTaxRates();
    } catch (error) {
      console.error('Error saving tax rate:', error);
      alert('Failed to save tax rate');
    }
  };

  const handleEditTax = (tax) => {
    setEditingTax(tax);
    setTaxFormData({
      name: tax.name,
      rate: tax.rate,
      tax_type: tax.tax_type,
      site_id: tax.site_id || '',
      active: tax.active
    });
    setShowTaxModal(true);
  };

  const handleDeleteTax = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax rate?')) {
      try {
        await deleteTaxRate(id);
        fetchTaxRates();
      } catch (error) {
        console.error('Error deleting tax rate:', error);
        alert('Failed to delete tax rate');
      }
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <AccountingNavbar />
        <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Accounting Settings</h1>
        <p className="text-gray-600 mt-2">Configure tax rates and accounting preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tax-rates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'tax-rates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Tax Rates
            </button>
            <button
              onClick={() => setActiveTab('account-config')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'account-config'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Account Configuration
            </button>
            <button
              onClick={() => setActiveTab('invoice-settings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'invoice-settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Invoice Settings
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tax Rates Tab */}
          {activeTab === 'tax-rates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Tax Rates</h2>
                <button
                  onClick={() => {
                    setEditingTax(null);
                    setTaxFormData({ name: '', rate: 0, tax_type: 'GST', site_id: '', active: true });
                    setShowTaxModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Tax Rate
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rate (%)</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Site</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRates.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500">
                            No tax rates configured
                          </td>
                        </tr>
                      ) : (
                        taxRates.map((tax) => (
                          <tr key={tax.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">{tax.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{tax.rate}%</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{tax.tax_type}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{tax.site_name || 'All Sites'}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                tax.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {tax.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditTax(tax)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTax(tax.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Account Configuration Tab */}
          {activeTab === 'account-config' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Default Account Mappings</h2>
              <div className="space-y-4">
                <p className="text-gray-600">Configure default ledger accounts for automated journal entries.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Sales Income', 'Purchase Expense', 'Cash Account', 'Bank Account', 'Accounts Receivable', 'Accounts Payable', 'Tax Payable'].map((account) => (
                    <div key={account} className="border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{account}</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Ledger</option>
                        {/* Add ledger options */}
                      </select>
                    </div>
                  ))}
                </div>
                <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* Invoice Settings Tab */}
          {activeTab === 'invoice-settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Invoice Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Invoice Number Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                      <input
                        type="text"
                        defaultValue="INV"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Starting Number</label>
                      <input
                        type="number"
                        defaultValue="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reset Period</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="never">Never</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Terms (Days)</label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tax Rate Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTax ? 'Edit Tax Rate' : 'Add Tax Rate'}
              </h2>
              <button
                onClick={() => {
                  setShowTaxModal(false);
                  setEditingTax(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveTax} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={taxFormData.name}
                    onChange={(e) => setTaxFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., GST 18%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    max="100"
                    value={taxFormData.rate}
                    onChange={(e) => setTaxFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type *</label>
                  <select
                    required
                    value={taxFormData.tax_type}
                    onChange={(e) => setTaxFormData(prev => ({ ...prev, tax_type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GST">GST</option>
                    <option value="CGST">CGST</option>
                    <option value="SGST">SGST</option>
                    <option value="IGST">IGST</option>
                    <option value="VAT">VAT</option>
                    <option value="TDS">TDS</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tax-active"
                    checked={taxFormData.active}
                    onChange={(e) => setTaxFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="tax-active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaxModal(false);
                    setEditingTax(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTax ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </section>
  );
};

export default AccountingSettings;
