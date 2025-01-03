import { instance } from ".";
import { IProduct } from './../interface/IProduct';

export const searchProduct = async (query: string) => {
    query = query.toUpperCase()
    const { data }: { data: IProduct[] } = await instance.get(`/products?sort_title_like=${query}`)
    return data
}

export const getProductById = async (id: string | number): Promise<IProduct> => {
    const { data }: { data: IProduct } = await instance.get(`/products/${id}`)
    return data
}

