import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
}

// primary function is to add jobs with already generated descriptions and store temporarily
const atsDataSlice = createSlice({
    name: 'atsData',
    initialState,
    reducers: {
        addJob: (state, action) => {
            state.jobs.push(action.payload)
        },
        removeJob: (state, action) => {
            const {value} = action.payload;
            const index = (state.jobs).findIndex(val => val === value);
            state.jobs.pop(index)
        },
        clearJobs: (state) => {
            state.jobs = []
        }
    }
    
})

export const { addJob, removeJob, clearJobs } = atsDataSlice.actions

export default atsDataSlice.reducer;