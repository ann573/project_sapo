import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { getProductById } from "../service/product";
import "../style/paymentpage.css";
import HeaderPayment from "./../components/HeaderPayment";
import { IProduct } from "./../interface/IProduct";
import { searchCustomer } from "../service/customer";
import { ICustomer } from "./../interface/ICustom";
import { useReactToPrint } from "react-to-print";
import Invoice from "../components/Invoice";
import PopupCustomer from "../components/PopupCustomer";
import { toast, ToastContainer } from "react-toastify";


const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) navigate("/login");
  }, [navigate]);

  const [idProduct, setIdProduct] = useState<string | number>("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [customPayment, setCustomPayment] = useState<string>("");

  const [percentage, setPercentage] = useState<number>(0);
  const [mustPay, setMustPay] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [customerSelect, setCustomerSelect] = useState<ICustomer | null>(null);
  const numberArr = new Array(5).fill(0);

  // Popup
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (idProduct) {
      (async () => {
        const data = await getProductById(idProduct);
        const existingProduct = products.find((item) => item.id === data.id);

        if (existingProduct) {
          setQuantities((prev) => {
            const newQuantity = (prev[existingProduct.id] || 0) + 1;
            return { ...prev, [existingProduct.id]: newQuantity };
          });
        } else {
          setProducts((prev) => [...prev, data]);
          setQuantities((prev) => ({ ...prev, [data.id]: 1 }));
        }
        setIdProduct("");
      })();
    }
  }, [idProduct, products]);

  useEffect(() => {
    const pay =
      percentage > 0
        ? getTotal(products) * (1 - percentage / 100)
        : getTotal(products);
    setMustPay(Number(pay.toFixed(0)));
  }, [percentage, products, quantities]);

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

  const handleDelete = (productId: string) => {
    const newProductsArray = products.filter(
      (product) => product.id !== productId
    );
    setProducts(newProductsArray);
  };

  const formatNumberWithCommas = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, "");

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCustomPayment: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const inputElement = e.target;
    const cursorPosition = inputElement.selectionStart || 0;
    const rawValue = inputElement.value;
    if (!rawValue) {
      setCustomPayment("0");
      return;
    }
    const formattedValue = formatNumberWithCommas(rawValue);
    setCustomPayment(formattedValue);

    setTimeout(() => {
      inputElement.selectionStart = inputElement.selectionEnd =
        cursorPosition + (formattedValue.length - rawValue.length);
    }, 0);
  };

  const getTotal = (products: IProduct[]): number => {
    return products.reduce(
      (total, product) => total + product.price * (quantities[product.id] || 1),
      0
    );
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const stringToNumber = (string: string): number => {
    return parseInt(string.replace(/[^0-9]/g, ""), 10);
  };
  const renderPayment = (price: number, index: number): string => {
    switch (index) {
      case 0:
        return `${formatNumber(price)} `;
      case 1:
        return `${formatNumber(price + 1000)} `;
      case 2:
        return `${formatNumber(price + 200000)} `;
      case 3:
        return `${formatNumber(price + 500000)} `;
      case 4:
        return `${formatNumber(price * 2 + 500000)} `;
      default:
        return "";
    }
  };

  const setOther = () => {
    let price = stringToNumber(customPayment) - mustPay;
    if (isNaN(price)) price = -getTotal(products);
    return formatNumber(price);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsSearch(true);
      const data = await searchCustomer(e.target.value);
      setCustomer([...data]);
    } else setIsSearch(false);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const endInvoice = {
    quantities: products.length,
    total: getTotal(products),
    discount: percentage,
    toPay: (percentage > 0
      ? getTotal(products) * (1 - percentage / 100)
      : getTotal(products)
    ).toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    }),
    givenMoney: customPayment,
    other: setOther(),
  };

  const onPayment = () =>{
    const value  = setOther()
    console.log(value.includes("-"))
    if (value.includes("-")) toast.error("Số tiền thanh toán đang âm")
    else if (products.length === 0) toast.error("Vui lòng thêm sản phẩm")
    else {
      reactToPrintFn()
      setProducts([])
      setCustomPayment("")
      setCustomerSelect(null)
      setPercentage(0)
    }
      
  }
  return (
    <>
    
      <HeaderPayment setIdProduct={setIdProduct} />
      <section className="grid grid-cols-11">
        <div className="col-span-8 border-r-8  h-screen-minus-pay">
          <div className="h-[85%] border-b-[6px] ">
            {!products.length ? (
              <div className="flex flex-col items-center justify-center h-full text-textColor select-none">
                <img
                  src="https://dunlopilloshop.com/template/img/emptycart.png"
                  alt="anh"
                  className="w-1/12"
                />
                <p className="my-3">Đơn hàng của bạn chưa có sản phẩm nào</p>
                <p className="border px-2 py-1 rounded-md">
                  Thêm sản phẩm ngay
                </p>
              </div>
            ) : (
              <div>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="even:bg-blue-100 grid grid-cols-12 py-2 px-3 items-center border rounded-lg shadow-sm"
                  >
                    <div className="flex justify-start item center">
                      <p className="mr-8">{index + 1}</p>
                      <i
                        className="ri-delete-bin-6-line text-xl cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      ></i>
                    </div>
                    <div>
                      <img
                        src="https://placehold.co/50"
                        className="rounded-lg"
                      />
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
                        value={quantities[product.id] || 1}
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
                        className="bg-gray-300 hover:bg-gray-400 w-5 h-[25px] flex items-center justify-center text-xl font-semibold px-2 rounded-r-md "
                        onClick={() => handleIncrease(product.id)}
                      >
                        +
                      </button>
                    </div>

                    <div className="col-start-10 flex justify-center">
                      <p>
                        {product.price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>

                    <div className=" col-span-2 flex justify-end item-center text-lg font-semibold">
                      <p>
                        {(
                          product.price * (quantities[product.id] || 1)
                        ).toLocaleString("vi", {
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
        </div>

        {/* ==================== */}
        <div className="col-span-3 py-2 px-3 w-full flex flex-col">
          <div className="flex-grow">
            <div className="text-textColor relative">
              {customerSelect ? (
                <div className="border-b-2 py-1 px-2 flex justify-between items-center">
                  <h4 className="text-red-400 text-lg">
                    {customerSelect.name} - {customerSelect.tel}
                  </h4>
                  <p
                    className="text-xl font-semibold cursor-pointer"
                    onClick={() => setCustomerSelect(null)}
                  >
                    x
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="w-full border-b-[3px] focus:outline-none py-1 px-7"
                    placeholder="Thêm khách hàng vào đơn"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSearch(e)
                    }
                  />
                  <i className="ri-search-line text-xl absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer"></i>
                  <span
                    className="absolute text-4xl right-0 top-1/2 -translate-y-2/3 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    +
                  </span>
                </>
              )}

              {isSearch && (
                <div className="absolute bg-white z-10 w-full shadow-lg max-h-[200px] overflow-y-auto">
                  {customer.map((customer: ICustomer) => {
                    return (
                      <div
                        className="border-b-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setCustomerSelect(customer);
                          setIsSearch(false);
                        }}
                      >
                        <div className="py-1 px-2">
                          <h2>{customer.name}</h2>
                          <p>{customer.tel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-between my-2">
              <p>
                Tổng tiền (<span>{products.length} sản phẩm</span>)
              </p>
              <p>
                {getTotal(products).toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <div className="flex justify-between my-4 pb-2 relative after:content-[''] after:w-1/2 after:h-[1px] after:bg-gray-300 after:absolute after:right-0 after:top-full">
              <p>Chiết khấu</p>
              <div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={percentage}
                  className="text-right focus:outline-none placeholder:text-black"
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const inputElement = e.target as HTMLInputElement;
                    const value = Number(inputElement.value);
                    if (value > 100) {
                      inputElement.value = "100";
                    }
                    setPercentage(Number(inputElement.value));
                  }}
                />

                <span>%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">Khách phải trả</h3>
              <p className="text-xl font-semibold">
                {mustPay.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            {products.length !== 0 && (
              <div className="grid grid-cols-3 gap-x-5 cursor-pointer mt-4">
                {numberArr.map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center my-2 bg-second cursor-pointer py-1 rounded-lg"
                      onClick={() => {
                        const payment = renderPayment(
                          mustPay,
                          index
                        );
                        setCustomPayment(payment);
                      }}
                    >
                      <p>{renderPayment(mustPay, index)}₫</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-between my-4 pb-2 relative after:content-[''] after:w-1/2 after:h-[1px] after:bg-gray-300 after:absolute after:right-0 after:top-full">
              <p>Tiền khách đưa</p>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={customPayment || 0}
                  placeholder="0"
                  className="placeholder:text-black placeholder:text-right text-right focus:outline-none"
                  onChange={handleCustomPayment}
                />
                <span>₫</span>
              </div>
            </div>
            <div className="flex justify-between">
              <h3 className="text-base font-semibold">Tiền thừa</h3>
              <p className="text-base font-semibold">{setOther()} ₫</p>
            </div>
          </div>
          <div>
            <button
              className="w-full bg-green-500 text-white py-3 text-xl font-semibold rounded-md"
              onClick={() => onPayment() }
            >
              Thanh toán
            </button>
          </div>
        </div>
      </section>

      {isOpen && <PopupCustomer setIsOpen={setIsOpen} setCustomerSelect={setCustomerSelect}/>}
      {/* In hóa đơn */}
      <div
        ref={contentRef}
        id="hiddenInvoice"
        style={{ display: "none", height: "0", width: "0" }}
      >
        <Invoice
          quantities={quantities}
          products={products}
          customer={customerSelect}
          endInvoice={endInvoice}
        />
      </div>

      <ToastContainer/>
    </>
  );
};

export default PaymentPage;
