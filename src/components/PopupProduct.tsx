import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../schema/product";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createProduct, fetchProductById, updateNewProduct } from './../features/products/productsAction';
import { ToastContainer,toast } from 'react-toastify';
import { IProductBefore } from './../interface/IProduct';

interface PopupCustomerProps {
  setIsOpen: (value: boolean) => void;
  id: string;
  setId: (value: string) => void;
}


const PopupProduct: React.FC<PopupCustomerProps> = ({
  setIsOpen,
  id,
  setId,
}) => {
    const { product,error } = useSelector((state: RootState) => state.products);

    const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProductBefore>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id)); 
    }
  }, [id, dispatch]);
  
  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);
  


  const submitForm = (value: IProductBefore) => {
    value["sku"] = value.title.toLowerCase().replace(/ /g, "-");
    value["sort_title"] = value["sort_title"].toUpperCase();
  
    if (!id) {
      dispatch(createProduct(value));
      if (error) {
        toast.error("Có lỗi vui lòng thử lại sau");
      } else {
        console.log("first")
        toast.success("Thêm sản phẩm thành công");
      }
    } else {
      dispatch(updateNewProduct({ data: value, id }));
      if (error) {
        toast.error("Có lỗi vui lòng thử lại sau");
      } else {
        toast.success("Cập nhật sản phẩm thành công");
      }
    }
    setIsOpen(false);
    reset();
  };
  
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <div className="text-right font-bold cursor-pointer text-xl">
            <i
              className="ri-close-fill"
              onClick={() => {
                setIsOpen(false);
                setId("");
              }}
            ></i>
          </div>
          <form onSubmit={handleSubmit(submitForm)}>
            <h1 className="text-center text-xl font-semibold">
              {!id ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
            </h1>
            <div className="mb-3 flex flex-col gap-3">
              <label htmlFor="title">Tên sản phẩm:</label>
              <input
                type="text"
                id="title"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Tên sản phẩm"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 italic">{errors.title.message}</p>
              )}
            </div>
            <div className="mb-3 flex flex-col gap-3">
              <label htmlFor="price">Giá sản phẩm:</label>
              <input
                type="number"
                id="price"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Giá sản phẩm"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-red-500 italic">{errors.price.message}</p>
              )}
            </div>
            <div className="mb-3 flex flex-col gap-3">
              <label htmlFor="sort_title">Mã sản phẩm:</label>
              <input
                type="text"
                id="sort_title"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Nhập mã sản phẩm"
                {...register("sort_title")}
              />
              {errors.sort_title && (
                <p className="text-red-500 italic">
                  {errors.sort_title.message}
                </p>
              )}
            </div>
            <div className="mb-5 flex flex-col gap-3">
              <label htmlFor="storage">Nhập tồn kho:</label>
              <input
                type="number"
                id="storage"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Nhập số lượng tồn kho"
                {...register("storage", {
                  required: { value: true, message: "Bắt buộc nhập tồn kho" },
                })}
              />
              {errors.storage && (
                <p className="text-red-500 italic">{errors.storage.message}</p>
              )}
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded-md text-white font-bold">
              {!id ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default PopupProduct;
