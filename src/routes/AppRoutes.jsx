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
import AdminOrders from "../pages/admin/AdminOrders";
import AdminOrderDetail from "../pages/admin/AdminOrderDetail";
import AdminUsers from "../pages/admin/Users";
import Home from "../pages/shop/Home";
import ProductDetail from "../pages/shop/ProductDetail";
import Cart from "../pages/shop/Cart";
import Checkout from "../pages/shop/Checkout";
import OrderSuccess from "../pages/shop/OrderSuccess";
import MyOrders from "../pages/shop/MyOrders";
import OrderDetail from "../pages/shop/OrderDetail";

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
      </Route>

      {/* Cart + Orders (require login) */}
      <Route
        element={
          <ProtectedRoute>
            <ShopLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Old order-success (kept for backward compatibility) */}
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        {/* ✨ NEW — Stripe success page (uses ?session_id=...) */}
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
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

      {/* Customer profile */}
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
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;