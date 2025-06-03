import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Hardcoded user data
  const testUser = {
    id: '683c2bdebea030873253b8a0',
    email: 'aarushkaura2016@gmail.com'
  };

  const [user, setUser] = useState(testUser); // Set test user by default
  const [loading, setLoading] = useState(false); // Set loading to false since we're using test data
  const [error, setError] = useState(null);

  // Axios should include credentials (cookies) for auth
  axios.defaults.withCredentials = true;

  // Comment out the authentication check since we're using test data
  /*
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`);
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);
  */

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