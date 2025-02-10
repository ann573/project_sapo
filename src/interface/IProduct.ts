export interface IProduct {
    _id:string,
    name: string,
    price: number,
    sort_title: string,
    quantity: number,
    variants: [{
        _id: string,
        attributeType: string,
        size: string,
        stock: number,
        price: number
    }]
}
export interface IProductBefore {
    name: string,
    price: number,
    sku: string,
    sort_title: string,
    quantity:number
}