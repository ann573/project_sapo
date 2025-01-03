import HeaderAdmin from "./HeaderAdmin";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "../style/layoutadmin.css";
const LayoutAdmin = () => {
  const [title, setTitle] = useState<string>("Tổng quát");
  return (
    <>
      <HeaderAdmin title={title} />
      <section className="grid grid-cols-12 gap-5 ">
        <div className="col-span-2 h-screen-minus-50 bg-[#1a2c3f]">
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
                  to="/admin/order"
                  className="w-full block text-center py-3"
                >
                  Đơn hàng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/customer"
                  className="w-full block text-center py-3"
                >
                  Khách hàng
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
        <Outlet />
      </section>
    </>
  );
};

export default LayoutAdmin;
