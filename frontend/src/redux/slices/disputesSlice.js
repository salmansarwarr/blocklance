import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allDisputes: [],
    myDisputes: [],
};

export const disputesSlice = createSlice({
    name: "disputes",
    initialState,
    reducers: {
        setAllDisputes: (state, action) => {
            state.allDisputes = action.payload;
        },
        setMyDisputes: (state, action) => {
            state.myDisputes = action.payload;
        },
        addToAllDisputes: (state, action) => {
            state.allDisputes = [...state.allDisputes, action.payload];
        },
        addToMyDisputes: (state, action) => {
            state.myDisputes = [...state.myDisputes, action.payload];
        },
        removeFromAllDisputes: (state, action) => {
            state.allDisputes = state.allDisputes.filter(
                (dispute) => dispute._id !== action.payload
            );
        },
        removeFromMyDisputes: (state, action) => {
            state.myDisputes = state.myDisputes.filter(
                (dispute) => dispute._id !== action.payload
            );
        },
        updateDisputeById: (state, action) => {
            state.allDisputes = state.allDisputes.map((dispute) => {
                if (dispute._id == action.payload._id) {
                    return action.payload;
                } else {
                    return dispute;
                }
            });
        },
    },
});

export const {
    setAllDisputes,
    setMyDisputes,
    addToAllDisputes,
    addToMyDisputes,
    removeFromAllDisputes,
    removeFromMyDisputes,
    updateDisputeById,
} = disputesSlice.actions;

export default disputesSlice.reducer;
