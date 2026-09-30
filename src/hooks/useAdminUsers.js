import { useSelector } from "react-redux";

const useAdminUsers = () => {
  const { list, pagination, current, loading, error } = useSelector(
    (s) => s.adminUser
  );
  return { list, pagination, current, loading, error };
};

export default useAdminUsers;