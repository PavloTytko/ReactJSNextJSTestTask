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
    isNew?: number;
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

export const createProduct = createAsyncThunk(
    "products/create",
    async (product: Omit<Product, "id">) => {
        const isBrowser = typeof window !== "undefined";
        const baseUrl = isBrowser
            ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
            : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
        const res = await axios.post(`${baseUrl}/rest/products`, product);
        return res.data as Product;
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<Product[]>) {
            state.items = action.payload;
            state.types = Array.from(new Set(action.payload.map((p) => p.type)));
        },
        addProduct(state, action: PayloadAction<Product>) {
            state.items.push(action.payload);
            if (action.payload.type && !state.types.includes(action.payload.type)) {
                state.types.push(action.payload.type);
            }
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
            })
            .addCase(createProduct.fulfilled, (s, a) => {
                s.items.push(a.payload);
                const t = a.payload.type;
                if (t && !s.types.includes(t)) s.types.push(t);
            });
    }
});

export const {setProducts, addProduct} = productsSlice.actions;
export default productsSlice.reducer;
