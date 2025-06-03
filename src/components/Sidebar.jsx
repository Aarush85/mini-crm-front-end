import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Users, ShoppingBag, BarChart2, Send } from 'lucide-react';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-30
        w-64 bg-white shadow-lg transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">MiniCRM</span>
          </div>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 px-2 py-4 bg-white space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => `
              ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
            `}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) => `
              ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
            `}
          >
            <Users className="mr-3 h-5 w-5" />
            Customers
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) => `
              ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
            `}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            Orders
          </NavLink>

          <NavLink
            to="/campaigns"
            className={({ isActive }) => `
              ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
            `}
          >
            <Send className="mr-3 h-5 w-5" />
            Campaigns
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;