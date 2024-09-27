import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gigs: []
};

export const gigSlice = createSlice({
    name: "gig",
    initialState,
    reducers: {
        setGigs: (state, action) => {
            state.gigs = action.payload
        },
        createGig: (state, action) => {
            state.gigs.push(action.payload);
        },
        removeGig: (state, action) => {
            state.gigs = state.gigs.filter(gig => gig.id !== action.payload);
        },
        updateGig: (state, action) => {
            state.gigs = state.gigs.map(gig =>
                gig.id === action.payload.id ? action.payload : gig
            );
        }
    },
});

export const { createGig, removeGig, updateGig, setGigs } = gigSlice.actions;

export default gigSlice.reducer;
