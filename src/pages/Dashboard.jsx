import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShoppingBag, Send, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { customerService, orderService, campaignService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    campaigns: 0,
    revenue: 0,
    recentCustomers: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent data using the getAll method with limit
        const customersRes = await customerService.getAll(1, 5); // page 1, limit 5
        const ordersRes = await orderService.getAll(1, 5); // page 1, limit 5
        const campaignsRes = await campaignService.getAll(1, 5); // page 1, limit 5
        
        // Fetch total counts using the getAll method without limit (or default limit)
        const totalCustomersRes = await customerService.getAll();
        const totalOrdersRes = await orderService.getAll();
        const totalCampaignsRes = await campaignService.getAll();

        // Log orders data for debugging revenue calculation
        console.log('Full orders response (ordersRes):', ordersRes);
        console.log('Orders data array (ordersRes.data?.data):', ordersRes.data?.data);
        console.log('Sample order price:', ordersRes.data?.data?.[0]?.price);

        // Log customer data for debugging revenue calculation
        console.log('Full total customers response (totalCustomersRes):', totalCustomersRes);
        console.log('Customer data array (totalCustomersRes.data?.data):', totalCustomersRes.data?.data);
        console.log('Sample customer totalSpendings:', totalCustomersRes.data?.data?.[0]?.totalSpendings);

        // Calculate total revenue by summing totalSpendings of all customers
        const totalRevenue = totalCustomersRes.data?.data?.reduce((sum, customer) => {
          const spendings = parseInt(customer.totalSpendings, 10);
          const validSpendings = isNaN(spendings) ? 0 : spendings;
          console.log(`Adding customer totalSpendings ${customer.totalSpendings} (parsed: ${validSpendings}, type: ${typeof validSpendings}) to sum ${sum}`);
          return sum + validSpendings;
        }, 0) || 0;
        
        console.log('Calculated total revenue:', totalRevenue);

        setStats({
          customers: totalCustomersRes.count || 0, // Assuming count is directly on the response data
          orders: totalOrdersRes.count || 0,
          campaigns: totalCampaignsRes.count || 0,
          revenue: totalRevenue,
          recentCustomers: customersRes.data || [], // Assuming data is directly on the response data for lists
          recentOrders: ordersRes.data || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.customers}</h3>
              <p className="text-xs flex items-center text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 12% increase
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.orders}</h3>
              <p className="text-xs flex items-center text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 8% increase
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Campaigns</p>
              <h3 className="text-2xl font-bold">{stats.campaigns}</h3>
              <p className="text-xs flex items-center text-red-600 mt-1">
                <ArrowDown className="h-3 w-3 mr-1" /> 3% decrease
              </p>
            </div>
            <div className="rounded-full bg-teal-100 p-3">
              <Send className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
              <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </Link>
            </div>
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(customer.totalSpendings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </Link>
            </div>
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                        <div className="text-xs text-gray-500">{order.customerId.name}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {order.items.map(item => item.name).join(', ')}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(order.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;