import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export interface Order {
    id: number;
    title: string;
    date: string;
    description?: string;
    photo?: string;
    products?: any[];
}

interface OrdersState {
    items: Order[];
    loading: boolean;
    error?: string;
}

const initialState: OrdersState = {items: [], loading: false};

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
    // Choose API base URL depending on runtime (browser vs SSR)
    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser
        ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
        : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
    const res = await axios.get(`${baseUrl}/rest/orders`);
    return res.data as Order[];
});

export const createOrder = createAsyncThunk(
    "orders/create",
    async (order: Omit<Order, "id">) => {
        const isBrowser = typeof window !== "undefined";
        const baseUrl = isBrowser
            ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
            : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
        const res = await axios.post(`${baseUrl}/rest/orders`, order);
        return res.data as Order;
    }
);

export const deleteOrder = createAsyncThunk(
    "orders/delete",
    async (id: number) => {
        const isBrowser = typeof window !== "undefined";
        const baseUrl = isBrowser
            ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
            : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
        await axios.delete(`${baseUrl}/rest/orders/${id}`);
        return id;
    }
);

export const addProductToOrder = createAsyncThunk(
    "orders/addProductToOrder",
    async (params: { orderId: number; productId: number }) => {
        const isBrowser = typeof window !== "undefined";
        const baseUrl = isBrowser
            ? (process.env.NEXT_PUBLIC_API_URL_BROWSER || process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000")
            : (process.env.NEXT_PUBLIC_API_URL || "http://api:4000");
        const res = await axios.post(`${baseUrl}/rest/orders/${params.orderId}/products`, { productId: params.productId });
        return res.data as Order; // updated order
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        removeOrder(state, action: PayloadAction<number>) {
            // kept for potential local updates, but API thunk preferred
            state.items = state.items.filter((o) => o.id !== action.payload);
        },
        addOrder(state, action: PayloadAction<Order>) {
            // kept for potential local updates, but API thunk preferred
            state.items.push(action.payload);
        },
        setOrders(state, action: PayloadAction<Order[]>) {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (s) => {
            s.loading = true;
            s.error = undefined;
        })
            .addCase(fetchOrders.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload;
            })
            .addCase(fetchOrders.rejected, (s, a) => {
                s.loading = false;
                s.error = a.error.message;
            })
            .addCase(createOrder.fulfilled, (s, a) => {
                s.items.push(a.payload);
            })
            .addCase(deleteOrder.fulfilled, (s, a) => {
                s.items = s.items.filter((o) => o.id !== a.payload);
            })
            .addCase(addProductToOrder.fulfilled, (s, a) => {
                const idx = s.items.findIndex((o) => o.id === a.payload.id);
                if (idx >= 0) s.items[idx] = a.payload;
            });
    }
});

export const {removeOrder, addOrder, setOrders} = ordersSlice.actions;
export default ordersSlice.reducer;
