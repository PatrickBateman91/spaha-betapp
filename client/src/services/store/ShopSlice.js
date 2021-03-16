import {createSlice} from '@reduxjs/toolkit';  
 
const initState =  {
  budgetItems: [],
  items: [],
  filteredItems: [],
  newArrivals: [],
  popularItems: [],
  saleItems:[],
  userRatings:[],
  userFavourites:[]
}


const shopSlice = createSlice({
    name: "shop",
    initialState: initState,
    reducers:{
      addNewItem: (state, action) => {
        state.items.push(action.payload);
        return state;
      },

      setBudgetItems: (state, action) => {
        state.budgetItems = action.payload;
        return state;
      },

      setFilteredItems: (state, action) => {
        state.filteredItems = action.payload;
        return state;
      },

      setNewArrivals: (state, action) => {
        state.newArrivals = action.payload;
        return state;
      },

      setPopularItems: (state, action) => {
        state.popularItems = action.payload;
        return state;
      },

      setSaleItems: (state, action) => {
        state.saleItems = action.payload;
        return state;
      },

      updateItemRating: (state, action) => {
        for(let i = 0; i < state.items.length; i++){
          if(state.items[i]._id === action.payload.id){
            state.items[i].rating = action.payload.rating;
            state.items[i].numberOfVotes = action.payload.numberOfVotes;
            break;
          }
        }
          return state;
      },

      updateSingleItem: (state, action) => {
        for(let i = 0; i < state.items.length; i++){
          if(state.items[i]._id === action.payload._id){
            state.items[i] = action.payload;
            break;
          }
        }
        return state;
      },
      
      updateShop : (state, action) => {
          state.items = action.payload;
          return state;
      },
    }
})

export default shopSlice.reducer;