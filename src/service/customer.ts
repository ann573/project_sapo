import { instance } from ".";
import { AxiosResponse } from 'axios';
import { ICustomer } from './../interface/ICustom';

type Customer = {
  name: string;
  tel: string;
};
export const searchCustomer = async (query: string) => {
  const { data }: { data: ICustomer[] } = await instance.get(
    `/customers?tel_like=${query}`
  );
  return data;
};

export const getCustomer = async (id: string | number): Promise<ICustomer> => {
  const { data }: { data: ICustomer } = await instance.get(`/customers/${id}`);
  return data;
};

export const createCustomer = async (
  dataBody: Customer
): Promise<ICustomer> => {
  const { data }: { data: ICustomer } = await instance.post(
    `/customers`,
    dataBody
  );
  return data;
};

export const removeCustomer = async (id:string) =>{
    const res: AxiosResponse<ICustomer> = await instance.delete(`/customers/${id}`) 
    return res
}

export const updateCustomer = async (dataBody: ICustomer, id:string) =>{
    const {data}: { data: ICustomer } = await instance.patch(`/customers/${id}`, dataBody) 
    return data
}
export const getCustomerById = async (id: string | number): Promise<ICustomer> => {
    const { data }: { data: ICustomer } = await instance.get(`/customers/${id}`)
    return data
}