import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Nhập tối thiểu 3 ký tự"),
  price: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))  // Chuyển đổi giá trị sang number
    .refine((value) => !isNaN(value), {  // Kiểm tra xem có phải số không
      message: "Phải là một số",
    })
    .pipe(z.number().positive("Giá phải là số dương").min(3, "Giá phải lớn hơn hoặc bằng 3")), // Dùng pipe để thêm các phương thức cho number
  sort_title: z.string().min(3, "Vui lòng nhập tối thiểu 3 ký tự"),
  storage: z
    .union([z.string(), z.number()]) 
    .transform((value) => Number(value))  
    .refine((value) => !isNaN(value), { 
      message: "Phải là một số",
    })
    .pipe(z.number().positive("Tồn kho phải là số dương")),  
});
