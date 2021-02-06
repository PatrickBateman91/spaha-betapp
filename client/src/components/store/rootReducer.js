import {combineReducers} from 'redux';
import shopReducer from './ShopSlice'
import userReducer from './userSlice';
import appStateReducer from './appStateSlice';
import adminReducer from './adminSlice';

const rootReducer = combineReducers({
    admin:adminReducer,
    appStates: appStateReducer,
    shop: shopReducer,
    user: userReducer
});

export default rootReducer;
