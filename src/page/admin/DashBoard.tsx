import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { instance } from "../../service";
import CountUp from "react-countup";

const DashBoard = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res: AxiosResponse = await instance.get("/orders/today");

        setTotalAmount(res.data.data.totalAmount);
        setTotalOrders(res.data.data.totalOrders);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="bg-white ">
      <h1 className="p-3 text-xl font-semibold">Kết quả kinh doanh trong ngày</h1>
      <div className="grid grid-cols-3 border-t">
        <div className="flex items-center justify-center gap-5 py-3">
          <i className="ri-money-dollar-circle-fill text-3xl bg-green-500 text-white py-1 px-2 rounded-full"></i>
          <div>
            <h2 className="font-medium">Doanh thu</h2>
            <p className="font-bold text-xl text-[#22c55e]">
              {<CountUp start={10000} end={totalAmount} duration={2} />} đ
            </p>
          </div>
        </div>
        <div className="h-full w-px bg-gray-300 mx-auto"></div>
        <div className="flex items-center justify-right gap-5">
          <i className="ri-list-ordered text-3xl bg-yellow-500 text-white py-1 px-2 rounded-full"></i>
          <div>
            <h2 className="font-medium">Đơn hàng mới</h2>
            <p className="font-bold text-xl text-[#eab308]">
              {<CountUp start={1000} end={totalOrders} duration={2} />}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
