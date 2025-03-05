import HeaderAdmin from "./HeaderAdmin";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "../style/layoutadmin.css";

const LayoutAdmin = () => {
  const [title, setTitle] = useState<string>("Tổng quát");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <HeaderAdmin title={title} />
      <section className="grid grid-cols-12 max-w-[1600px] mx-auto relative">
        {/* Overlay mờ dần */}

        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isOpen
              ? "opacity-40 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } lg:hidden`}
          onClick={() => setIsOpen(false)}
          style={{zIndex: 99}}
        ></div>
        {/* Menu bar */}
        <div
          className={`lg:col-span-2 z-40 lg:h-vh h-full bg-[#1a2c3f] lg:static fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
            isOpen || window.innerWidth > 1024 ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ minHeight: "calc(100vh - 66.74px)" ,zIndex: 999}}
        >
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
                  className="w-full block text-center py-3 px-5 xl:px-0"
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

        {/* Nội dung chính */}
        <div className="lg:col-span-10 col-span-12 bg-[#f4f6f8] py-5 xl:px-32 px-16 h-full">
          <Outlet />
        </div>

        {/* Nút mở menu */}
        <button
          className="bg-white shadow-2xl fixed px-3 py-2 rounded-full bottom-10 left-10 z-50 button lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="ri-menu-line"></i>
        </button>
      </section>
    </>
  );
};

export default LayoutAdmin;
