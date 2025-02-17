import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../interface/IProduct";

interface ProductListProps {
  products: IProduct[];
  quantities: { [key: string]: number };
  handleDelete: (productId: string) => void;
  handleDecrement: (productId: string, variantId: string) => void;
  handleIncrease: (productId: string, variantId: string) => void;
  setQuantities: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setTotal:  React.Dispatch<React.SetStateAction<number>>
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  quantities,
  handleDelete,
  handleDecrement,
  handleIncrease,
  setQuantities,
  setProducts,
  setTotal
}) => {

  const handleVariantChange = (product: IProduct, newIndex: number) => {
    const newVariantId = product.variants[newIndex]._id;
    const newIdVariant = `${product._id}_${newVariantId}`;
    const oldIdVariant = product.idVariant;
  
    if (newIdVariant === oldIdVariant) return; // Nếu không thay đổi variant thì không làm gì cả
  
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) =>
        p.idVariant === oldIdVariant ? { ...p, idVariant: newIdVariant } : p
      );
  
      // Kiểm tra xem có sản phẩm nào đã có `idVariant` mới chưa
      const existingProductIndex = updatedProducts.findIndex(
        (p) => p.idVariant === newIdVariant
      );
  
      if (existingProductIndex !== -1) {
        // Nếu đã tồn tại sản phẩm trùng, chỉ gộp số lượng và xóa dòng trùng
        setQuantities((prev) => {
          const updatedQuantities = { ...prev };
  
          // Chỉ cộng dồn nếu `newIdVariant` đã tồn tại từ trước
          if (newIdVariant in updatedQuantities){
            updatedQuantities[newIdVariant] += prev[oldIdVariant] || 1;
          } else {
            // Nếu chưa tồn tại, giữ nguyên số lượng cũ thay vì tăng thêm
            updatedQuantities[newIdVariant] = prev[oldIdVariant] || 1;
          }
  
          delete updatedQuantities[oldIdVariant]; // Xóa key cũ
          return updatedQuantities;
        });
  
        // Xóa dòng trùng, giữ nguyên vị trí dòng đầu tiên
        return updatedProducts.filter((p, index) => {
          return index === existingProductIndex || p.idVariant !== newIdVariant;
        });
      }
  
      return updatedProducts;
    });
  };
  
  useEffect(() => {
    const total = products.reduce((sum, product) => {
      const quantity = quantities[product.idVariant] || 1;
      const price = product.variants.find(v => `${product._id}_${v._id}` === product.idVariant)?.price || 0;
      return sum + quantity * price;
    }, 0);
    setTotal(total);
  }, [products, quantities, setTotal]);
  return (
    <>
      <div className="h-[85%] border-b-[6px] ">
        {!products.length ? (
          <div className="flex flex-col items-center justify-center h-full text-textColor select-none">
            <img
              src="https://dunlopilloshop.com/template/img/emptycart.png"
              alt="empty"
              className="w-1/12"
            />
            <p className="my-3">Đơn hàng của bạn chưa có sản phẩm nào</p>
            <p className="border px-2 py-1 rounded-md">Thêm sản phẩm ngay</p>
          </div>
        ) : (
          <div>
            {products.map((product, index) => {
              const selectedVariantIndex = product.variants.findIndex(
                (variant) => `${product._id}_${variant._id}` === product.idVariant
              );
              const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

              return (
                <div
                  key={product.idVariant}
                  className="even:bg-blue-100 grid grid-cols-12 p-3 items-center border rounded-lg shadow-sm"
                >
                  <div className="flex justify-start items-center">
                    <p className="mr-8">{index + 1}</p>
                    <i
                      className="ri-delete-bin-6-line text-xl cursor-pointer"
                      onClick={() => handleDelete(product.idVariant)}
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
                        handleDecrement(product._id, selectedVariant._id)
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
                          [product.idVariant]: value,
                        }));
                      }}
                      className="w-9 h-[25px] text-center border border-gray-300"
                      min="1"
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 w-5 h-[25px] flex items-center justify-center text-xl font-semibold px-2 rounded-r-md "
                      onClick={() =>
                        handleIncrease(product._id, selectedVariant._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="col-start-8 col-span-3 flex justify-center gap-3 items-center">
                    <label htmlFor=""> {product.variants[0].attributeType}: </label>
                    <select
                      value={selectedVariantIndex}
                      onChange={(e) => handleVariantChange(product, Number(e.target.value))}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:border-blue-500 block w-[33%] p-1 cursor-pointer"
                    >
                      {product.variants.map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-start-11 flex justify-center">
                    <p>
                      {selectedVariant.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div className="flex justify-end items-center text-lg font-semibold">
                    <p>
                      {(
                        selectedVariant.price * (quantities[product.idVariant] || 1)
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