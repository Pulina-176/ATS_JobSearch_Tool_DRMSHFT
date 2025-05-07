// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     jobs: [],
// }

// // primary function is to add jobs with already generated descriptions and store temporarily
// const atsDataSlice = createSlice({
//     name: 'atsData',
//     initialState,
//     reducers: {
//         addJob: (state, action) => {
//             state.jobs.push(action.payload)
//         },
//         removeJob: (state, action) => {
//             const {value} = action.payload;
//             const index = (state.jobs).findIndex(val => val === value);
//             state.jobs.pop(index)
//         },
//         clearJobs: (state) => {
//             state.jobs = []
//         }
//     }
    
// })

// export const { addJob, removeJob, clearJobs } = atsDataSlice.actions

// export default atsDataSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
    selectedJobs: [],
    allJobs: [], // Add allJobs to persist job data
}

const atsDataSlice = createSlice({
    name: 'atsData',
    initialState,
    reducers: {
        addJob: (state, action) => {
            state.jobs.push(action.payload);
        },
        removeJob: (state, action) => {
            const { value } = action.payload;
            const index = state.jobs.findIndex(val => val === value);
            state.jobs.splice(index, 1);
        },
        clearJobs: (state) => {
            state.jobs = [];
        },
        updateSelectedJobs: (state, action) => {
            state.selectedJobs = action.payload;
        },
        addSelectedJob: (state, action) => {
            state.selectedJobs.push(action.payload);
        },
        removeSelectedJob: (state, action) => {
            state.selectedJobs = state.selectedJobs.filter(
                job => job.link_no !== action.payload.link_no
            );
        },
        clearSelectedJobs: (state) => {
            state.selectedJobs = [];
        },
        updateAllJobs: (state, action) => {
            state.allJobs = action.payload; // Reducer to update allJobs
        },
        clearAllJobs: (state) => {
            state.allJobs = [];
        }
    }
});

export const {
    addJob,
    removeJob,
    clearJobs,
    updateSelectedJobs,
    addSelectedJob,
    removeSelectedJob,
    clearSelectedJobs,
    updateAllJobs,
    clearAllJobs
} = atsDataSlice.actions;

export default atsDataSlice.reducer;