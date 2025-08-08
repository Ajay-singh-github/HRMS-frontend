import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/authService.jsx';

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await verifyToken();
      if (res && res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
