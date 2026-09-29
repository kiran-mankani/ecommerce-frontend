import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateOrderStatusThunk } from "../../store/slices/adminOrderSlice";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderStatusSelect = ({ orderId, currentStatus, disabled = false }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (e) => {
    const next = e.target.value;
    if (next === currentStatus) return;

    setSaving(true);
    const res = await dispatch(
      updateOrderStatusThunk({ id: orderId, status: next })
    );
    setSaving(false);

    if (updateOrderStatusThunk.fulfilled.match(res)) {
      setValue(next);
      toast.success(`Status → ${next}`);
    } else {
      toast.error(res.payload || "Failed to update status");
      setValue(currentStatus);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled || saving}
      className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60"
      style={{
        backgroundColor: "var(--color-input-bg)",
        borderColor: "var(--color-input-border)",
        color: "var(--color-text)",
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusSelect;