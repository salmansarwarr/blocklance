import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import authReducer from './slices/authSlice';
import gigReducer from './slices/gigSlice';
import orderReducer from './slices/orderSlice';
import disputeReducer from './slices/disputesSlice'
import { useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        authReducer,
        exampleReducer,
        gigReducer,
        orderReducer,
        disputeReducer
    },
});

export const useAppSelector = useSelector;
