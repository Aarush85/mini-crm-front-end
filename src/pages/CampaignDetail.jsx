import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Send as SendIcon, 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCampaignDetails(id);
  }, [id]);

  const fetchCampaignDetails = async (campaignId) => {
    try {
      setLoading(true);
      const response = await campaignService.getById(campaignId);
      setCampaign(response.data);
      setLoading(false);
    } catch (err) {
      // console.error('Error fetching campaign details:', err);
      setError('Failed to load campaign details');
      setLoading(false);
    }
  };

  const handleSendCampaign = async () => {
    if (window.confirm('Are you sure you want to send this campaign now? This action cannot be undone.')) {
      try {
        setSending(true);
        const response = await campaignService.send(id);
        
        if (response.success) {
          // Refresh campaign details to get updated status
          await fetchCampaignDetails(id);
        } else {
          throw new Error(response.message || 'Failed to send campaign');
        }
        
        setSending(false);
      } catch (err) {
        // console.error('Error sending campaign:', err);
        alert(err.message || 'Failed to send campaign');
        // Optionally hide loading state here
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        await campaignService.delete(id);
        navigate('/campaigns');
      } catch (err) {
        // console.error('Error deleting campaign:', err);
        alert('Failed to delete campaign');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/campaigns/${id}/edit`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Campaign not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/campaigns" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Details</h1>
        </div>
        
        <div className="flex space-x-2">
          {campaign.status === 'draft' && (
            <>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </button>
              <button
                onClick={handleSendCampaign}
                disabled={sending}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <SendIcon className="h-4 w-4 mr-1.5" />
                {sending ? 'Sending...' : 'Send Now'}
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Campaign Overview Card */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm text-gray-900">{campaign.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(campaign.createdAt)}</p>
            </div>
            {campaign.sentAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sent</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(campaign.sentAt)}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Target Audience</h3>
              <p className="mt-1 text-sm text-gray-900">{campaign.targetAudience} customers</p>
            </div>
            {campaign.status === 'sent' && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
                  <p className="mt-1 text-sm text-gray-900">{campaign.delivered} emails</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Failed</h3>
                  <p className="mt-1 text-sm text-gray-900">{campaign.failed} emails</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Message */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Message</h2>
        </div>
        <div className="p-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-900">{campaign.message}</pre>
          </div>
        </div>
      </div>

      {/* Segment Rules */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Segment Rules</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {campaign.segmentRules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {rule.field} {rule.operator} {rule.value}
                  </p>
                </div>
                {index < campaign.segmentRules.length - 1 && (
                  <div className="text-sm text-gray-500">
                    {rule.logicOperator}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetail;