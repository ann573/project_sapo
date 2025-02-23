import ModelAddEmployee from "@/components/ModelAddEmployee";
import { Card, CardContent } from "@/components/ui/card";
import { instance } from "@/service";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type TRevenueEmployee = {
  name: string;
  totalRevenue: number;
};

type TResTotal = {
  totalAmount: number;
  totalOrders: number;
};

type TEmployee = {
  _id: string;
  email: string;
  name: string;
};
const EmployeePage = () => {
  const [revenue, setRevenue] = useState<TRevenueEmployee[]>();
  const [total, setTotal] = useState<TResTotal>({
    totalAmount: 0,
    totalOrders: 0,
  });
  const [employees, setEmployee] = useState<TEmployee[]>();
  const role = Cookies.get("role");

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/users/order-employee");
      setRevenue([...res.data.data]);

      const resTotal = await instance.get("/orders/today");
      setTotal({ ...resTotal.data.data });

      const resEmployee = await instance.get("/users/employee");
      setEmployee([...resEmployee.data.data]);
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number | string) => {
    return value.toLocaleString("vi", { style: "currency", currency: "VND" });
  };
  return (
    <>
      {role !== "boss" ? (
        <div className="text-center text-3xl font-bold">
          Chỉ chủ cửa hàng mới xem được trang này
        </div>
      ) : (
        <>
          <section className="bg-white py-5 flex items-center mb-5">
            <ResponsiveContainer
              width={revenue && revenue?.length > 5 ? "100%" : "50%"}
              height={400}
            >
              <BarChart
                width={500}
                height={300}
                data={revenue}
                margin={{
                  top: 5,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  style={{ fontSize: "14px" }}
                />
                <Tooltip
                  formatter={(value) => {
                    if (Array.isArray(value)) {
                      return formatCurrency(value[0]);
                    }
                    return [formatCurrency(value), "Doanh thu"];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalRevenue"
                  fill="#0089ff"
                  activeBar={<Rectangle fill="green" stroke="blue" />}
                  name={"Doanh thu"}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-col items-center justify-center w-1/2 px-10">
              <div className="mb-3">
                <h2 className="text-2xl font-semibold">Doanh thu hôm nay</h2>
                <h3 className="text-center font-bold text-green-500 text-lg">
                  {total.totalAmount && formatCurrency(total.totalAmount)}{" "}
                  <i className="ri-funds-fill"></i>
                </h3>
                <h3 className="text-center italic">
                  Tổng cộng: {total.totalOrders} đơn hàng
                </h3>
              </div>
              <div className="w-full">
                {revenue &&
                  revenue.map((item, index) => (
                    <div
                      key={index}
                      className="text-left flex justify-between border-b pb-1 mb-5"
                    >
                      <p className="font-bold">{item.name}</p>
                      <p>{formatCurrency(item.totalRevenue)}</p>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-10 py-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold border-b pb-2">
                Danh sách nhân viên
              </h2>
              <ModelAddEmployee />
            </div>

            <div className="grid grid-cols-3 gap-4 p-4">
              {employees &&
                employees.map((employee) => (
                  <Card
                    key={employee._id}
                    className="p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow rounded-xl"
                  >
                    <img
                      src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg"
                      alt={employee.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <CardContent className="flex flex-col justify-center p-0">
                      <h2 className="text-lg font-bold">{employee.name}</h2>
                      <p className="text-sm text-gray-500">Nhân viên</p>
                      <p className="text-sm font-semibold text-green-500">
                        {employee.email}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};
export default EmployeePage;
