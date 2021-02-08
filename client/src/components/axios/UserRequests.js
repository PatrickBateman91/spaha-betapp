import axios from 'axios';
import {currentUrl} from '../dumbComponents/Mode';


export const accountDetailsRequest = (type, details) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/profile:id`, {details}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const addToCartRequest = (path, type, item) =>{
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}${path}`, {item}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const deleteUserPurchaseRequest = (type, id) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/profile:id`, {id}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const getUserRequest = () => {
    let LS = localStorage.getItem('shop-app-token');
    if(!LS){
        LS = "guest"
    }
    const config = {
        headers:{
            Authentication: LS
        }
    }
    return new Promise((resolve, reject) => {
        axios.get(`${currentUrl}/`, config).then(response => {
            return resolve(response);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const newFavouriteRequest = (type, path, item) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}${path}`, {item}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const newRatingRequest = (type, path, item) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}${path}`, {item}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const profileCartRequest = (type, item) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/profile:id`, {item}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const signInRequest = (email, password) => {
    return new Promise((resolve, reject) => {
        axios.post(`${currentUrl}/sign-in`, {email, password}).then(response => {
            localStorage.setItem('shop-app-token', response.data.token)
            return resolve(response);
        }).catch(err => {
            reject(err);
        })
    })
}

export const signOutRequest = () => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/log-out`, {}, config).then(response => {
            localStorage.removeItem('shop-app-token');
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}

export const signUpRequest = (firstName, lastName, userAddress, email, password, newsletter) => {
    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/sign-up`, {firstName, lastName, userAddress, email, password, newsletter}).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const userFeedbackRequest = (type, data) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise((resolve,reject) =>{
        axios.post(`${currentUrl}/profile:id`, {data}, config).then(response => {
            return resolve(response);
         }).catch(err => {
            return reject(err);
         })
    })
}