import React, { useEffect, useState } from "react";
import { IProduct } from "../interface/IProduct";
import { Link } from "react-router-dom";

interface ProductListProps {
  products: IProduct[];
  quantities: { [key: string]: number };
  handleDelete: (productId: string) => void;
  handleDecrement: (productId: string, variantId: string) => void;
  handleIncrease: (productId: string, variantId: string) => void;
  setQuantities: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  variantOptions: { [key: string]: number };
  setVariantOptions: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  quantities,
  handleDelete,
  handleDecrement,
  handleIncrease,
  setQuantities,
  variantOptions,
  setVariantOptions,
}) => {
  const [current, setCurrent] = useState<IProduct | null>(null);
  console.log(current);

  useEffect(() => {
    if (current) {
      const key = variantOptions[current._id];
      current.idVariant = `${current._id}_${current.variants[key]._id}`;
    }
  }, [current, variantOptions]);
  console.log("---------------------", products);
  return (
    // quantiytyvariant: [{id: value}]
    <>
      <div className="h-[85%] border-b-[6px] ">
        {!products.length ? (
          <div className="flex flex-col items-center justify-center h-full text-textColor select-none">
            <img
              src="https://dunlopilloshop.com/template/img/emptycart.png"
              alt="anh"
              className="w-1/12"
            />
            <p className="my-3">Đơn hàng của bạn chưa có sản phẩm nào</p>
            <p className="border px-2 py-1 rounded-md">Thêm sản phẩm ngay</p>
          </div>
        ) : (
          <div>
            {products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="even:bg-blue-100 grid grid-cols-12 p-3 items-center border rounded-lg shadow-sm"
                >
                  <div className="flex justify-start item center">
                    <p className="mr-8">{index + 1}</p>
                    <i
                      className="ri-delete-bin-6-line text-xl cursor-pointer"
                      onClick={() => handleDelete(product._id)}
                    ></i>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl text-center">
                      {product.sort_title}
                    </p>
                  </div>

                  <div className="col-span-4">
                    <p className="text-xl font-semibold">{product.name}</p>
                    <p className="text-sm italic">Mặc định</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-xl font-semibold w-5 h-[25px] flex items-center justify-center rounded-l-md"
                      onClick={() =>
                        handleDecrement(
                          product._id,
                          product.variants[index]._id
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[product.idVariant] || 1}
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        setQuantities((prev) => ({
                          ...prev,
                          [product._id]: value,
                        }));
                      }}
                      className="w-9 h-[25px] text-center border border-gray-300"
                      min="1"
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 w-5 h-[25px] flex items-center justify-center text-xl font-semibold px-2 rounded-r-md "
                      onClick={() =>
                        handleIncrease(product._id, product.variants[index]._id)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="col-start-8 col-span-3 flex justify-center gap-3 items-center">
                    <label htmlFor="">
                      {product.variants[0].attributeType}:{" "}
                    </label>
                    <select
                      value={variantOptions[product._id] || 0}
                      onChange={(e) => {
                        setVariantOptions((prev) => ({
                          ...prev,
                          [product._id]: Number(e.target.value),
                        }));
                        setCurrent(product);
                      }}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:border-blue-500 block w-[33%] p-1 cursor-pointer"
                    >
                      {product.variants.map((item, index) => (
                        <option key={index} value={index}>
                          {item.size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-start-11 flex justify-center">
                    <p>
                      {product.variants[
                        variantOptions[product._id] || 0
                      ]?.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div className=" flex justify-end item-center text-lg font-semibold">
                    <p>
                      {(
                        product.variants[variantOptions[product._id] || 0]
                          ?.price * (quantities[product._id] || 1)
                      ).toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 h-[15%] px-3 py-5 gap-10">
        <Link
          className="bg-[#e3eefc] rounded-xl text-xl font-medium flex items-center justify-center"
          to="/admin"
        >
          Trang quản trị
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl text-xl font-medium flex items-center justify-center"
          to="/admin/product"
        >
          Quản lý sản phẩm
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl text-xl font-medium flex items-center justify-center"
          to="/admin/order"
        >
          Quản lý đơn hàng
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl text-xl font-medium flex items-center justify-center"
          to="/admin/customer"
        >
          Quản lý khách hàng
        </Link>
      </div>
    </>
  );
};

export default ProductList;
