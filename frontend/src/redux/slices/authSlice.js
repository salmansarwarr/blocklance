import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    message: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.message = "Login successful";
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.message = "Logout successful";
        },
        update: (state, action) => {
            state.user = action.payload
        }
    },
});

export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
