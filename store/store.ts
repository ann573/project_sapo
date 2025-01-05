import { configureStore } from '@reduxjs/toolkit'
import productReducer from "./../src/features/products/productSlice"
import customerReducer from "../src/features/customers/customerSlice"
export const store = configureStore({
  reducer: {
    products: productReducer,
    customers : customerReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch