import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import {  useNavigate } from "react-router-dom";
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
import ProductList from "./../components/ProductList";
import PaymentDetail from "./../components/PaymentDetail";

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
  const [variantOption, setVariantOption] = useState<number>(0);

  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [percentage, setPercentage] = useState<number>(0);
  const [mustPay, setMustPay] = useState<number>(0);
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [customerSelect, setCustomerSelect] = useState<ICustomer | null>(null);
  const numberArr = new Array(5).fill(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (idProduct) {
      (async () => {
        const data = await getProductById(idProduct);
        const existingProduct = products.find((item) => item._id === data._id);

        if (existingProduct) {
          setQuantities((prev) => {
            const newQuantity = (prev[existingProduct._id] || 0) + 1;
            return { ...prev, [existingProduct._id]: newQuantity };
          });
        } else {
          setProducts((prev) => [...prev, data]);
          setQuantities((prev) => ({ ...prev, [data._id]: 1 }));
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

  const handleDecrement = (productId: string, variantId: string) => {
    const key = `${productId}_${variantId}`;
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) - 1),
    }));
  };

  const handleIncrease = (productId: string, variantId: string) => {
    const key = `${productId}_${variantId}`;
    setQuantities((prev) => ({
      ...prev,
      [key]: (prev[key] || 1) + 1,
    }));
  };

  const handleDelete = (productId: string) => {
    const newProductsArray = products.filter(
      (product) => product._id !== productId
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
      (total, product) => total + product.price * (quantities[product._id] || 1),
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

  const onPayment = () => {
    const value = setOther();
    if (value.includes("-")) toast.error("Số tiền thanh toán đang âm");
    else if (products.length === 0) toast.error("Vui lòng thêm sản phẩm");
    else {

      reactToPrintFn();
      setProducts([]);
      setCustomPayment("");
      setCustomerSelect(null);
      setPercentage(0);
      setQuantities({});
    }
  };
  return (
    <>
      <HeaderPayment setIdProduct={setIdProduct} />

      <section className="grid grid-cols-11">
        <div className="col-span-8 border-r-8  h-screen-minus-pay">
          <ProductList
            products={products}
            quantities={quantities}
            handleDelete={handleDelete}
            handleDecrement={handleDecrement}
            handleIncrease={handleIncrease}
            setQuantities={setQuantities}
            variantOption={variantOption}
            setVariantOption={setVariantOption}
          />
        </div>

        {/* ==================== */}
        <div className="col-span-3 py-2 px-3 w-full flex flex-col">
          <PaymentDetail
            products={products}
            customerSelect={customerSelect}
            setCustomerSelect={setCustomerSelect}
            handleSearch={handleSearch}
            setIsOpen={setIsOpen}
            isSearch={isSearch}
            customer={customer}
            setIsSearch={setIsSearch}
            getTotal={getTotal}
            percentage={percentage}
            setPercentage={setPercentage}
            mustPay={mustPay}
            numberArr={numberArr}
            setCustomPayment={setCustomPayment}
            renderPayment={renderPayment}
            customPayment={customPayment}
            handleCustomPayment={handleCustomPayment}
            setOther={setOther}
            onPayment={onPayment}
          />
        </div>
      </section>

      {isOpen && (
        <PopupCustomer
          setIsOpen={setIsOpen}
          setCustomerSelect={setCustomerSelect}
        />
      )}

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

      <ToastContainer />
    </>
  );
};

export default PaymentPage;
