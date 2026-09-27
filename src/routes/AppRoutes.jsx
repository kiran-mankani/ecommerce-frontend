import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import ShopLayout from "../layouts/ShopLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import SetNewPassword from "../pages/auth/SetNewPassword";
import Profile from "../pages/customer/Profile";
import AdminDashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Home from "../pages/shop/Home";
import ProductDetail from "../pages/shop/ProductDetail";
import Cart from "../pages/shop/Cart";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/profile" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public shop */}
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Public auth */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
      </Route>

      {/* Customer */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/products" element={<Products />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;