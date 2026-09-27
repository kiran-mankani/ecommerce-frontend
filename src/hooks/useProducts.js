import { useSelector } from "react-redux";

const useProducts = () => {
  const { items, pagination, loading, saving, error } = useSelector(
    (state) => state.product
  );
  return { items, pagination, loading, saving, error };
};

export default useProducts;