import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export interface Price {
    value: number;
    symbol: string;
    isDefault: number;
}

export interface Guarantee {
    start: string;
    end: string;
}

export interface Product {
    id: number;
    serialNumber?: string;
    photo?: string;
    title: string;
    type: string;
    specification?: string;
    guarantee?: Guarantee;
    price?: Price[];
    order?: number;
    date?: string;
}

interface ProductsState {
    items: Product[];
    loading: boolean;
    types: string[];
}

const initialState: ProductsState = {items: [], loading: false, types: []};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    // Choose API base URL depending on runtime (browser vs SSR)
    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser
        ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
        : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
    const res = await axios.get(`${baseUrl}/rest/products`);
    return res.data as Product[];
});

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<Product[]>) {
            state.items = action.payload;
            state.types = Array.from(new Set(action.payload.map((p) => p.type)));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (s) => {
            s.loading = true;
        })
            .addCase(fetchProducts.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload;
                s.types = Array.from(new Set(a.payload.map((p) => p.type)));
            })
            .addCase(fetchProducts.rejected, (s) => {
                s.loading = false;
            });
    }
});

export const {setProducts} = productsSlice.actions;
export default productsSlice.reducer;
