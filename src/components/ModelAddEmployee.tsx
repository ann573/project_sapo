import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
import { toast, ToastContainer } from "react-toastify";
import { instance } from "@/service";

type TFormData = {
  name: string;
  email: string;
  password: string;
  otp: string;
};

const ModelAddEmployee = () => {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { register, handleSubmit, reset } = useForm<TFormData>();

  // Hàm gửi mã OTP
  const handleSendOtp = async () => {
    try {
        const res = await instance.post("/users/send-otp", { email });
        console.log(res);
        if (res.status === 200) {
            toast.success("Mã OTP đã được gửi đến email của bạn.");
            setIsOtpOpen(true); 
        } else {
            toast.error("Gửi mã OTP thất bại. Vui lòng thử lại.");
        }
    } catch (error: any) {
        // Kiểm tra error.response và lấy status chính xác
        if (error.response) {
            console.error("Lỗi từ server:", error.response.status, error.response.data);
            toast.error(`Lỗi ${error.response.status}: ${error.response.data.message || "Không thể gửi mã OTP."}`);
        } else if (error.request) {
            console.error("Không nhận được phản hồi từ server:", error.request);
            toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else {
            console.error("Lỗi khác:", error.message);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    }
};


  // Hàm xử lý submit form
  const onSubmit: SubmitHandler<TFormData> = (data) => {
    console.log("Form Data:", data);
    reset();
    setIsOtpOpen(false); 
  };

  return (
    <>
        <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Thêm nhân viên</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên nhân viên</Label>
            <Input
              id="name"
              placeholder="Nhập tên nhân viên"
              {...register("name", { required: true })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email nhân viên"
              {...register("email", { required: true })}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password", { required: true })}
            />
          </div>

          <Button
            type="button"
            className="w-full bg-orange-500 text-white"
            onClick={handleSendOtp}
          >
            Gửi mã OTP
          </Button>
        </form>
      </DialogContent>

      {/* Modal nhập OTP */}
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập mã OTP</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                placeholder="Nhập mã OTP"
                {...register("otp", { required: true })}
              />
            </div>

            <Button type="submit" className="w-full bg-green-500 text-white">
              Xác nhận OTP
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
    <ToastContainer/>
    </>
  );
};

export default ModelAddEmployee;
