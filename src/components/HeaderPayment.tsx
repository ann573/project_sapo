import { useRef, useState, useEffect } from "react";
import "../style/headerpayment.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IProduct } from "./../interface/IProduct";
import { searchProduct } from "./../service/product";
import useDebounce from "../hooks/useDebounce"; // Import hook useDebounce

import imageCart from '../assets/pictures/cart.png'
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
  const [pages, setPages] = useState<number[]>(Array.from({ length: numberPage }, (_, index) => index + 1));

  const [searchQuery, setSearchQuery] = useState<string>("");


  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearch(true);
      const fetchProductData = async () => {
        const data = await searchProduct(debouncedSearchQuery);
        setProductSearch(data);
      };
      fetchProductData();
    } else {
      setIsSearch(false);
    }
  }, [debouncedSearchQuery]);

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
      setNumberPage(updatedPages[0]);
    }
  };
  
  const handleAddPage = () => {
    const maxPage = Math.max(...pages, 0);  
    const newPage = maxPage + 1;  
  
    // Thêm số đơn mới vào mảng pages
    setPages((prevPages) => [...prevPages, newPage]);
    setNowPage(newPage); 
    setNumberPage(newPage); 
  };  

  const logoutAccount = (): void => {
    nav("/login");
    
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
  };  

  return (
    <header className="bg-primary_header h-14">
      <div className="max-w-[1400px] 2xl:max-w-[2000px] mx-auto h-full flex">
        <div className="w-[30%] flex items-center h-full relative mr-5">
          <input
            type="text"
            ref={inputRef}
            className="w-full focus:outline-none rounded-md pl-8 py-2"
            placeholder="Thêm sản phẩm vào đơn"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} 
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
                        const id = `${item._id}_${item.variants[0]._id}`
                        setIdProduct(id);
                        setIsSearch(false);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    >
                      <div className="w-[50px]">
                        <img src={imageCart} alt="anh" className="w-full"/>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="mr-auto">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-xs">{item.sort_title}</p>
                        </div>
                        <p className="italic">Còn hàng: <span className="font-medium">{item.stock}</span></p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-3">Không tìm thấy sản phẩm nào</p>
              )}
            </div>
          )}
        </div>

        <section className="w-[40%] flex overflow-x-auto overflow-y-hidden custom-scrollbar mr-3">
          <div className="flex items-center mr-1">
            {pages.map((page) => (
              <div
                key={page}
                onClick={() => setNowPage(page)}
                className={`${nowPage === page ? "selected" : "non-selected"} min-w-[110px] px-2 h-14 flex justify-center items-center select-none cursor-pointer whitespace-nowrap`}
                style={{ whiteSpace: "nowrap" }}
              >
                <p className="mr-3">Đơn {page}</p>
                <i
                  className={`ri-close-circle-line text-[#363636] text-xl ${nowPage === page ? "text-black" : "text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page);
                  }}
                ></i>
              </div>
            ))}
          </div>

          <div className="flex items-center flex-shrink-0">
            <i
              className="ri-add-line text-white text-3xl cursor-pointer"
              onClick={handleAddPage}
            ></i>
          </div>
        </section>

        <section className="w-[30%] text-white flex items-center gap-4">
          <div className="flex items-center gap-3 w-2/3 mr-auto">
            <i className="ri-user-line text-2xl"></i>{" "}
            <p className="cursor-default select-none">{nameUser}</p>
          </div>
          <div title="Trang chủ" className="mr-4">
            <Link to="/admin">
              <i className="ri-home-4-line text-2xl cursor-pointer"></i>
            </Link>
          </div>
          <div className="cursor-pointer" title="Đăng xuất" onClick={logoutAccount}>
            <i className="ri-logout-box-r-line text-2xl"></i>
          </div>
        </section>
      </div>
    </header>
  );
};

export default HeaderPayment;
