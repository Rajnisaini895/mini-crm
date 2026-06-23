import { useState } from 'react';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const OpportunityForm = ({ initialData = {}, onSubmit, loading, submitLabel = 'Save' }) => {
  const [form, setForm] = useState({
    customerName: initialData.customerName || '',
    contactName: initialData.contactName || '',
    contactEmail: initialData.contactEmail || '',
    contactPhone: initialData.contactPhone || '',
    requirement: initialData.requirement || '',
    estimatedValue: initialData.estimatedValue ?? '',
    stage: initialData.stage || 'New',
    priority: initialData.priority || 'Medium',
    nextFollowUpDate: initialData.nextFollowUpDate
      ? new Date(initialData.nextFollowUpDate).toISOString().split('T')[0]
      : '',
    notes: initialData.notes || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    if (!form.requirement.trim()) e.requirement = 'Requirement is required';
    if (form.estimatedValue !== '' && Number(form.estimatedValue) < 0)
      e.estimatedValue = 'Value must be non-negative';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      e.contactEmail = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (payload.estimatedValue === '') payload.estimatedValue = 0;
    else payload.estimatedValue = Number(payload.estimatedValue);
    if (!payload.nextFollowUpDate) delete payload.nextFollowUpDate;
    onSubmit(payload);
  };

  const field = (label, name, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          errors[name] ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Customer / Company Name', 'customerName', 'text', true)}
        {field('Contact Person', 'contactName')}
        {field('Contact Email', 'contactEmail', 'email')}
        {field('Contact Phone', 'contactPhone', 'tel')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requirement Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          name="requirement"
          value={form.requirement}
          onChange={handleChange}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.requirement ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors.requirement && <p className="text-red-500 text-xs mt-1">{errors.requirement}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value (₹)</label>
          <input
            type="number"
            name="estimatedValue"
            value={form.estimatedValue}
            onChange={handleChange}
            min="0"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.estimatedValue ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.estimatedValue && <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
        <input
          type="date"
          name="nextFollowUpDate"
          value={form.nextFollowUpDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default OpportunityForm;
