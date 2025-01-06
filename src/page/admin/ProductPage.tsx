import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { fetchProducts, removeOneProduct } from "../../features/products/productsAction";
import PopupProduct from "../../components/PopupProduct";
import { toast, ToastContainer } from 'react-toastify';
import useDebounce from "../../hooks/useDebounce"; // import hook debounce của bạn
import ButtonPage from './../../components/ButtonPage';

  const ProductPage = () => {
  const { products, error } = useSelector((state: RootState) => state.products);

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearchQuery = useDebounce(searchQuery, 500); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có muốn xóa sản phẩm không")) {
      dispatch(removeOneProduct(id));
      if (!error) {
        toast.success("Xóa sản phẩm thành công");
      } else {
        toast.error("Có lỗi vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, searchQuery: debouncedSearchQuery }));
  }, [dispatch, page, limit, debouncedSearchQuery]);

  useEffect(() => {
    if (products.length === 0 && page > 1) {
      setPage(1);
    }
  }, [products, page]);

  return (
    <section className="bg-white p-5">
      <div className="relative">
        <input
          type="text"
          className="w-full border px-10 py-2 rounded-xl focus:outline-none"
          placeholder="Tìm kiếm sản phẩm...."
          onChange={handleSearchChange} 
        />
        <i className="ri-search-line absolute left-2 top-1/4"></i>
      </div>

      <button className="mt-3 bg-green-500 text-white py-2 px-3 rounded-md font-semibold" onClick={() => {
        setIsOpen(true);
      }}>
        Thêm sản phẩm
      </button>

      <div className="my-5">
        <table className="w-full border-collapse border border-slate-500 min-h-[516px]">
          <thead>
            <tr>
              <th className="border border-slate-600">STT</th>
              <th className="border border-slate-600">Tên sản phẩm</th>
              <th className="border border-slate-600">Mã sản phẩm</th>
              <th className="border border-slate-600">SKU</th>
              <th className="border border-slate-600">Tồn kho</th>
              <th className="border border-slate-600">Giá</th>
              <th className="border border-slate-600">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td className="border border-slate-600 text-center">
                    {(page - 1) * limit + (index + 1)}
                  </td>
                  <td className="border border-slate-600 text-center">
                    {item.title}
                  </td>
                  <td className="border border-slate-600 text-center">
                    {item.sort_title}
                  </td>
                  <td className="border border-slate-600 text-center">
                    {item.sku}
                  </td>
                  <td className="border border-slate-600 text-center">
                    {item.storage}
                  </td>
                  <td className="border border-slate-600 text-center">
                    {item.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border border-slate-600 text-center py-2">
                    <button className="bg-red-500 mr-3 p-1 rounded-md" onClick={() => handleDelete(item.id)}>
                      Xóa
                    </button>
                    <button className="bg-yellow-200 p-1 rounded-md" onClick={() => {
                      setIsOpen(true);
                      setId(item.id);
                    }}>
                      Cập nhật
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ButtonPage setPage={setPage} page={page}/>

      {isOpen && <PopupProduct setIsOpen={setIsOpen} id={id} setId={setId} />}
      <ToastContainer />
    </section>
  );
};

export default ProductPage;
