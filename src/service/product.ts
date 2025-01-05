import { AxiosResponse } from "axios";
import { instance } from ".";
import { IProduct, IProductBefore } from './../interface/IProduct';

export const searchProduct = async (query: string) => {
    query = query.toUpperCase()
    const { data }: { data: IProduct[] } = await instance.get(`/products?sort_title_like=${query}`)
    return data
}

export const getProductById = async (id: string | number): Promise<IProduct> => {
    const { data }: { data: IProduct } = await instance.get(`/products/${id}`)
    return data
}

export const getAllProducts = async (): Promise<IProduct[]> => {
    const { data }: { data: IProduct[] } = await instance.get(`/products`)
    return data
}


export const createProducts = async (product: IProductBefore): Promise<IProduct> => {
    const { data }: { data: IProduct }  = await instance.post(`/products`,product)
    return data
}

export const updateProducts = async (dataBody: IProductBefore, id:string) =>{
    const {data}: { data: IProduct } = await instance.patch(`/products/${id}`, dataBody) 
    return data
}   

export const removeProduct = async (id:string) =>{
    const res: AxiosResponse<IProduct> = await instance.delete(`/products/${id}`) 
    return res
}