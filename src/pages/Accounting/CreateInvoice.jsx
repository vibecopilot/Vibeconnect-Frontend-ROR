import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice, getTaxRates } from '../../api/accounting';
import AccountingNavbar from '../../components/navbars/AccountingNavbar';
import Navbar from '../../components/Navbar';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    site_id: '',
    unit_id: '',
    customer_id: '',
    vendor_id: '',
    invoice_type: 'sales',
    notes: '',
    items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate_id: '',
        amount: 0,
        tax_amount: 0,
        total_amount: 0
      }
    ]
  });

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = async () => {
    try {
      const data = await getTaxRates({ active: true });
      setTaxRates(data);
    } catch (error) {
      console.error('Error fetching tax rates:', error);
    }
  };

  const calculateLineItem = (item) => {
    const amount = parseFloat(item.quantity) * parseFloat(item.unit_price);
    const taxRate = taxRates.find(t => t.id === parseInt(item.tax_rate_id));
    const taxAmount = taxRate ? (amount * taxRate.rate) / 100 : 0;
    const totalAmount = amount + taxAmount;

    return {
      ...item,
      amount: amount.toFixed(2),
      tax_amount: taxAmount.toFixed(2),
      total_amount: totalAmount.toFixed(2)
    };
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate amounts
    updatedItems[index] = calculateLineItem(updatedItems[index]);
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate_id: '',
        amount: 0,
        tax_amount: 0,
        total_amount: 0
      }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);
    const total = subtotal + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totals = calculateTotals();
      const invoiceData = {
        ...formData,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total_amount: totals.total,
        balance_amount: totals.total,
        status: 'draft'
      };

      await createInvoice(invoiceData);
      alert('Invoice created successfully!');
      navigate('/accounting/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
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

  const totals = calculateTotals();

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
            onClick={() => navigate('/accounting/invoices')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-6">
          {[
            { num: 1, label: 'Basic Details' },
            { num: 2, label: 'Line Items' },
            { num: 3, label: 'Review & Submit' }
          ].map((step) => (
            <div key={step.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.num}
              </div>
              <span className={`ml-2 font-medium ${
                currentStep >= step.num ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
              {step.num < 3 && (
                <svg className="w-6 h-6 mx-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.invoice_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sales">Sales</option>
                  <option value="purchase">Purchase</option>
                  <option value="service">Service</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.invoice_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.site_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Site</option>
                  {/* Add site options */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit (Optional)
                </label>
                <select
                  value={formData.unit_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Unit</option>
                  {/* Add unit options */}
                </select>
              </div>

              {formData.invoice_type === 'sales' || formData.invoice_type === 'service' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer</option>
                    {/* Add customer options */}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                  </label>
                  <select
                    value={formData.vendor_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendor_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vendor</option>
                    {/* Add vendor options */}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Line Items
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Line Items */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Line Items</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-700">Item #{index + 1}</h3>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Item description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate</label>
                      <select
                        value={item.tax_rate_id}
                        onChange={(e) => handleItemChange(index, 'tax_rate_id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">No Tax</option>
                        {taxRates.map(tax => (
                          <option key={tax.id} value={tax.id}>
                            {tax.name} ({tax.rate}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                      <input
                        type="text"
                        value={formatCurrency(item.total_amount)}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
                <div className="text-gray-700 font-medium">Subtotal:</div>
                <div className="text-right font-semibold">{formatCurrency(totals.subtotal)}</div>
                
                <div className="text-gray-700 font-medium">Tax Amount:</div>
                <div className="text-right font-semibold">{formatCurrency(totals.taxAmount)}</div>
                
                <div className="text-gray-900 font-bold text-lg pt-2 border-t-2 border-gray-300">Total:</div>
                <div className="text-right font-bold text-lg pt-2 border-t-2 border-gray-300 text-blue-600">
                  {formatCurrency(totals.total)}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Review & Submit</h2>
            
            <div className="space-y-6">
              {/* Invoice Details */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">Type:</div>
                  <div className="font-medium capitalize">{formData.invoice_type}</div>
                  
                  <div className="text-gray-600">Invoice Date:</div>
                  <div className="font-medium">{formData.invoice_date}</div>
                  
                  <div className="text-gray-600">Due Date:</div>
                  <div className="font-medium">{formData.due_date}</div>
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Items ({formData.items.length})</h3>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span className="font-medium">{formatCurrency(item.total_amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Invoice...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        )}
      </form>
        </div>
      </div>
    </section>
  );
};

export default CreateInvoice;
