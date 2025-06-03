import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios should include credentials (cookies) for auth
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`);
        console.log('Auth response:', res.data);
        // If we get any response, try to use it
        if (res.data) {
          setUser(res.data.user || res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Auth error:', error.response?.data);
        // If we get an error response with data, try to use it
        if (error.response?.data) {
          setUser(error.response.data.user || error.response.data);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`);
      setUser(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
