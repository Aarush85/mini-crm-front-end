import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
// import CustomerDetail from './pages/CustomerDetail';
import Orders from './pages/Orders';
// import OrderDetail from './pages/OrderDetail';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';
import CampaignHistory from './pages/CampaignHistory';

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App() {
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          {/* <Route path="/customers/:id" element={<CustomerDetail />} /> */}
          <Route path="/orders" element={<Orders />} />
          {/* <Route path="/orders/:id" element={<OrderDetail />} /> */}
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/create" element={<CreateCampaign />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/campaigns/history" element={<CampaignHistory />} />
          {/* <Route path="/campaigns" element={<CampaignHistory />} /> */}
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;