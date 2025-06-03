import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Send as SendIcon, Trash2, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { campaignService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaigns();
  }, [page, search]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAll(page, 10, search);
      setCampaigns(response.data);
      setTotalPages(response.pagination.pages);
      setLoading(false);
    } catch (err) {
      // console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSendCampaign = async (id) => {
    if (window.confirm('Are you sure you want to send this campaign now? This action cannot be undone.')) {
      try {
        // Optionally show a loading state here
        
        const response = await campaignService.send(id);
        
        if (response.success) {
          // Instead of updating a single campaign, refetch the entire list
          fetchCampaigns(); // This will refresh all campaigns, including the one just sent
        } else {
          // Handle cases where backend indicates failure but doesn't throw an error
          alert(response.message || 'Failed to send campaign');
        }
        
        // Optionally hide loading state here
        
      } catch (err) {
        console.error('Error sending campaign:', err);
        alert(err.message || 'Failed to send campaign');
        // Optionally hide loading state here
      }
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignService.delete(id);
        setCampaigns(campaigns.filter(campaign => campaign._id !== id));
      } catch (err) {
        console.error('Error deleting campaign:', err);
        alert('Failed to delete campaign');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const campaignRows = campaigns.length === 0 ? (
    <tr key="no-campaigns">
      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
        No campaigns found. Create your first campaign now!
      </td>
    </tr>
  ) : (
    campaigns.map((campaign) => (
      <tr key={campaign._id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
          {/* <div className="text-sm text-gray-500">{campaign.description}</div> */}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
            campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
            campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {(campaign.status || 'draft').charAt(0).toUpperCase() + (campaign.status || 'draft').slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {campaign.targetAudience}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {campaign.status === 'sent' ? (
            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-500" />
                {campaign.delivered} delivered
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={16} className="text-red-500" />
                {campaign.failed} failed
              </div>
            </div>
          ) : campaign.status === 'scheduled' ? (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={16} />
              Scheduled for {formatDate(campaign.scheduledFor)}
            </div>
          ) : null}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {campaign.status === 'sent' ? formatDate(campaign.sentAt) : formatDate(campaign.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <Link
              to={`/campaigns/${campaign._id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <Eye size={20} />
            </Link>
            {campaign.status === 'draft' && (
              <button
                onClick={() => handleSendCampaign(campaign._id)}
                className="text-green-600 hover:text-green-900"
              >
                <SendIcon size={20} />
              </button>
            )}
            <button
              onClick={() => handleDeleteCampaign(campaign._id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </td>
      </tr>
    ))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <div className="flex gap-2">
          {/* <Link
            to="/campaigns/history"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300"
          >
            History
          </Link> */}
          <Link
            to="/campaigns/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Create Campaign
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audience Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaignRows}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Campaigns;