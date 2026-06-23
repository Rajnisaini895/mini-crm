import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OpportunityForm from '../components/OpportunityForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.post('/opportunities', formData);
      toast.success('Opportunity created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create opportunity';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800 mt-3">New Opportunity</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new sales opportunity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <OpportunityForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Create Opportunity"
          />
        </div>
      </main>
    </div>
  );
};

export default CreateOpportunity;
