import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service";
import { ICustomer } from './../../interface/ICustom';
import { createCustomer, getCustomerById, removeCustomer, updateCustomer } from './../../service/customer';

type Customer = {
  name: string;
  tel: string;
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({ page, limit, searchQuery }: { page: number ; limit: number; searchQuery: string }) => {
    const query = searchQuery ? `&telephone=${searchQuery}` : ""; 
    const response = await instance.get(
      `customers?skip=${(page-1)*limit}&limit=${limit}${query}`
    );
    return response.data;
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (data: Customer) => {
    return await createCustomer(data);
  }
);

export const updateNewCustomer = createAsyncThunk(
  "customers/updateNewCustomer",
  async ({ data, id }: { data: ICustomer; id: string }) => {
    return await updateCustomer(data, id);
  }
);

export const removeOneCustomer = createAsyncThunk(
  "customers/removeOneCustomer",
  async (id: string) => {
    await removeCustomer(id);
    return id;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id: string) => {
    return await getCustomerById(id);
  }
);
