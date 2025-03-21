import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    jobRoles: [],
    locations: [],
    companies: [],
    fields: []
}

const inputSlice = createSlice({
    name: 'inputs',
    initialState,
    reducers: {
        addJobRole: (state, action) => {
            state.jobRoles.push(action.payload)
        },
        removeJobRole: (state, action) => {
            const {value} = action.payload;
            const index = state.jobRoles.findIndex(val => val === value);
            if (index !== -1) { // Only splice if item exists
                state.jobRoles.splice(index, 1);
            }
            
        },
        addLocation: (state, action) => {
            state.locations.push(action.payload)
        },
        removeLocation: (state, action) => {
            const {value} = action.payload;
            const index = state.locations.findIndex(val => val === value);
            if (index !== -1) {
                state.locations.splice(index, 1);
            }
        },
        addCompany: (state, action) => {
            state.companies.push(action.payload)
        },
        removeCompany: (state, action) => {
            const {value} = action.payload;
            const index = state.companies.findIndex(val => val === value);
            if (index !== -1) {
                state.companies.splice(index, 1);
            }
        },
        addField: (state, action) => {
            state.fields.push(action.payload)
        },
        removeField: (state, action) => {
            const {value} = action.payload;
            const index = state.fields.findIndex(val => val === value);
            if (index !== -1) {
                state.fields.splice(index, 1);
            }       
        }
    }
})

export const {  addJobRole,
                removeJobRole, 
                addLocation, 
                removeLocation, 
                addCompany, 
                removeCompany, 
                addField, 
                removeField } 
                
                = inputSlice.actions

export default inputSlice.reducer;