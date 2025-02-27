import { instance } from "@/service";
import { AxiosError, AxiosResponse } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ID_DEFAULT } from "./../../constants/variable";
type TAttribute = {
  _id: string;
  name: string;
};
type TAttributeValue = {
  _id: string;
  name: string;
};

const VariantPage = () => {
  const [attribute, setAttribute] = useState<TAttribute[]>([]);
  const [attributeValue, setAttributeValue] = useState<TAttributeValue[]>([]);
  const [activeArrow, setActiveArrow] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<string>("");
  const role = Cookies.get("role");

  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdd && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
    }
  }, [isAdd]);

  useEffect(() => {
    (async () => {
      try {
        const res: AxiosResponse = await instance.get("/attributes");
        if (res.status === 400) {
          toast.error("Bạn không có quyền vào trang này");
        } else {
          setAttribute(res.data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400) {
          toast.error(error.response.data?.error || "Có lỗi xảy ra!");
        }
      }
    })();
  }, []);

  const toggleArrow = (id: string) => {
    setActiveArrow((prev) => (prev === id ? null : id));
    setEditId(null);
  };

  useEffect(() => {
    if (activeArrow) {
      (async () => {
        const res: AxiosResponse = await instance.get(
          `/attribute_value/${activeArrow}`
        );
        setAttributeValue(res.data.data);
      })();
    }
  }, [activeArrow]);

  // Bắt đầu sửa tên
  const handleEdit = (item: TAttributeValue) => {
    setEditId(item._id);
    setEditName(item.name);
  };

  // Lưu tên đã sửa
  const handleSave = async (id: string) => {
    const isDuplicate = attributeValue.some(
      (item) =>
        item.name.trim().toLowerCase() === editName.trim().toLowerCase() &&
        item._id !== id
    );

    if (isDuplicate) {
      toast.error("Tên thuộc tính đã tồn tại!");
      return;
    }

    try {
      await instance.put(`/attribute_value/${id}`, { name: editName });
      setAttributeValue((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, name: editName } : item
        )
      );
      setEditId(null);
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi cập nhật");
    }
  };

  // Thêm giá trị mới
  const handleAddNew = async () => {
    if (!newName.trim()) {
      toast.error("Tên không được để trống!");
      return;
    }

    const isDuplicate = attributeValue.some(
      (item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Tên thuộc tính đã tồn tại!");
      return;
    }

    try {
      const res = await instance.post("/attribute_value", {
        name: newName,
        attributeId: activeArrow,
      });
      setAttributeValue((prev) => [...prev, res.data.data]);
      setNewName("");
      toast.success("Thêm mới thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm mới");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (attributeValue.length === 1)
        return toast.error("Không thể xóa giá trị mặc định");
      await instance.delete(`/attribute_value/${id}`);

      toast.success("Xóa thành công");
      setAttributeValue((prev) => {
        return prev.filter((item) => item._id !== id);
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response.data?.error || "Có lỗi xảy ra!");
      }
    }
  };

  const handleAddNewAttribute = async () => {
    try {
      const isDuplicate = attribute.some(
        (item) =>
          item.name.trim().toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (isDuplicate) {
        toast.error("Tên thuộc tính đã tồn tại!");
        return;
      }

      const res: AxiosResponse = await instance.post("/attributes", {
        name: inputValue,
      });

      setAttribute((prev) => [...prev, res?.data.data]);
      toast.success("Tạo thành công");
      setIsAdd(false);
      setInputValue("");
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };
  // if (true) {
  //   return (
  //     <>
  //       <div className="py-10">
  //         <Skeleton className="w-40 h-10 rounded-xl mb-10" />
  //         <Skeleton className="w-full h-16 rounded-xl" />
  //         <Skeleton className="w-full h-16 rounded-xl my-3" />
  //         <Skeleton className="w-full h-16 rounded-xl" />
  //       </div>
  //     </>
  //   );
  // }
  return (
    <>
      {role !== "boss" ? (
        <div className="text-center text-3xl font-bold">
          Chỉ chủ cửa hàng mới xem được trang này
        </div>
      ) : (
        <div>
          <button
            className="py-2 px-5 bg-green-500 rounded-2xl text-white font-bold mb-7"
            onClick={() => setIsAdd((prev) => !prev)}
          >
            Thêm một biến thể mới
          </button>
          {attribute.map((item) => (
            <section key={item._id}>
              <div
                className={`bg-white py-5 px-10 items-center ${
                  item._id === activeArrow
                    ? "rounded-t-3xl"
                    : "rounded-3xl mb-5"
                }`}
              >
                <div className="flex justify-between transition-all">
                  <p className="text-xl font-bold">{item.name}</p>
                  <i
                    className={`${
                      activeArrow === item._id
                        ? "ri-arrow-down-line"
                        : "ri-arrow-up-line"
                    } text-xl font-bold cursor-pointer`}
                    onClick={() => {
                      setAttributeValue([]);
                      toggleArrow(item._id);
                    }}
                  ></i>
                </div>
              </div>

              <AnimatePresence>
                {activeArrow === item._id && (
                  <motion.div
                    className="bg-white w-full mb-5 overflow-hidden px-10"
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {attributeValue.map((item) => (
                      <div
                        key={item._id}
                        className="border-b text-xl mb-5 flex justify-between items-center"
                      >
                        {editId === item._id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => handleSave(item._id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSave(item._id);
                            }}
                            autoFocus
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          <p>{item.name}</p>
                        )}
                        {ID_DEFAULT === item._id ? (
                          <div className="flex gap-5">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <i
                                  className="ri-delete-bin-line cursor-pointer"
                                  onClick={() => setIdDelete(item._id)}
                                ></i>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Bạn có chắc muốn xóa không?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Khi bạn xóa, biến thể sẽ biến mất hoàn
                                    toàn!!!
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="hover:bg-red-500 text-white"
                                    onClick={() => handleDelete(idDelete)}
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <i
                              className="ri-edit-line cursor-pointer"
                              onClick={() => handleEdit(item)}
                            ></i>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}

                    {ID_DEFAULT !== item._id ? (
                      <div className="flex items-center gap-2 mb-5">
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddNew();
                          }}
                          placeholder="Thêm giá trị mới"
                          className="border rounded px-2 py-1 flex-1"
                        />
                        <i
                          className="ri-add-line text-2xl cursor-pointer text-green-500"
                          onClick={handleAddNew}
                        ></i>
                      </div>
                    ) : (
                      <></>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          ))}
        </div>
      )}

      {isAdd && (
        <motion.div
          className="bg-white py-3 px-10 rounded-3xl flex justify-between"
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ height: 64, opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            ref={inputRef}
            onChange={handleInputChange}
            className="pl-2 text-xl font-bold outline rounded-md py-2"
          />
          {inputValue !== "" ? (
            <i
              className="ri-add-line text-2xl cursor-pointer text-green-500"
              onClick={handleAddNewAttribute}
            ></i>
          ) : (
            <i
              className="ri-close-line text-2xl cursor-pointer text-red-500"
              onClick={() => {
                setIsAdd(false);
                setInputValue("");
              }}
            ></i>
          )}
        </motion.div>
      )}
      <ToastContainer />
    </>
  );
};

export default VariantPage;
