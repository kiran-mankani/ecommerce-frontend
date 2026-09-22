import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isAdmin: user?.role === "admin",
  };
};

export default useAuth;