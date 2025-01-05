import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service";
import { ICustomer } from './../../interface/ICustom';
import { createCustomer, getCustomerById, removeCustomer, updateCustomer } from './../../service/customer';


export const fetchCustomers = createAsyncThunk(
  "products/fetchCustomers",
  async ({ page, limit, searchQuery }: { page: number; limit: number; searchQuery: string }) => {
    const query = searchQuery ? `&q=${searchQuery}` : ""; 
    const response = await instance.get(
      `customers?_page=${page}&_limit=${limit}${query}`
    );
    return response.data;
  }
);

export const addCustomer = createAsyncThunk(
  "products/addCustomer",
  async (data: ICustomer) => {
    return await createCustomer(data);
  }
);

export const updateNewCustomer = createAsyncThunk(
  "products/updateNewCustomer",
  async ({ data, id }: { data: ICustomer; id: string }) => {
    return await updateCustomer(data, id);
  }
);

export const removeOneCustomer = createAsyncThunk(
  "products/removeOneCustomer",
  async (id: string) => {
    await removeCustomer(id);
    return id;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "products/fetchCustomerById",
  async (id: string) => {
    return await getCustomerById(id);
  }
);
