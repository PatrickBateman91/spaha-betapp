import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export default function(){
    return configureStore({
        reducer: rootReducer
    })
 
}