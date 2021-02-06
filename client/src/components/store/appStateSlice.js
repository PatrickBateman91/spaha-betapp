import { createSlice } from '@reduxjs/toolkit';

const initState = {
    appLoaded: false,
    costType: null,
    filters: {
        brand: [],
        size: []
    },
    filteredReady: false,
    needsUpdate:false,
    page: "1",
    secondarySortModal:false,
    secondarySortModalText:"Sort by",
    sorts: {
        price: [],
        discount: [],
        gender:[]
      },
    usingSort: false,
    usingSecondarySort:false,
    usingFilter: false
}


const appStateSlice = createSlice({
    name: "appStates",
    initialState: initState,
    reducers: {

        isFilteredReady: (state, action) => {
            state.filteredReady = action.payload;
            return state;
        },

        needsUpdateFunction: (state, action) => {
            state.needsUpdate = action.payload;
            return state;
        },

        pageReady: (state, action) => {
            state.appLoaded = action.payload;
            return state;
        },

        setCostType: (state, action) => {
            state.costType = action.payload;
            return state;
        },

        setFilters: (state, action) => {
            state.filters = action.payload
            return state;
        },

        setPage:(state, action) => {
            state.page = action.payload;
            return state;
        },

        setSecondarySort: (state, action) => {
            state.usingSecondarySort = action.payload;
            return state;
        },

        setSecondarySortModal: (state, action) => {
            state.secondarySortModal = action.payload;
            return state;
        },
        setSecondarySortModalText: (state, action) => {
            state.secondarySortModalText = action.payload;
            return state;
        },

        setSorts: (state, action) => {
            state.sorts = action.payload
            return state;
        },

        usingFilter: (state,action) => {
            state.usingFilter = action.payload;
            return state;
        },

        usingSort : (state, action) => {
            state.usingSort = action.payload;
            return state;
        }
    }
})
export const { pageReady } = appStateSlice.actions;

export default appStateSlice.reducer;