import { z } from "zod";

export const productSchema = z.object({
  name: z.string().nonempty("Vui lòng nhập tên sản phẩm"), // Tên sản phẩm không được để trống
  sort_title: z.string().nonempty("Vui lòng nhập mã sản phẩm"), // Mã sản phẩm không được để trống
  attributes: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), // Thuộc tính không được để trống
  attributeValues: z
    .array(
      z.object({
        attribute: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), // ID giá trị thuộc tính không được để trống
        price: z
          .string()
          .nonempty("Vui lòng nhập giá")
          .regex(/^\d+$/, "Giá phải là số dương"), // Kiểm tra giá phải là số dương
        stock: z
          .string()
          .nonempty("Vui lòng nhập tồn kho")
          .regex(/^\d+$/, "Tồn kho phải là số dương"), // Kiểm tra tồn kho phải là số dương
      })
    )
    .min(1, "Cần ít nhất một giá trị thuộc tính"), // Phải có ít nhất một giá trị thuộc tính
});
