import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const STAGE_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-purple-100 text-purple-700',
  'Proposal Sent': 'bg-orange-100 text-orange-700',
  Won: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
};

const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-600',
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value || '—'}</p>
  </div>
);

const ViewOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const { data } = await api.get(`/opportunities/${id}`);
        setOpportunity(data.opportunity);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load opportunity');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${opportunity.customerName}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/opportunities/${id}`);
      toast.success('Opportunity deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
      setDeleting(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (!opportunity) return null;

  const isOwner = user?._id === opportunity.owner?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{opportunity.customerName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created by <span className="font-medium">{opportunity.owner?.name}</span> on{' '}
              {formatDate(opportunity.createdAt)}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                to={`/opportunities/${id}/edit`}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Stage + Priority badges */}
        <div className="flex gap-3 mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STAGE_COLORS[opportunity.stage] || 'bg-gray-100 text-gray-600'}`}>
            {opportunity.stage}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[opportunity.priority] || 'bg-gray-100 text-gray-600'}`}>
            {opportunity.priority} Priority
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* Requirement */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Requirement Summary</p>
            <p className="text-sm text-gray-800 leading-relaxed">{opportunity.requirement}</p>
          </div>

          <hr className="border-gray-100" />

          {/* Contact Info */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contact Person" value={opportunity.contactName} />
              <Field label="Contact Email" value={opportunity.contactEmail} />
              <Field label="Contact Phone" value={opportunity.contactPhone} />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Deal Info */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Deal Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Estimated Value"
                value={opportunity.estimatedValue ? `₹${Number(opportunity.estimatedValue).toLocaleString('en-IN')}` : null}
              />
              <Field label="Next Follow-up" value={formatDate(opportunity.nextFollowUpDate)} />
              <Field label="Last Updated" value={formatDate(opportunity.updatedAt)} />
            </div>
          </div>

          {opportunity.notes && (
            <>
              <hr className="border-gray-100" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.notes}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewOpportunity;
