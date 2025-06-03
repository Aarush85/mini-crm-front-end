import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { user, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {import.meta.env.VITE_APP_NAME}
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Sign in to access your CRM dashboard
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
            role="alert"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <g>
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.4 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.2-6.2C34.5 5.5 29.6 3.5 24 3.5 12.6 3.5 3.5 12.6 3.5 24S12.6 44.5 24 44.5 44.5 35.4 44.5 24c0-1.3-.1-2.3-.3-3z"/>
                  <path fill="#34A853" d="M6.3 14.7l7 5.1C15.7 17 19.5 14 24 14c3.1 0 5.9 1.1 8.1 3l6.2-6.2C34.5 5.5 29.6 3.5 24 3.5c-7.1 0-13.1 4.2-16.1 10.2z"/>
                  <path fill="#FBBC05" d="M24 44.5c5.6 0 10.5-1.9 14.3-5.1l-6.6-5.4c-2 1.3-4.6 2.1-7.7 2.1-6.1 0-11.3-4.1-13.1-9.7l-7 5.4C6.9 39.6 14.8 44.5 24 44.5z"/>
                  <path fill="#EA4335" d="M44.5 24c0-1.3-.1-2.3-.3-3H24v8.5h11.7c-1.1 3.1-3.7 5.7-7.7 5.7-3.1 0-5.9-1.1-8.1-3l-6.2 6.2C13.5 42.5 18.4 44.5 24 44.5c7.1 0 13.1-4.2 16.1-10.2l-7-5.4C38.9 29.9 44.5 27.1 44.5 24z"/>
                </g>
              </svg>
              Sign in with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
