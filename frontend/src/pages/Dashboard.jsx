import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const STAGES = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-5`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ stage: 'All', priority: 'All', search: '' });
  const [deleteModal, setDeleteModal] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.stage !== 'All') params.stage = filters.stage;
      if (filters.priority !== 'All') params.priority = filters.priority;
      if (filters.search.trim()) params.search = filters.search.trim();

      const { data } = await api.get('/opportunities', { params });
      setOpportunities(data.opportunities);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchOpportunities, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchOpportunities]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/opportunities/${deleteModal.id}`);
      toast.success('Opportunity deleted');
      setOpportunities((prev) => prev.filter((o) => o._id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  // Summary stats
  const total = opportunities.length;
  const pipelineValue = opportunities.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);
  const wonCount = opportunities.filter((o) => o.stage === 'Won').length;
  const highPriority = opportunities.filter((o) => o.priority === 'High').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Total Opportunities" value={total} color="border-indigo-500" />
          <SummaryCard
            label="Pipeline Value"
            value={`₹${pipelineValue.toLocaleString('en-IN')}`}
            color="border-green-500"
          />
          <SummaryCard label="Won Deals" value={wonCount} color="border-emerald-500" />
          <SummaryCard label="High Priority" value={highPriority} color="border-red-500" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />

          <select
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>

          {(filters.stage !== 'All' || filters.priority !== 'All' || filters.search) && (
            <button
              onClick={() => setFilters({ stage: 'All', priority: 'All', search: '' })}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No opportunities found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filters.search || filters.stage !== 'All' || filters.priority !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Create your first opportunity to get started'}
              </p>
              <button
                onClick={() => navigate('/opportunities/new')}
                className="mt-4 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + New Opportunity
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Customer', 'Requirement', 'Value', 'Stage', 'Priority', 'Owner', 'Follow-up', 'Created', 'Actions'].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <OpportunityCard
                      key={opp._id}
                      opportunity={opp}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Opportunity?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-700">"{deleteModal.name}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
