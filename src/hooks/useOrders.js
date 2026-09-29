import { useSelector } from "react-redux";

const useOrders = () => {
  const { list, pagination, current, loading, saving, error } = useSelector(
    (s) => s.order
  );
  return { list, pagination, current, loading, saving, error };
};

export default useOrders;