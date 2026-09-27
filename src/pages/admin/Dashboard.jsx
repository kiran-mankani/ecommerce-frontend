import { useEffect, useState } from "react";
import { FiUsers, FiShield, FiPackage, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashboardApi } from "../../services/adminService";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardApi();
      setData(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load dashboard";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Dashboard
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Overview of your store
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Customers"
          value={data?.totalCustomers ?? 0}
          icon={FiUsers}
          accent="primary"
        />
        <AdminStatCard
          label="Admins"
          value={data?.totalAdmins ?? 0}
          icon={FiShield}
          accent="success"
        />
        <AdminStatCard
          label="Products"
          value={data?.totalProducts ?? 0}
          icon={FiPackage}
          accent="warning"
        />
        <AdminStatCard
          label="Orders"
          value={data?.totalOrders ?? 0}
          icon={FiShoppingBag}
          accent="danger"
        />
      </div>

      <div
        className="rounded-xl border p-5 text-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        Product and Order statistics will appear here once Phases 6 and 9 are
        completed. This page currently reflects only Users.
      </div>
    </div>
  );
};

export default Dashboard;