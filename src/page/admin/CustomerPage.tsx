import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../../store/store";
import ButtonPage from "../../components/ButtonPage";
import {
  fetchCustomerById,
  fetchCustomers,
  removeOneCustomer,
  updateNewCustomer,
} from "../../features/customers/customerAction";
import useDebounce from "../../hooks/useDebounce";
import { ICustomer } from "../../interface/ICustom";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from './../../schema/customer';


const CustomerPage = () => {
  const { customer, customers, error } = useSelector(
    (state: RootState) => state.customers
  );
  const dispatch = useDispatch<AppDispatch>();

  const {handleSubmit, register, reset, formState:{errors}} =  useForm<ICustomer>({
    resolver:zodResolver(customerSchema)
  })

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có muốn xóa người dùng không")) {
      dispatch(removeOneCustomer(id));
      if (!error) {
        toast.success("Xóa người dùng thành công");
      } else {
        toast.error("Có lỗi vui lòng thử lại sau");
      }
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    dispatch(
      fetchCustomers({ page, limit, searchQuery: debouncedSearchQuery })
    );
  }, [dispatch, page, limit, debouncedSearchQuery]);

  useEffect(()=>{
   dispatch(fetchCustomerById(id))
  },[id , dispatch])

  useEffect(() => {
    if (customer) {
      reset(customer);
    }
  }, [customer, reset]);

  const submitForm = (value:ICustomer) => {
    dispatch(updateNewCustomer({data:value,id}))
    if(error) {
      toast.error("Có lỗi xảy ra")
    }  else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className="bg-white px-10 py-5">
        <div className="relative">
          <input
            type="text"
            className="w-full border px-10 py-2 rounded-xl focus:outline-none"
            placeholder="Tìm kiếm khách hàng theo số điện thoại...."
            onChange={handleSearchChange}
          />
          <i className="ri-search-line absolute left-2 top-1/4"></i>
        </div>

        <div className="my-5">
          <table className="w-full border-collapse border border-slate-500 min-h-[516px]">
            <thead>
              <tr>
                <th className="border border-slate-600">STT</th>
                <th className="border border-slate-600">Tên</th>
                <th className="border border-slate-600">Số điện thoại</th>
                <th className="border border-slate-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="border border-slate-600 text-center">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="border border-slate-600 text-center">
                      {item.name}
                    </td>
                    <td className="border border-slate-600 text-center">
                      {item.tel}
                    </td>
                    <td className="border border-slate-600 text-center">
                      <button
                        className="bg-red-500 mr-3 p-1 rounded-md"
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </button>
                      <button
                        className="bg-yellow-200 p-1 rounded-md"
                        onClick={() => {
                          setIsOpen(true);
                          setId(item.id);
                        }}
                      >
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ButtonPage setPage={setPage} page={page} />

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Cập nhật khách hàng mới{" "}
                <button
                  className="text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  x
                </button>
              </h2>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="mb-3 flex flex-col gap-1">
                  <label htmlFor="name">Nhập tên khách hàng: </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Tên khách hàng"
                    className="border py-1 px-2"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 italic">{errors.name.message}</p>
                  )}
                </div>
                <div className="mb-5 flex flex-col gap-1">
                  <label htmlFor="tel">Số điện thoại: </label>
                  <input
                    type="text"
                    id="tel"
                    placeholder="Nhập số điện thoại"
                    className="border py-1 px-2"
                    {...register("tel")}
                  />
                  {errors.tel && (
                    <p className="text-red-500 italic">{errors.tel.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default CustomerPage;
