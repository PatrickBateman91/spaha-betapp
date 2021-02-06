import { createSlice } from '@reduxjs/toolkit';

const initState = "guest";


const userSlice = createSlice({
    name: "user",
    initialState: initState,
    reducers: {

        logOutUser(state){
            state = initState;
            return state;
        },
        newContactForm(state,action){
            state.contactForms.push(action.payload);
            return state;
        },

        setAdminFeedbackData(state, action){
            state.contactForms = action.payload;
            return state;
        },
       updateUser(state, action) {
            state = action.payload;
            return state;
        },
       updateCart(state, action){
            state.userCart = action.payload;
            return state;
        },
        updateContactForm(state, action){
        const searchId = action.payload._id;
        for(let i = 0; i < state.contactForms.length; i++){
            if(state.contactForms[i]._id === searchId){
                state.contactForms[i] = action.payload;
                break;
            }
        }

        return state;
        },
        updateFavourites(state, action){
            state.userFavourites = action.payload;
            return state;
        },
        updatePurchases(state,action){
            state.userPreviousPurchases = action.payload;
            return state;
        },
        updateRatings(state, action){
            state.userRatings = action.payload;
            return state;
        }
    }
})

export default userSlice.reducer;