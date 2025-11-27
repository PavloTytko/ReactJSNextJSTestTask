import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export interface Order {
    id: number;
    title: string;
    date: string;
    description?: string;
    products?: any[];
}

interface OrdersState {
    items: Order[];
    loading: boolean;
    error?: string;
}

const initialState: OrdersState = {items: [], loading: false};

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ""}/rest/orders`);
    return res.data as Order[];
});

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        removeOrder(state, action: PayloadAction<number>) {
            state.items = state.items.filter((o) => o.id !== action.payload);
        },
        addOrder(state, action: PayloadAction<Order>) {
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
            });
    }
});

export const {removeOrder, addOrder, setOrders} = ordersSlice.actions;
export default ordersSlice.reducer;
