import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OpportunityForm from '../components/OpportunityForm';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const { data } = await api.get(`/opportunities/${id}`);
        const opp = data.opportunity;

        // Frontend ownership guard — backend also enforces this
        if (opp.owner?._id !== user?._id) {
          toast.error('You can only edit your own opportunities');
          navigate('/dashboard');
          return;
        }

        setOpportunity(opp);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load opportunity';
        toast.error(msg);
        navigate('/dashboard');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    setSaveLoading(true);
    try {
      await api.put(`/opportunities/${id}`, formData);
      toast.success('Opportunity updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update opportunity';
      toast.error(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  if (fetchLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Edit Opportunity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Editing: <span className="font-medium text-gray-700">{opportunity.customerName}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <OpportunityForm
            initialData={opportunity}
            onSubmit={handleSubmit}
            loading={saveLoading}
            submitLabel="Update Opportunity"
          />
        </div>
      </main>
    </div>
  );
};

export default EditOpportunity;
