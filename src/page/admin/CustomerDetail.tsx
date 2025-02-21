import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchCustomerById } from "../../features/customers/customerAction";

const CustomerDetail = () => {
  const { id } = useParams<string>();
  const { customer } = useSelector((state: RootState) => state.customers);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id));
  }, [id, dispatch]);
  console.log(customer);
  return (
    <section className="bg-white p-5">
      <h1 className="text-2xl font-bold border-b pb-2">Chi tiết khách hàng</h1>
      
    </section>
  );
};

export default CustomerDetail;
