import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../../features/orders/orderAction";
import { useAppDispatch, useAppSelector } from "../../../store/store";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId: string = id || "";
  const order = useAppSelector((state) => state.orders.order);

  console.log(order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(fetchOrderById(orderId));
    })();
  }, [orderId, dispatch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });
  };
  return (
    <>
      <section className="bg-white p-5">
        <h1 className="text-xl font-semibold border-b pb-2">
          Chi tiết đơn hàng{" "}
          <span className="text-blue-500 font-bold">{order?._id}</span>
        </h1>
        <div className="my-5 flex justify-between">
          <div>
            <h3>
              Nhân viên thanh toán:{" "}
              <span className="text-lg font-semibold">
                {order?.employee.name}
              </span>
            </h3>
            <h3 className="my-2 ">
              Ngày tạo:{" "}
              <span className="font-bold">
                {formatDate(order?.createdAt || "")}
              </span>
            </h3>
          </div>
          <div>
            <h3>
              Khách hàng:{" "}
              <span className="font-bold">{order?.customer.name || "Khách hàng"}</span>
            </h3>
            <h3 className="my-2 ">
              Số điện thoại:{" "}
              <span className="font-bold">{order?.customer.telephone || " "}</span>
            </h3>
          </div>
        </div>
        <div>
          <table className="w-full">
            <thead >
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Kiểu</th>
                <th>Đơn giá</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {order?.products.map(
                (item, index) => (
                  <tr key={index} className="border-t">
                    <td className="text-center py-2">{index}</td>
                    <td className="text-center py-2">{item?.name}</td>
                    <td className="text-center py-2">{item?.quantity}</td>
                    <td className="text-center py-2">{item?.variant}</td>
                    <td className="text-center py-2">{item?.price.toLocaleString('vi', {style : 'currency', currency : 'VND'}) }</td>
                    <td className="text-center py-2">{(item?.price * item.quantity).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
                  </tr>
                )
              )
            }
            <tr>
              <td colSpan={5}></td>
              <td className="text-center border-t py-5 font-bold text-lg">
                {order?.total.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
