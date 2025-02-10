import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { productSchema } from "../schema/product";
import {
  createProduct,
  fetchProductById,
  searchProducts,
  updateNewProduct,
} from "./../features/products/productsAction";
import { IProductBefore } from "./../interface/IProduct";

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
  const { product, error } = useSelector((state: RootState) => state.products);

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
    if (id && product) {
      reset(product);
    }
  }, [id, product]);

  const submitForm = async (value: IProductBefore) => {
    console.log("Form submitted:", value);
    const { payload } = await dispatch(
      searchProducts({ searchQuery: value["sort_title"] })
    );

    if (payload.length !== 0) {
      toast.error("Mã SKU đã tồn tại");
      return;
    }
    if (!id) {
      dispatch(createProduct(value));
      if (error) {
        toast.error("Có lỗi vui lòng thử lại sau");
      } else {
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
              <label htmlFor="name">Tên sản phẩm:</label>
              <input
                type="text"
                id="name"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Tên sản phẩm"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 italic">{errors.name.message}</p>
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
              <label htmlFor="quantity">Nhập tồn kho:</label>
              <input
                type="number"
                id="quantity"
                className="w-full focus:outline-none border rounded-sm px-3 py-1"
                placeholder="Nhập số lượng tồn kho"
                {...register("quantity", {
                  required: { value: true, message: "Bắt buộc nhập tồn kho" },
                })}
              />
              {errors.quantity && (
                <p className="text-red-500 italic">{errors.quantity.message}</p>
              )}
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded-md text-white font-bold">
              {!id ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PopupProduct;
