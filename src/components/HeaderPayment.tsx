import { useRef, useState } from "react";
import "../style/headerpayment.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IProduct } from "./../interface/IProduct";
import { searchProduct } from "./../service/product";

const HeaderPayment = ({ setIdProduct }: { setIdProduct: (id: string) => void }) => {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [numberPage, setNumberPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(1);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<IProduct[]>([]);
  const nameUser = Cookies.get("user")?.split("@")[0];

  const [nowPage, setNowPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>(
    Array.from({ length: numberPage }, (_, index) => index + 1)
  );

  const handleDelete = (page: number) => {
    const updatedPages = pages.filter((p) => p !== page);
    setPages(updatedPages);

    if (nowPage === page) {
      setNowPage(updatedPages[updatedPages.length - 1] || 1);
    }

    if (updatedPages.length === 0) {
      setPages([1]);
      setNowPage(1);
    } else if (updatedPages.length === 1) {
      setNumberPage(1);
    }
  };

  const logoutAccount = (): void => {
    nav("/login");
    Cookies.remove("user");
    Cookies.remove("accessToken");
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsSearch(true);
      const data = await searchProduct(e.target.value);
      setProductSearch(data);
    } else setIsSearch(false);
  };
  return (
    <>
      <header className="bg-primary h-14">
        <div className="max-w-[1400px] mx-auto h-full flex">
          <div className="w-[30%] flex items-center h-full relative mr-5">
            <input
              type="text"
              ref={inputRef}
              className="w-full focus:outline-none rounded-md pl-8 py-2"
              placeholder="Thêm sản phẩm vào đơn"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e)
              }
            />
            <i className="ri-search-line absolute left-1 xl:text-xl"></i>
            {isSearch && (
              <div className="absolute top-full shadow-xl bg-white w-full max-h-[200px] overflow-y-auto">
                {productSearch.length !== 0 ? (
                  productSearch.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex py-3 px-2 gap-3 items-center text-textColor cursor-pointer hover:bg-second"
                        onClick={() => {
                          setIdProduct(item.id);
                          setIsSearch(false);
                          if (inputRef.current) {
                            inputRef.current.value = ''; 
                          }
                        }}
                      >
                        <div>
                          <img src="https://placehold.co/50" alt="anh" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="mr-auto">
                            <h3>{item.title}</h3>
                            <p className="text-xs">{item.sort_title}</p>
                          </div>
                          <p>{item.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-3">
                    Không tìm thấy sản phẩm nào
                  </p>
                )}
              </div>
            )}
          </div>

          <section className="w-[60%] flex overflow-x-auto overflow-y-hidden custom-scrollbar mr-3">
            {/* Container cuộn ngang các phần tử */}
            <div className="flex items-center mr-1">
              {pages.map((page) => (
                <div
                  key={page}
                  onClick={() => setNowPage(page)}
                  className={`${
                    nowPage === page ? "selected" : "non-selected"
                  } min-w-[110px] px-2 h-14 flex justify-center items-center cursor-pointer whitespace-nowrap`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <p className="mr-3">Đơn {page}</p>
                  <i
                    className={`ri-close-circle-line text-[#363636] text-xl ${
                      nowPage === page ? "text-black" : "text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(page);
                    }}
                  ></i>
                </div>
              ))}
            </div>

            {/* Đảm bảo dấu cộng luôn nằm ở cuối */}
            <div className="flex items-center flex-shrink-0">
              <i
                className="ri-add-line text-white text-3xl cursor-pointer"
                onClick={() => {
                  const newPage = numberPage + 1;
                  setNumberPage(newPage);
                  setPages((prevPages) => [...prevPages, newPage]);
                  setNowPage(newPage);
                }}
              ></i>
            </div>
          </section>

          <section className="text-white flex items-center gap-4">
            <div className="flex items-center gap-3 mr-3">
              <i className="ri-user-line text-2xl"></i>{" "}
              <p className="cursor-default select-none">{nameUser}</p>
            </div>
            <div title="Trang chủ">
              <Link to="/admin">
                <i className="ri-home-4-line text-2xl cursor-pointer"></i>
              </Link>
            </div>
            <div
              className="cursor-pointer"
              title="Đăng xuất"
              onClick={logoutAccount}
            >
              <i className="ri-logout-box-r-line text-2xl"></i>
            </div>
          </section>
        </div>
      </header>
    </>
  );
};

export default HeaderPayment;
