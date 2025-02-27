import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "./../../schema/product";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  fetchAttribute,
  fetchAttributeById,
} from "./../../features/variants/variantAction";
import { fetchSingleAttributeValue } from "@/features/attributeValue/attributeAction";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { instance } from "@/service";
import { toast, ToastContainer } from "react-toastify";
import { PulseLoader } from "react-spinners";
import { fetchProductById } from "@/features/products/productsAction";

type Inputs = {
  name: string;
  sort_title: string;
  attributes: string;
  attributeValues: {
    idProduct: string;
    attribute: string;
    price: string;
    stock: string;
  }[];
};

const AddAndUpdateProduct = () => {
  const { id } = useParams();
  const { attributes, attribute } = useSelector(
    (state: RootState) => state.attributes
  );
  const { attributesValue } = useSelector(
    (state: RootState) => state.attributesValue
  );
  const { product } = useSelector((state: RootState) => state.products);

  const dispatch = useDispatch<AppDispatch>();

  const [attributeValues, setAttributeValues] = useState<any[]>([
    { id: "", price: "", stock: "", name: "" },
  ]);

  const [idAttribute, setIdAttribute] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(productSchema),
  });

  const nav = useNavigate();
  useEffect(() => {
    dispatch(fetchAttribute());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      (async () => {
        await dispatch(fetchProductById(id));

        if (product) {
          setIdAttribute(product?.variants[0].attribute.attributeId);
          setAttributeValues((prev) => {
            prev.length = 0;
            product?.variants.forEach((item) => {
              const dataBody = {
                id: item.attribute._id,
                price: item.price,
                stock: item.stock,
                name: item.attribute.name,
              };

              prev.push(dataBody);
            });
            return prev;
          });
        }
        if (typeof idAttribute === "string")
          await dispatch(fetchAttributeById(idAttribute));
      })();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      setValue("attributes", idAttribute, { shouldValidate: true });
      if (product && product.name)
        setValue("name", product.name, { shouldValidate: true });
      if (product && product.sort_title)
        setValue("sort_title", product.sort_title, { shouldValidate: true });
    }
  }, [idAttribute, setValue, product, id]);

  useEffect(() => {
    if (attributeValues.length > 0) {
      console.log(attributeValues);
      setValue("attributeValues", attributeValues, { shouldValidate: true });
    }
  }, [attributeValues, setValue]);

  const handleValueChange = async (value: string) => {
    await dispatch(fetchSingleAttributeValue(value));
    setAttributeValues([{ id: "", price: "", stock: "", name: "" }]);
  };

  const handleAttributeValueChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedValues = [...attributeValues];
    updatedValues[index][field] = value;

    if (field === "id") {
      const selectedAttribute = attributesValue.find(
        (item) => item._id === value
      );
      if (selectedAttribute) {
        updatedValues[index]["name"] = selectedAttribute.name;
      }
    }

    setAttributeValues(updatedValues);
  };

  const handleAddAttributeValue = () => {
    setAttributeValues((prev) => [
      ...prev,
      { id: "", price: "", stock: "", name: "" },
    ]);
  };

  const handleRemoveAttributeValue = (index: number) => {
    setAttributeValues((prev) => prev.filter((_, i) => i !== index));
  };

  const submitForm = async (dataBody: Inputs) => {
    const hasDuplicate = attributeValues.some(
      (item, index) =>
        attributeValues.findIndex((obj) => obj.id === item.id) !== index
    );
    if (hasDuplicate) {
      toast.error("Không được chọn 2 thuộc tính trùng nhau");
    }
    try {
      setLoading(true);
      const { name, sort_title } = dataBody;
      const dataProduct = { name, sort_title };
      const res: AxiosResponse = await instance.post("/products", dataProduct);
      if (res.status === 201) {
        dataBody.attributeValues.forEach((item) => {
          item.idProduct = res.data.data._id;
        });
      }
      const resVariant: AxiosResponse = await instance.post(
        "/variants",
        dataBody.attributeValues
      );
      if (resVariant.status === 201) {
        setLoading(false);
        nav("/admin/product");
        reset();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <section className="bg-white py-5 px-10">
        <h1 className="text-xl font-bold border-b py-2">Thêm sản phẩm mới</h1>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="my-5">
            <Label>Tên sản phẩm</Label>
            <Input placeholder="Sản phẩm A..." {...register("name")} />
            {errors?.name && (
              <p className="text-red-500 italic ml-1">{errors?.name.message}</p>
            )}
          </div>

          <div className="flex gap-10">
            <div className="my-5 basis-[30%]">
              <Label>Mã sản phẩm</Label>
              <Input placeholder="SPA" {...register("sort_title")} />
              {errors?.sort_title && (
                <p className="text-red-500 italic ml-1">
                  {errors?.sort_title.message}
                </p>
              )}
            </div>

            <div className="my-5 ">
              <Label>Chọn biến thể sản phẩm</Label>
              <Controller
                name="attributes"
                control={control}
                rules={{ required: "Vui lòng chọn giá trị thuộc tính" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleValueChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Mặc định" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {attributes.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.attributes &&
                errors?.attributes.message === "Required" && (
                  <p className="text-red-500 italic ml-1">
                    Trường này bắt buộc
                  </p>
                )}
            </div>
          </div>

          <Button
            className="my-5"
            onClick={(event) => {
              event.preventDefault();
              handleAddAttributeValue();
            }}
          >
            Thêm giá trị thuộc tính
          </Button>

          {attributeValues.length !== 0 &&
            attributeValues.map((item, index) => (
              <div key={index} className="flex gap-5 mb-2">
                {/* ID Giá trị thuộc tính */}
                <Controller
                  name={`attributeValues.${index}.attribute`}
                  control={control}
                  defaultValue={item.id || ""} // Giá trị mặc định khi cập nhật
                  render={({ field }) => (
                    <div className="flex flex-col basis-[30%]">
                      <Select
                        value={field.value || ""} // Khi thêm mới sẽ là chuỗi rỗng
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleAttributeValueChange(index, "id", value);
                          setValue(
                            `attributeValues.${index}.attribute`,
                            value,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giá trị thuộc tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {attributesValue.map((attr) => (
                              <SelectItem key={attr._id} value={attr._id}>
                                {attr.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className="text-red-500 italic ml-1">
                        {errors?.attributeValues?.[index]?.attribute?.message}
                      </p>
                    </div>
                  )}
                />

                {/* Giá */}
                <Controller
                  name={`attributeValues.${index}.price`}
                  control={control}
                  defaultValue={item.price || ""} // Giá trị mặc định khi cập nhật
                  render={({ field }) => (
                    <div>
                      <Input
                        type="number"
                        placeholder="Giá"
                        {...field}
                        value={field.value || ""} // Hỗ trợ cả thêm mới và cập nhật
                      />
                      <p className="text-red-500 italic ml-1">
                        {errors?.attributeValues?.[index]?.price?.message}
                      </p>
                    </div>
                  )}
                />

                {/* Tồn kho */}
                <Controller
                  name={`attributeValues.${index}.stock`}
                  control={control}
                  defaultValue={item.stock || ""} // Giá trị mặc định khi cập nhật
                  render={({ field }) => (
                    <div>
                      <Input
                        type="number"
                        placeholder="Tồn kho"
                        {...field}
                        value={field.value || ""} // Hỗ trợ cả thêm mới và cập nhật
                      />
                      <p className="text-red-500 italic ml-1">
                        {errors?.attributeValues?.[index]?.stock?.message}
                      </p>
                    </div>
                  )}
                />

                <Button onClick={() => handleRemoveAttributeValue(index)}>
                  Xóa
                </Button>
              </div>
            ))}

          <div className="flex justify-end mt-10 gap-5">
            <Button>
              <Link to="/admin/product">Quay lại</Link>
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-700">
              Thêm mới sản phẩm
            </Button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50  z-50">
          <PulseLoader color="#268ee8" />
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default AddAndUpdateProduct;
