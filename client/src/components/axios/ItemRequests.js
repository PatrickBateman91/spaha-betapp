import axios from 'axios';
import {currentUrl} from '../dumbComponents/Mode';


export const creditCardRequest = (type, formData) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/checkout/finalize-purchase`, {formData}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })   
}

export const payPalRequest = (type) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/checkout/finalize-purchase`, {}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })   
}