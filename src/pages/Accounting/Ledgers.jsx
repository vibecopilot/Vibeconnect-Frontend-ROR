import { useState, useEffect } from 'react';
import { getLedgers, getAccountGroups, deleteLedger } from '../../api/accounting';
import CreateLedgerModal from './CreateLedgerModal';
import AccountingNavbar from '../../components/navbars/AccountingNavbar';
import Navbar from '../../components/Navbar';

const Ledgers = () => {
  const [ledgers, setLedgers] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    site_id: '',
    account_group_id: '',
    search: ''
  });
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ledgersData, groupsData] = await Promise.all([
        getLedgers(filters),
        getAccountGroups(filters.site_id)
      ]);
      setLedgers(ledgersData);
      setAccountGroups(groupsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ledger?')) {
      try {
        await deleteLedger(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting ledger:', error);
        alert('Failed to delete ledger. It may have transactions.');
      }
    }
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const groupLedgersByAccount = () => {
    const grouped = {};
    accountGroups.forEach(group => {
      grouped[group.id] = {
        ...group,
        ledgers: ledgers.filter(l => l.account_group_id === group.id)
      };
    });
    return grouped;
  };

  const groupedLedgers = groupLedgersByAccount();

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <AccountingNavbar />
        <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Ledgers & Account Groups</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ledger
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Ledger name or code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Group</label>
            <select
              value={filters.account_group_id}
              onChange={(e) => setFilters(prev => ({ ...prev, account_group_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Groups</option>
              {accountGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
            <select
              value={filters.site_id}
              onChange={(e) => setFilters(prev => ({ ...prev, site_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {/* Add site options dynamically */}
            </select>
          </div>
        </div>
      </div>

      {/* Ledgers Tree View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="p-6">
            {Object.values(groupedLedgers).map(group => (
              <div key={group.id} className="mb-4">
                <div
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedGroups[group.id] ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {group.ledgers.length} Ledgers
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 capitalize">{group.group_type}</span>
                </div>

                {expandedGroups[group.id] && (
                  <div className="mt-2 ml-8">
                    {group.ledgers.length === 0 ? (
                      <p className="text-gray-500 py-4">No ledgers in this group</p>
                    ) : (
                      <div className="space-y-2">
                        {group.ledgers.map(ledger => (
                          <div
                            key={ledger.id}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-medium text-gray-800">{ledger.name}</h4>
                                {ledger.code && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {ledger.code}
                                  </span>
                                )}
                                {!ledger.active && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {ledger.description && (
                                <p className="text-sm text-gray-600 mt-1">{ledger.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Current Balance</p>
                                <p className={`text-lg font-semibold ${ledger.current_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(ledger.current_balance)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => window.location.href = `/accounting/ledgers/${ledger.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Statement"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(ledger.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ledger Modal */}
      {showCreateModal && (
        <CreateLedgerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
          accountGroups={accountGroups}
        />
      )}
        </div>
      </div>
    </section>
  );
};

export default Ledgers;
