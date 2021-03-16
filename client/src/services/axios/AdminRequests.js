import axios from 'axios';
import {currentUrl} from '../../components/SharedComponents/Mode';

export const adminResponseRequest = (type, message) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {message}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const changeDiscountsRequest = (type, discounts) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {discounts}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const deleteDiscountRequest = (type, name) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {name}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const getAdminFeedbackRequest = (type) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.get(`${currentUrl}/admin-dashboard`, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const getAdminData = (type) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.get(`${currentUrl}/admin-dashboard`, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const markAsAdminRead = (type, message) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {message}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const markAsResolved = (type, id) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {id}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const newDiscountRequest = (type, discountObject) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {discountObject}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const uploadChartData = (type, data) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }
    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, {data}, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const uploadNewItemRequest = (type, formData) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, formData, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}

export const sendNewsletterRequest = (type, data) => {
    const LS = localStorage.getItem('shop-app-token');
    const config = {
        headers: {
            Authentication: LS,
            type
        }
    }

    return new Promise ((resolve, reject) => {
        axios.post(`${currentUrl}/admin-dashboard`, data, config).then(response => {
            resolve(response);
        }).catch(err =>{
            reject(err);
        })
    })
}