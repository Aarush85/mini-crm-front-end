import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, X, Users, Sparkles } from 'lucide-react';
import { campaignService } from '../services/api';
import { toast } from 'react-hot-toast';

function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [targetAudience, setTargetAudience] = useState([]);
  const [audienceCount, setAudienceCount] = useState(0);
  const [previewingAudience, setPreviewingAudience] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    segmentRules: [{ field: 'tags', operator: 'equals', value: '', logicOperator: 'AND' }],
    message: '',
    scheduledFor: ''
  });

  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    // Reset audience preview when segment rules change
    setTargetAudience([]);
    setAudienceCount(0);
  }, [formData.segmentRules]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...formData.segmentRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setFormData({ ...formData, segmentRules: updatedRules });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      segmentRules: [
        ...formData.segmentRules,
        { field: 'name', operator: 'equals', value: '', logicOperator: 'AND' },
      ],
    });
  };

  const removeRule = (index) => {
    const updatedRules = [...formData.segmentRules];
    updatedRules.splice(index, 1);
    setFormData({ ...formData, segmentRules: updatedRules });
  };

  const previewAudience = async () => {
    try {
      setPreviewingAudience(true);
     const response = await campaignService.previewAudience(formData.segmentRules);
const { count, audience } = response.data || {};
setTargetAudience(Array.isArray(audience) ? audience.slice(0, 5) : []);
setAudienceCount(typeof count === 'number' ? count : 0);
      setPreviewingAudience(false);
    } catch (error) {
      // console.error('Error previewing audience:', error);
      setError('Failed to preview audience');
      setPreviewingAudience(false);
    }
  };

  const generateMessage = async () => {
    try {
      setIsGeneratingMessage(true);
      
      const audienceDescription = formData.segmentRules
        .map(rule => `${rule.field} ${rule.operator} ${rule.value}`)
        .join(' AND ');

      const response = await campaignService.generateMessage(aiPrompt, audienceDescription);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          message: response.data.message
        }));
      } else {
        // toast.error('Failed to generate message'); // Using toast for user feedback
      }
    } catch (error) {
      // console.error('Error generating message:', error);
      // toast.error(error.response?.data?.message || 'Failed to generate message'); // Using toast for user feedback
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!formData.name || !formData.message || !formData.subject) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate message length
      if (formData.message.length < 10) {
        setError('Message must be at least 10 characters long');
        setLoading(false);
        return;
      }

      // Validate segment rules
      if (!formData.segmentRules.length || formData.segmentRules.some(rule => !rule.value)) {
        setError('Please complete all segment rules');
        setLoading(false);
        return;
      }

      // Format the data according to the backend schema
      const campaignData = {
        name: formData.name,
        description: formData.description || '',
        subject: formData.subject,
        segmentRules: formData.segmentRules.map(rule => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.field === 'totalSpendings' ? Number(rule.value) : rule.value,
          logicOperator: rule.logicOperator
        })),
        message: formData.message,
        scheduledFor: formData.scheduledFor || undefined
      };
      
      const response = await campaignService.create(campaignData);
      if (response && response.success) {
        navigate('/campaigns');
      } else {
        setError('Failed to create campaign');
      }
    } catch (error) {
      // console.error('Error creating campaign:', error);
      // setError(error.response?.data?.message || 'Failed to create campaign');
      setLoading(false);
    }
  };

  const getFieldOptions = () => [
    { value: 'tags', label: 'Tags' },
    { value: 'totalSpendings', label: 'Total Spendings' },
    { value: 'location', label: 'Location' }
  ];

  const getOperatorOptions = (field) => {
    if (field === 'totalSpendings') {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'lessThan', label: 'Less Than' },
      ];
    } else {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
      ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link to="/campaigns" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campaign Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Campaign Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">
                Schedule (optional)
              </label>
              <input
                type="datetime-local"
                name="scheduledFor"
                id="scheduledFor"
                value={formData.scheduledFor}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Audience Segmentation */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Audience Segmentation</h2>
          </div>
          <div className="p-6 space-y-4">
            {formData.segmentRules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-2">
                {index > 0 && (
                  <div className="mt-2 w-16">
                    <select
                      value={rule.logicOperator}
                      onChange={(e) => handleRuleChange(index, 'logicOperator', e.target.value)}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}
                
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <select
                      value={rule.field}
                      onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={rule.operator}
                      onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      {getOperatorOptions(rule.field).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type={rule.field === 'totalSpendings' ? 'number' : 'text'}
                      value={rule.value}
                      onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Value"
                    />
                  </div>
                </div>
                
                {formData.segmentRules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={addRule}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Rule
              </button>
              
              <button
                type="button"
                onClick={previewAudience}
                disabled={previewingAudience}
                className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Users className="h-4 w-4 mr-1.5" />
                {previewingAudience ? 'Loading...' : 'Preview Audience'}
              </button>
            </div>
            
            {/* Audience Preview */}
            {targetAudience.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Target Audience: {audienceCount} customers</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targetAudience.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-3 py-2 text-sm text-blue-900">{customer.name}</td>
                          <td className="px-3 py-2 text-sm text-blue-900">{customer.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {audienceCount > 5 && (
                    <p className="text-xs text-blue-800 mt-2">
                      ... and {audienceCount - 5} more customers
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Message</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 mb-2">AI Message Generation</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="aiPrompt" className="block text-sm text-purple-800">
                    Describe what you want to say in your campaign
                  </label>
                  <textarea
                    id="aiPrompt"
                    rows="2"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-purple-300 rounded-md bg-white"
                    placeholder="e.g., A promotional email about our summer sale with 20% off all products"
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={generateMessage}
                  disabled={isGeneratingMessage || !aiPrompt}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  {isGeneratingMessage ? 'Generating...' : 'Generate Message'}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message Content *
              </label>
              <textarea
                name="message"
                id="message"
                rows="8"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your campaign message here..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/campaigns"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Saving...' : 'Save Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCampaign;