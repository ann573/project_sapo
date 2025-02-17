import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import Invoice from "../components/Invoice";
import PopupCustomer from "../components/PopupCustomer";
import { instance } from "../service";
import { searchCustomer } from "../service/customer";
import { getProductById } from "../service/product";
import "../style/paymentpage.css";
import HeaderPayment from "./../components/HeaderPayment";
import PaymentDetail from "./../components/PaymentDetail";
import ProductList from "./../components/ProductList";
import { ICustomer } from "./../interface/ICustom";
import { IProduct } from "./../interface/IProduct";

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) navigate("/login");
  }, [navigate]);

  const [idProduct, setIdProduct] = useState<string>("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [customPayment, setCustomPayment] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [mustPay, setMustPay] = useState<number>(0);
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [customerSelect, setCustomerSelect] = useState<ICustomer | null>(null);
  const [score, setScore] = useState<number>(0);

  const numberArr = new Array(5).fill(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (idProduct) {
      (async () => {
        const existingProduct = products.find(
          (item) => item.idVariant === idProduct
        );

        if (existingProduct) {
          setQuantities((prev) => {
            const newQuantity = (prev[idProduct] || 0) + 1;
            return { ...prev, [idProduct]: newQuantity };
          });
        } else {
          const idFind = idProduct.split("_")[0];
          const data = await getProductById(idFind);
          data.idVariant = idProduct;
          setProducts((prev) => [...prev, data]);
          setQuantities((prev) => ({ ...prev, [idProduct]: 1 }));
        }
        setIdProduct("");
      })();
    }
  }, [idProduct, products]);

  useEffect(() => {
    let pay: number = total;
    if (percentage > 0 && score > 0) {
      pay = total * (1 - percentage / 100) - score * 20000;
    } else if (percentage > 0) {
      pay *= 1 - percentage / 100;
    } else if (score > 0) {
      pay -= score * 20000;
    }
    if (pay < 0) pay = 0;

    setMustPay(Number(pay.toFixed(0)));
  }, [percentage, total, score]);

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

  const handleDelete = (productIdVariant: string) => {
    const newProductsArray = products.filter(
      (product) => product.idVariant !== productIdVariant
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
    if (isNaN(price)) price = -total;
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
    total: total,
    discount: percentage,
    toPay: (percentage > 0
      ? total * (1 - percentage / 100)
      : total
    ).toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    }),
    givenMoney: customPayment,
    other: setOther(),
  };

  const onPayment = async () => {
    const value = setOther();
    if (value.includes("-")) {
      toast.error("Số tiền thanh toán đang âm");
      return;
    } else if (products.length === 0) {
      toast.error("Vui lòng thêm sản phẩm");
      return;
    } else {
      const updatedProducts = products.map((product) => {
        const idVariant = product.idVariant.split("_")[1]
        const findIndex = product.variants.findIndex((item) => item._id === idVariant)
        return {
          ...product,
          quantity: quantities[product.idVariant] || 1,
          variant: product.variants[findIndex].size,
          price: product.variants[findIndex].price,
          idVariant
        };
      });
      const result = {
        products: updatedProducts,
        quantities,
        percentage,
        total,
        customer: customerSelect?._id ,
        score,
      };
      try {
        await instance.post("/orders", result);;
      } catch (error) {
        console.log(error);
      }
      reactToPrintFn();
      setProducts([]);
      setCustomPayment("");
      setCustomerSelect(null);
      setPercentage(0);
      setQuantities({});
      setScore(0);
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
            setProducts={setProducts}
            setTotal={setTotal}
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
            total={total}
            setScore={setScore}
            score={score}
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
