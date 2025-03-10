import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAdmin";
import CustomerPage from "./page/admin/CustomerPage";
import DashBoard from "./page/admin/DashBoard";
import OrderPage from "./page/admin/OrderPage";
import ProductPage from "./page/admin/ProductPage";
import LoginPage from "./page/LoginPage";
import PaymentPage from "./page/PaymentPage";
import RegisterPage from "./page/RegisterPage";
import OrderDetail from "./page/admin/OrderDetail";
import CustomerDetail from "./page/admin/CustomerDetail";
import EmployeePage from "./page/admin/EmployeePage";
import VariantPage from "./page/admin/VariantPage";
import VerifyPage from "./page/VerifyPage";
import AddAndUpdateProduct from "./page/admin/AddAndUpdateProduct";
import NotFoundPage from "./page/NotFoundPage";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Trang chủ";
        break;
      case "/admin":
        document.title = "Quản trị";
        break;
      case "/admin/product":
        document.title = "Quản trị sản phẩm";
        break;
      case "/loign":
        document.title = "Đăng nhập";
        break;
      case "/register":
        document.title = "Đăng ký";
        break;
      case "/admin/orders":
        document.title = "Quản trị đơn hàng";
        break;
      case "/admin/customer":
        document.title = "Quản trị khách hàng";
        break;
      default:
        document.title = "Ứng dụng của tôi";
    }
  }, [location]);
  return (
    <>
      <Routes>
        <Route path="/" element={<PaymentPage />} />

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashBoard />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="customer/:id" element={<CustomerDetail />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="variants" element={<VariantPage />} />
          <Route
            path="product/add_and_update"
            element={<AddAndUpdateProduct />}
          />
          <Route
            path="product/add_and_update/:id"
            element={<AddAndUpdateProduct />}
          />
        </Route>

        <Route path="/verify-email/:token" element={<VerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
