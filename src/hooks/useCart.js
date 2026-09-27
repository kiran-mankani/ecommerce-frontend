import { useSelector } from "react-redux";

const useCart = () => {
  const { items, subtotal, discount, total, count, loading, saving, error } =
    useSelector((s) => s.cart);
  return { items, subtotal, discount, total, count, loading, saving, error };
};

export default useCart;