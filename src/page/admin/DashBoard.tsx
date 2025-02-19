import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { instance } from "../../service";
import CountUp from "react-countup";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type OrdersWeek = {
  date: string,
  totalRevenue: number,
  orderCount: number
}
const DashBoard = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orderWeek, setOrderWeek] = useState<OrdersWeek[]>([])
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

  useEffect(() => {
    const fetchOrderWeek = async () => {
      try {
        const res: AxiosResponse = await instance.get("/orders/week");

        setOrderWeek(res.data.data);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }

    };

    fetchOrderWeek();
  }, []);

  const formatCurrency = (value: number | number) => {
    return value.toLocaleString('vi', {style : 'currency', currency : 'VND'})
  };

  return (
    <>
    <section className="bg-white mb-10">
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

    <section className="bg-white p-10 mb-10 flex flex-col justify-center">
      <h2 className="text-center text-2xl font-bold mb-5">Biểu đồ doanh thu</h2>
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={orderWeek} margin={{left: 30, right: 30}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCurrency(value)}
            style={{fontSize: '14px'}}/>
          <Tooltip formatter={(value) => formatCurrency(value)}/>
          <Legend />
          
          <Bar dataKey="totalRevenue" fill="#8884d8" barSize={30} name="Doanh thu" />
          
        </BarChart>
      </ResponsiveContainer>
    </section>

    <section className="bg-white p-10">
      <h2 className="text-center text-2xl font-bold mb-5">Biểu đồ đơn hàng</h2>
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={orderWeek}>
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="date" />
          <YAxis  />
          <Tooltip />
          <Legend />
                    
          <Bar dataKey="orderCount" fill="#82ca9d" barSize={30} name="Số lượng đơn hàng" />
        </BarChart>
      </ResponsiveContainer>
    </section>
    </>

    
  );
};

export default DashBoard;
