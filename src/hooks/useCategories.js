import { useSelector } from "react-redux";

const useCategories = () => {
  const { items, pagination, loading, saving, error } = useSelector(
    (state) => state.category
  );
  return { items, pagination, loading, saving, error };
};

export default useCategories;