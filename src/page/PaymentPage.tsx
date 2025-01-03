import HeaderPayment from "./../components/HeaderPayment";
import FooterPayment from "../components/FooterPayment";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IProduct } from "./../interface/IProduct";
import { getProductById } from "../service/product";

import "../style/paymentpage.css";

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) navigate("/login");
  }, [navigate]);

  const [idProduct, setIdProduct] = useState<string | number>("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (idProduct) {
      (async () => {
        const data = await getProductById(idProduct);
        const existingProduct = products.find((item) => item.id === data.id);

        if (existingProduct) {
          setQuantities((prev) => {
            const newQuantity = (prev[existingProduct.id] || 0) + 1; // Tăng số lượng lên 1
            return { ...prev, [existingProduct.id]: newQuantity }; // Cập nhật lại state quantities
          });
        } else {
          setProducts((prev) => [...prev, data]); // Thêm sản phẩm mới vào list
          setQuantities((prev) => ({ ...prev, [data.id]: 1 })); // Thêm sản phẩm mới với số lượng 1
        }
        setIdProduct(""); // Reset idProduct để không lặp lại
      })();
    }
  }, [idProduct, products]); // Cập nhật mỗi khi idProduct thay đổi

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => {
      const newQuantity = (prev[productId] || 1) > 1 ? prev[productId] - 1 : 1;
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleIncrease = (productId: string) => {
    setQuantities((prev) => {
      const newQuantity = (prev[productId] || 1) + 1;
      return { ...prev, [productId]: newQuantity };
    });
  };

  return (
    <>
      <HeaderPayment setIdProduct={setIdProduct} />
      <section className="grid grid-cols-11">
        <div className="col-span-8 border-r-8 border-b-[6px]  h-pay">
          {!products.length ? (
            <div className="flex flex-col items-center justify-center h-full text-textColor">
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
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="even:bg-blue-100 grid grid-cols-12 py-2 px-3 items-center border rounded-lg shadow-sm"
                >
                  <div className="flex justify-start item center">
                    <p className="mr-8">{index}</p>
                    <i className="ri-delete-bin-6-line text-xl cursor-pointer"></i>
                  </div>
                  <div>
                    <img src="https://placehold.co/50" className="rounded-lg" />
                  </div>
                  <div className="col-span-5">
                    <p className="text-xl font-semibold">{product.title}</p>
                    <p>{product.sort_title}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-xl font-semibold w-5 h-[25px] flex items-center justify-center rounded-l-md"
                      onClick={() => handleDecrement(product.id)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[product.id] || 1} // Dùng số lượng từ state
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        setQuantities((prev) => ({
                          ...prev,
                          [product.id]: value,
                        }));
                      }}
                      className="w-9 h-[25px] text-center border border-gray-300"
                      min="1"
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 w-5 h-[25px] flex items-center justify-center text-xl font-semibold px-2 rounded-r-md"
                      onClick={() => handleIncrease(product.id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="col-start-9 flex justify-center">
                    <p>
                      {product.price.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div className=" col-span-2 flex justify-end item-center text-lg font-semibold">
                    <p>
                      {(product.price * (quantities[product.id] || 1)) // Dùng số lượng từ state
                        .toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================== */}
        <div className="col-span-3 py-2 px-3 w-full flex flex-col">
          <div className="flex-grow">
            <div className="text-textColor relative">
              <input
                type="text"
                className="w-full border-b-[3px] focus:outline-none py-1 px-7"
                placeholder="Thêm khách hàng vào đơn"
              />
              <i className="ri-search-line text-xl absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer"></i>
              <span className="absolute text-4xl right-0 top-1/2 -translate-y-2/3 cursor-pointer">
                +
              </span>
            </div>
            <div className="flex justify-between my-2">
              <p>
                Tổng tiền (<span>{products.length} sản phẩm</span>)
              </p>
              <p>
                {products
                  .reduce(
                    (total, product) =>
                      total + product.price * (quantities[product.id] || 1),
                    0
                  )
                  .toLocaleString("vi", { style: "currency", currency: "VND" })}
              </p>
            </div>
            <div className="flex justify-between my-4 pb-2 relative after:content-[''] after:w-1/2 after:h-[1px] after:bg-gray-300 after:absolute after:right-0 after:top-full">
              <p>Chiết khấu</p>
              <p>0</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">Khách phải trả</h3>
              <p className="text-xl font-semibold">
                {products
                  .reduce(
                    (total, product) =>
                      total + product.price * (quantities[product.id] || 1),
                    0
                  )
                  .toLocaleString("vi", { style: "currency", currency: "VND" })}
              </p>
            </div>
            <div className="flex justify-between my-4 pb-2 relative after:content-[''] after:w-1/2 after:h-[1px] after:bg-gray-300 after:absolute after:right-0 after:top-full">
              <p>Tiền khách đưa</p>
              <input
                type="text"
                placeholder="0"
                className="placeholder:text-black placeholder:text-right text-right focus:outline-none"
              />
            </div>
            <div className="flex justify-between">
              <h3 className="text-base font-semibold">Tiền thừa</h3>
              <p className="text-base font-semibold">0</p>
            </div>
          </div>
          <div>
            <button className="w-full bg-green-500 text-white py-3 text-xl font-semibold rounded-md">
              Thanh toán
            </button>
          </div>
        </div>
      </section>
      {/* <FooterPayment /> */}
    </>
  );
};

export default PaymentPage;