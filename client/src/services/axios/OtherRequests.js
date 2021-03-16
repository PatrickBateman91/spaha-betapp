import axios from 'axios';
import {currentUrl} from '../../components/SharedComponents/Mode';

export const contactFormRequest = (data) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/contact-us`, data, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const newsLetterRequest = (type, email) => {

    const config = {
        headers: {
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/`, {email}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}