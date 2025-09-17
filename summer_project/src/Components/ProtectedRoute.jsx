import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectIsAuthenticated, selectAuthLoading, selectToken, checkTokenExpiry } from '../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (token) {
      dispatch(checkTokenExpiry());
      
      const interval = setInterval(() => {
        dispatch(checkTokenExpiry());
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
