import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { loginSchema } from "./../schema/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "./../service/user";
import Cookies from "js-cookie";
// import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { IResponse } from "../interface/IResponse";
import IErrorResponse from "../interface/IErrorResponse";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  // const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
  //   const googleToken = credentialResponse.credential;
  //   if (googleToken) {
  //     fetch(
  //       "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + googleToken
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         Cookies.set("user", data.given_name);
  //         Cookies.set("accessToken", googleToken);

  //         nav("/");
  //       })
  //       .catch((error) => {
  //         toast.error("Lỗi khi lấy thông tin người dùng từ Google:", error);
  //       });
  //   }
  // };

  // const handleGoogleLoginError = () => {
  //   toast.error("Google Login Failed");
  // };

  const submitForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const response: AxiosResponse<IResponse> = await loginAccount(data);
      if (response.status === 200) {
        const res = response.data;
        if (res.success) {
          nav("/");
          Cookies.set("user", res.data?.user.email);
          Cookies.set("accessToken", res.data.accessToken);
        }
      }
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      toast.error(response?.data.error);
    }
  };

  return (
    <>
      <section className="bg-theme-login bg-no-repeat w-[100vw] h-[100vh] bg-cover overflow-x-hidden">
        <form onSubmit={handleSubmit(submitForm)} className="w-[600px] mx-auto">
          <div className="mt-20 flex flex-col items-center mb-5">
            <img
              src="https://sapo.dktcdn.net/sso-service/images/Sapo-logo.svg"
              alt="logo"
              className="w-1/3"
            />
            <h1 className="text-[26px] font-semibold mt-3">
              Đăng nhập vào cửa hàng của bạn
            </h1>
          </div>

          <div className="mb-5">
            <input
              type="email"
              id="email"
              placeholder="Email của bạn"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 italic ml-5">
                {errors?.email.message}
              </p>
            )}
          </div>

          <div className="mb-10 relative">
            <input
              type={show ? "text" : "password"}
              id="password"
              placeholder="Mật khẩu cửa hàng"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("password")}
            />
            <div
              className="cursor-pointer absolute left-[94%] top-[16px] text-textColor"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 italic ml-5">
                {errors?.password.message}
              </p>
            )}
          </div>

          {/* <p className="mb-10 ml-4">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="italic hover:underline">
              Đăng ký ngay
            </Link>
          </p> */}

          <div className="flex flex-col items-center justify-center gap-5 mb-3">
            <button className="bg-custom-gradient py-4 px-20 rounded-full text-white text-2xl font-semibold">
              Đăng nhập
            </button>
            {/* <p className="text-textColor">Hoặc đăng nhập với</p> */}
          </div>

          {/* <div className="flex justify-center gap-5">
            <div className="w-2/6 cursor-pointer">
              <img
                src="https://sapo.dktcdn.net/sso-service/images/svg_sociallogin_fb_new.svg"
                alt="facebook"
                className="w-full"
              />
            </div>

            <div className="">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                theme="outline"
                type="standard"
              />
            </div>
          </div> */}
        </form>
      </section>

      <ToastContainer />
    </>
  );
};

export default LoginPage;
