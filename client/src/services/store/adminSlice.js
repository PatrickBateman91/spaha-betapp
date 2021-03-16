import {createSlice} from '@reduxjs/toolkit';  
 
const initState =  {
brands:[],
discounts : [],
emails:[],
stats:[]
}


const adminSlice = createSlice({
    name: "admin",
    initialState: initState,
    reducers:{
        addNewDiscount: (state, action) => {
            state.discounts.push(action.payload)
            return state;
        },
        changeDiscounts: (state, action) => {
            state.discounts = action.payload;
            return state;
        },
        deleteDiscount: (state, action) => {
            state.discounts = state.discounts.filter(discount => discount.name !== action.payload);
            return state;
        },
        setAdminData: (state, action) => {
            state = action.payload;
            return state;
        },
        setBrands: (state, action) => {
            state.brands = action.payload;
            return state;
        }
    }
})

export default adminSlice.reducer;