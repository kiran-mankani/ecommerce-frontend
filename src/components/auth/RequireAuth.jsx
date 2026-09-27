import { Navigate, useLocation } from 'react-router-dom';
import { tokenStore } from '../../services/tokenStore';

const RequireAuth = ({ children, role }) => {
  const location = useLocation();
  const access = tokenStore.getAccess();
  const refresh = tokenStore.getRefresh();

  if (!access && !refresh) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role) {
    // read user role from wherever you store it after login
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    if (user && user.role !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RequireAuth;