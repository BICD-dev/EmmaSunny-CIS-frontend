import { apiClient } from "./client";
import type { ProductApiResponse } from "./officerApi";

export interface CreateProductData {
    name:string,
    description:string,
    price:string,
}

export interface Product {
    id:string,
    product_name:string,
    description:string,
    price:string,
    valid_period:number,
    created_at:Date,
    updated_at:Date
}

export const productApi = {
    // Get all products
    getAllProducts: async ():Promise<ProductApiResponse<Product[]>> =>{
        const response = await apiClient.get('/product');
        return response.data;
    },

    // get Single product
    getProduct: async (id:string):Promise<ProductApiResponse<Product>> =>{
        const response = await apiClient.get(`/product/${id}`)
        return response.data;
    },

    // create product
    createProduct: async (data:CreateProductData): Promise<ProductApiResponse<Product>> =>{
        const response = await apiClient.post('/product', data);
        return response.data;
    },

    // delete product
    deleteProduct: async (id: string): Promise<ProductApiResponse<null>> => {
    const response = await apiClient.delete(`/product/${id}`);
    return response.data;
  },
}