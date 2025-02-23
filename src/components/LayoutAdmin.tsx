import HeaderAdmin from "./HeaderAdmin";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "../style/layoutadmin.css";
const LayoutAdmin = () => {
  const [title, setTitle] = useState<string>("Tổng quát");
  return (
    <>
      <HeaderAdmin title={title} />
      <section className="grid grid-cols-12">
        <div className="col-span-2 h-full bg-[#1a2c3f]" style={{ minHeight: 'calc(100vh - 66px)' }}>
          <nav className="text-white w-full">
            <ul>
              <li>
                <NavLink
                  to="/admin"
                  end
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Tổng quát")}

                >
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/product"
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Sản phẩm")}
                >
                  
                  Sản phẩm
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/orders"
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Đơn hàng")}
                >
                  Đơn hàng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/customer"
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Khách hàng")}
                >
                  Khách hàng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/employee"
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Nhân viên")}
                >
                  Quản lý nhân viên
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/variants"
                  className="w-full block text-center py-3"
                  onClick={() => setTitle("Biến thể sản phẩm")}
                >
                  Quản lý biến thể
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink to="/" className="w-full block text-center py-3">
                  Bán tại quầy{" "}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="col-span-10 bg-[#f4f6f8] py-5 px-32 h-full">
        <Outlet />
        </div>
      </section>
    </>
  );
};

export default LayoutAdmin;
