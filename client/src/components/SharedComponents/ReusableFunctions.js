export const addToCartVANJSKA = (size, amount, item) => {
    let returnObject = {};
    if (size !== null && amount > 0) {
        if (amount <= item.availability[size]) {
            const newItem = {
                amount,
                name: item._id,
                size
            }
            return {
                isAddToCartClicked: false,
                error: false,
                errorMessage: "",
                newItem
            }
        }
        else {
            returnObject = {
                error: true,
                errorMessage: `We only have ${item.availability[size]} available at the moment!`
            }
        }
    }
    else if (size === null) {
        returnObject = {
            error: true,
            errorMessage: `Please select size`
        }
    }
    return returnObject;
}

export const checkCorrectMailFormat = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

export const filterArray = (newArray) => {
    let uniqueArray = [];
    for (let i = 0; i < newArray.length; i++) {
        let trigger = false;
        for (let j = i + 1; j < newArray.length; j++) {
            if (newArray[i] === newArray[j]) {
                trigger = true;
            }
        }
        if (trigger === false) {
            uniqueArray.push(newArray[i]);
        }
    }

    return uniqueArray;
}

export const filterFunction = (arr, filter) => {
    let newArr = arr.filter(item => {
        return item.brand.toLowerCase() === filter;
    })

    return newArr;
}

export const getBudgetandSales = (items) => {
    let budgetItems = [];
    let saleItems = [];
    let newArrivals = [];

    for(let i = 0; i < items.length; i++ ){
        if(i < 30){
            newArrivals.push(items[i]);
        }

        if(items[i].discount){
            saleItems.push(items[i]);
        }

        if(items[i].cost < 50){
            budgetItems.push(items[i]);
        }
    }

    return [budgetItems, newArrivals, saleItems]
}

export const getPopularItems = (allItems, popular) => {
    let popularArray = [];

    for(let i = 0; i < popular.length; i++){
        for(let j = 0; j < allItems.length; j++){
            if(popular[i]._id === allItems[j]._id){
                popularArray.push(allItems[j]);
                popularArray[popularArray.length - 1].sold = popular[i].sold;
                break;
            }
        }

        if(popularArray.length === popular.length){
            break;
        }
    }

    return popularArray;
}

export const getRandomNumbers = (len, numberOfItems) => {
    let randomNumbersArray = [];
    while(randomNumbersArray.length < numberOfItems){
        let randomNum = Math.floor(Math.random() * len) + 1;
        if(randomNumbersArray.indexOf(randomNum) === -1){
            randomNumbersArray.push(randomNum);
        }
    }

    return randomNumbersArray;
}

export const handleDiscount = (type, discounts) => {
    let returnType = 5;
    for (let i = 0; i < discounts.length; i++) {
        if (type === discounts[i].name) {
            returnType = discounts[i].amount;
            break;
        }
    }
    return returnType;
}

export const joinArrays = (oldArray, newArray) => {
    let uniqueArray = [...oldArray];
    let l = oldArray.length;
    for (let i = 0; i < newArray.length; i++) {
        let trigger = false;
        for (let j = 0; j < l; j++) {
            if (newArray[i].fullName === oldArray[j].fullName) {
                trigger = true;
            }
        }
        if (trigger === false) {
            uniqueArray.push(newArray[i]);
        }
    }

    return uniqueArray;
}

export const passwordCheck = (password) => {
    if (password.length < 6 && password.length > 16) {
        return false;
    }
    const regex = /^(?=.*\d).{6,16}$/;
    return regex.test(password);
}

export const removeDuplicates = (newArray) => {
    let uniqueArray = [];
    for (let i = 0; i < newArray.length; i++) {
        let trigger = false;
        for (let j = i + 1; j < newArray.length; j++) {
            if (newArray[i].fullName === newArray[j].fullName) {
                trigger = true;
            }
        }
        if (trigger === false) {
            uniqueArray.push(newArray[i]);
        }
    }

    return uniqueArray;
}

export const selectRating = (rating) => {
    let value;
    switch (rating) {
        case "star5":
            value = 5;
            break;
        case "star4half":
            value = 4.5;
            break;
        case "star4":
            value = 4;
            break;
        case "star3half":
            value = 3.5;
            break;
        case "star3":
            value = 3;
            break;
        case "star2half":
            value = 2.5;
            break;
        case "star2":
            value = 2;
            break;
        case "star1half":
            value = 1.5;
            break;
        case "star1":
            value = 1;
            break;
        case "starhalf":
            value = 0.5;
            break;

        default:
            value = 3;
            break;
    }
    return value;
}

export const shortenByCharacters = (str, howMuch) => {
    if(str.length > howMuch){
        let newStr = str.split("").splice(0, howMuch).join("");
        return newStr + "...";
    } else return str;
}

export const shortenWord = (str, howMuch) => {
    let newStr = str.split(" ").splice(0, howMuch).join(" ");
    return newStr + "...";
}

export const sizeFunction = (arr, filter) => {
    let newArr = arr.filter(item => {
        return item.availability[filter] > 0;
    })
    return newArr;
}

export const windowWidth = (size) => {
    return window.screen.width > size;
}