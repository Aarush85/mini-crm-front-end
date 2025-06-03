import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Automatically log in the user if token is valid
        setUser(decoded);
        // If user is on login page, redirect to dashboard
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        // If token is invalid and user is on protected route, redirect to login
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    } else {
      // If no token and user is on protected route, redirect to login
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
    setLoading(false);
  }, [location.pathname, navigate]);

  const login = async (token, userData) => {
    try {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      setUser(userData);
      setError(null);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to login after logout
    navigate('/login');
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    error,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
