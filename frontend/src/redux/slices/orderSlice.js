import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: []
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        createOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        },
        updateOrder: (state, action) => {
            state.orders = state.orders.map(order =>
                order.id === action.payload.id ? action.payload : order
            );
        }
    },
});

export const { createOrder, removeOrder, updateOrder, setOrders } = orderSlice.actions;

export default orderSlice.reducer;
