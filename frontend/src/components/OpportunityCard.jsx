import { Link } from 'react-router-dom';
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

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const formatValue = (val) =>
  val ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

const OpportunityCard = ({ opportunity, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === opportunity.owner?._id;

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 text-sm">{opportunity.customerName}</div>
        {opportunity.contactName && (
          <div className="text-xs text-gray-500 mt-0.5">{opportunity.contactName}</div>
        )}
      </td>

      <td className="px-4 py-3 max-w-[180px]">
        <p className="text-sm text-gray-700 line-clamp-2">{opportunity.requirement}</p>
      </td>

      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
        {formatValue(opportunity.estimatedValue)}
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[opportunity.stage] || 'bg-gray-100 text-gray-600'}`}>
          {opportunity.stage}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[opportunity.priority] || 'bg-gray-100 text-gray-600'}`}>
          {opportunity.priority}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        <div>{opportunity.owner?.name || '—'}</div>
        {isOwner && (
          <span className="text-xs text-indigo-500 font-medium">You</span>
        )}
      </td>

      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(opportunity.nextFollowUpDate)}
      </td>

      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(opportunity.createdAt)}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/opportunities/${opportunity._id}`}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View
          </Link>
          {/* Edit and Delete only shown to owner — backend ALSO validates */}
          {isOwner && (
            <>
              <Link
                to={`/opportunities/${opportunity._id}/edit`}
                className="text-xs text-amber-600 hover:text-amber-800 font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(opportunity._id, opportunity.customerName)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OpportunityCard;
