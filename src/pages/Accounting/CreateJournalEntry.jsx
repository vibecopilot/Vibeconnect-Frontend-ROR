import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJournalEntry, getLedgers } from '../../api/accounting';
import AccountingNavbar from '../../components/navbars/AccountingNavbar';
import Navbar from '../../components/Navbar';

const CreateJournalEntry = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ledgers, setLedgers] = useState([]);
  const [formData, setFormData] = useState({
    entry_number: '',
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
    site_id: '',
    reference_type: '',
    reference_id: '',
    lines: [
      { ledger_id: '', debit_amount: 0, credit_amount: 0, description: '' },
      { ledger_id: '', debit_amount: 0, credit_amount: 0, description: '' }
    ]
  });

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      const data = await getLedgers({});
      setLedgers(data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    
    // If changing debit, clear credit and vice versa
    if (field === 'debit_amount' && parseFloat(value) > 0) {
      newLines[index].credit_amount = 0;
    } else if (field === 'credit_amount' && parseFloat(value) > 0) {
      newLines[index].debit_amount = 0;
    }
    
    setFormData(prev => ({
      ...prev,
      lines: newLines
    }));
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { ledger_id: '', debit_amount: 0, credit_amount: 0, description: '' }]
    }));
  };

  const removeLine = (index) => {
    if (formData.lines.length <= 2) {
      alert('Journal entry must have at least 2 lines');
      return;
    }
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + parseFloat(line.debit_amount || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + parseFloat(line.credit_amount || 0), 0);
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  };

  const isBalanced = () => {
    const { difference } = calculateTotals();
    return Math.abs(difference) < 0.01; // Allow for small rounding differences
  };

  const handleSubmit = async (status) => {
    if (!formData.entry_date) {
      alert('Please enter entry date');
      return;
    }

    if (status === 'posted' && !isBalanced()) {
      alert('Journal entry must be balanced (total debits must equal total credits)');
      return;
    }

    if (formData.lines.some(line => !line.ledger_id)) {
      alert('Please select ledger for all lines');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        status,
        total_debit: calculateTotals().totalDebit,
        total_credit: calculateTotals().totalCredit
      };
      
      await createJournalEntry(payload);
      alert(`Journal entry ${status === 'posted' ? 'posted' : 'saved as draft'} successfully`);
      navigate('/accounting/journal-entries');
    } catch (error) {
      console.error('Error creating journal entry:', error);
      alert('Failed to create journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <AccountingNavbar />
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/accounting/journal-entries')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Create Journal Entry</h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="entry_number"
                  value={formData.entry_number}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="entry_date"
                  value={formData.entry_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                <select
                  name="site_id"
                  value={formData.site_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Site</option>
                  {/* Add site options */}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter journal entry description"
              />
            </div>

            {/* Journal Lines */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Journal Lines</h2>
                <button
                  onClick={addLine}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Line
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-1/3">Account</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-1/4">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-1/6">Debit</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-1/6">Credit</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lines.map((line, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4">
                          <select
                            value={line.ledger_id}
                            onChange={(e) => handleLineChange(index, 'ledger_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Account</option>
                            {ledgers.map(ledger => (
                              <option key={ledger.id} value={ledger.id}>
                                {ledger.ledger_name} ({ledger.account_group_name})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={line.description}
                            onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Line description"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={line.debit_amount}
                            onChange={(e) => handleLineChange(index, 'debit_amount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={line.credit_amount}
                            onChange={(e) => handleLineChange(index, 'credit_amount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {formData.lines.length > 2 && (
                            <button
                              onClick={() => removeLine(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan="2" className="py-3 px-4 text-right text-gray-700">Total:</td>
                      <td className="py-3 px-4 text-right text-gray-900">₹{totalDebit.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-900">₹{totalCredit.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    {difference !== 0 && (
                      <tr>
                        <td colSpan="2" className="py-3 px-4 text-right text-red-600">Difference:</td>
                        <td colSpan="2" className="py-3 px-4 text-right text-red-600">
                          ₹{Math.abs(difference).toFixed(2)} {difference > 0 ? '(Debit excess)' : '(Credit excess)'}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              {!isBalanced() && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Warning: Total debits and credits must be equal to post this entry.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => navigate('/accounting/journal-entries')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={() => handleSubmit('posted')}
                disabled={loading || !isBalanced()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Posting...' : 'Post Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateJournalEntry;
