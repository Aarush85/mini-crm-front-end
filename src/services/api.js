import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    // You could integrate a toast library here
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export const customerService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`/customers?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`/customers/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post('/customers', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/customers/${id}`);
    return response.data;
  },
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/customers/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const orderService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`/orders?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post('/orders', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/orders/${id}`);
    return response.data;
  },
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/orders/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const campaignService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`/campaigns?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`/campaigns/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post('/campaigns', data);
    return response.data;
  },
  previewAudience: async (segmentRules) => {
    const response = await axios.post('/campaigns/preview-audience', { segmentRules });
    return response.data;
  },
  generateMessage: async (prompt, audience) => {
    const response = await axios.post('/campaigns/generate-message', { prompt, audience });
    return response.data;
  },
  send: async (id) => {
    const response = await axios.post(`/campaigns/${id}/send`);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/campaigns/${id}`);
    return response.data;
  },
  testEmail: async (email) => {
    const response = await axios.post('/campaigns/test-email', { email });
    return response.data;
  }
};

export const dashboardService = {
  getSummary: async () => {
    const response = await axios.get('/dashboard/summary');
    return response.data;
  }
}; 