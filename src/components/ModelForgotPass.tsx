import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINT } from "@/components/constants/variable";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EditUserForm from "./EditUserForm";

type TFormForgot = {
  email: string;
};

type TFormOTP = {
  otp: string;
};

const ModelForgotPass = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const formEmail = useForm<TFormForgot>();
  const formOtp = useForm<TFormOTP>();

  // Gửi yêu cầu gửi OTP
  const handleRegister = async (data: TFormForgot) => {
    try {
      setLoading(true);
      // const res: AxiosResponse = await instance.post("/users/send-otp", data);

      const res: AxiosResponse = await axios.post(
        `${API_ENDPOINT}/users/send-otp`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Vui lòng kiểm tra email để xác thực tài khoản");
        setUserEmail(data.email);
        setIsOpen(false);
        setIsOtpOpen(true);
        formEmail.reset();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận OTP
  const onSubmitOTP = async (data: TFormOTP) => {
    try {
      console.log(data);
      const res: AxiosResponse = await axios.post(
        "/users/verify-otp",
        {
          email: userEmail,
          otp: data.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        toast.success("Xác thực thành công!");
        setIsOtpOpen(false);
        formOtp.reset();
      }
      setIsOpenForm(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.error || "Lỗi xác thực OTP!");
      } else {
        toast.error("Lỗi không xác định, vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      {/* Modal nhập email */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <p className="my-5 ml-3 text-center">
          Bạn quên mật khẩu?{" "}
          <DialogTrigger asChild>
            <span className="italic underline hover:text-blue-400 cursor-pointer">
              Quên mật khẩu!!!
            </span>
          </DialogTrigger>
        </p>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quên mật khẩu</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={formEmail.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                {...formEmail.register("email", {
                  required: "Email không được để trống",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email không đúng định dạng",
                  },
                })}
              />
              {formEmail.formState.errors.email && (
                <p className="text-red-500">
                  {formEmail.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full bg-orange-500 text-white">
              Gửi mã OTP
            </Button>
          </form>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <ClipLoader color="#0089ff" size={50} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal nhập OTP */}
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập mã OTP</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={formOtp.handleSubmit(onSubmitOTP)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                placeholder="Nhập mã OTP"
                {...formOtp.register("otp", {
                  required: "OTP không được để trống",
                })}
              />
              {formOtp.formState.errors.otp && (
                <p className="text-red-500">
                  {formOtp.formState.errors.otp.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full bg-green-500 text-white">
              Xác nhận OTP
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isOpenForm && (
        <EditUserForm
          setIsOpenForm={setIsOpenForm}
          isOpenForm={isOpenForm}
          email={userEmail}
        />
      )}
    </>
  );
};

export default ModelForgotPass;
