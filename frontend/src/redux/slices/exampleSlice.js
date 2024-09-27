import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "Hi"
};

export const exampleSlice = createSlice({
    name: "blocklance",
    initialState,
    reducers: {
        setState: (state, action) => {
            state = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        }
    },
});

export const {
    setState,
    setMessage
} = exampleSlice.actions;

export default exampleSlice.reducer;
