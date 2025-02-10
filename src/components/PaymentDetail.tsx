import { ToastContainer } from "react-toastify";
import { ICustomer } from "../interface/ICustom";
import { IProduct } from "../interface/IProduct";

interface PaymentPageProps {
    products: IProduct[];  
    customerSelect: ICustomer | null;  
    setCustomerSelect: React.Dispatch<React.SetStateAction<ICustomer | null>>; 
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;  
    isSearch: boolean;  
    customer: ICustomer[];  
    setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;  
    getTotal: (products: IProduct[]) => number;  
    percentage: number;  
    setPercentage: React.Dispatch<React.SetStateAction<number>>;  
    mustPay: number;  
    numberArr: number[];  
    setCustomPayment: React.Dispatch<React.SetStateAction<string>>;  
    renderPayment: (price: number, index: number) => string;  
    customPayment: string;  
    handleCustomPayment: React.ChangeEventHandler<HTMLInputElement>;  
    setOther: () => string;  
    onPayment: () => void;  
}

const PaymentDetail: React.FC<PaymentPageProps> = ({
  products,
  customerSelect,
  setCustomerSelect,
  handleSearch,
  setIsOpen,
  isSearch,
  customer,
  setIsSearch,
  getTotal,
  percentage,
  setPercentage,
  mustPay,
  numberArr,
  setCustomPayment,
  renderPayment,
  customPayment,
  handleCustomPayment,
  setOther,
  onPayment,
}) => {
  return (
    <>
      <div className="flex-grow">
        <div className="text-textColor relative">
          {customerSelect ? (
            <div className="border-b-2 py-1 px-2 flex justify-between items-center">
              <h4 className="text-red-400 text-lg">
                {customerSelect.name} - {customerSelect.telephone}
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
              {customer.map((customer: ICustomer, index: number) => {
                return (
                  <div
                    className="border-b-2 cursor-pointer hover:bg-gray-100 flex items-center"
                    key={index}
                    onClick={() => {
                      setCustomerSelect(customer);
                      setIsSearch(false);
                    }}
                  >
                    <div className="py-1 px-2 mr-auto" >
                      <h2>{customer.name}</h2>
                      <p>{customer.telephone}</p>
                    </div>
                    <div>
                      <p>{customer.score} điểm</p>
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
                    const payment = renderPayment(mustPay, index);
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
          onClick={() => onPayment()}
        >
          Thanh toán
        </button>
      </div>

      <ToastContainer />

    </>
  );
};
export default PaymentDetail;
