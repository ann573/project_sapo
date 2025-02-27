import { instance } from "@/service"; // Gọi API
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const { token } = useParams<{ token: string }>(); 
  const navigate = useNavigate();
  console.log(token);
  useEffect(() => {
    console.log("Bắt đầu");
    const verifyEmail = async () => {
      try {
        const res = await instance.get(`/users/verify-email?token=${token}`);
        console.log(res);
        if (res.status === 200) {
          toast.success("Xác thực email thành công!");
          navigate("/login"); // Điều hướng đến trang khác sau khi xác thực
        }
      } catch (error) {
        console.log(error);
        toast.error("Link xác thực không hợp lệ hoặc đã hết hạn.");
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return <div className="text-center text-xl font-bold">Đang xác thực email, vui lòng đợi...</div>;
};

export default VerifyPage;