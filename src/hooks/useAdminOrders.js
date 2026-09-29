import { useSelector } from "react-redux";

const useAdminOrders = () => {
  const { list, pagination, current, loading, saving, error } = useSelector(
    (s) => s.adminOrder
  );
  return { list, pagination, current, loading, saving, error };
};

export default useAdminOrders;