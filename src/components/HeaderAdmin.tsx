import React from "react";
import Cookies from "js-cookie";

type Props = {
  title: string;
};
const HeaderAdmin: React.FC<Props> = ({ title }) => {
  const userCookie = Cookies.get("user");
  const firstLetterUsername: string | undefined = userCookie ? userCookie[0].toUpperCase() : undefined;
  return (
    <>
      <header className="shadow-xl py-2">
        <div className="max-w-[1400px] mx-auto grid grid-cols-9 gap-5">
          <div>
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-Sapo.png"
              alt="logo"
              className="w-full"
            />
          </div>
          <div className="flex items-center col-span-4">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="col-start-6 col-span-4 text-textColor flex items-center gap-5">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 hover:rounded-md py-1 px-1">
              <i className="ri-money-dollar-circle-fill text-xl"></i>
              <p>Vay vốn kinh doanh</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 hover:rounded-md py-1 px-1">
              <i className="ri-question-line text-xl"></i>
              <p>Trợ giúp</p>
            </div>
            <div className="flex gap-2 cursor-pointer hover:bg-gray-200 hover:rounded-md py-1 px-1 items-center">
                <p className="bg-pink-500 py-1 px-2 rounded-full text-white">{firstLetterUsername}</p>
              <p>{userCookie?.split("@")[0]}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderAdmin;
