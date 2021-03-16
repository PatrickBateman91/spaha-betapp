const getPopularItems = (items) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let popularItems = [];

    items[currentMonth].brands.forEach(brand => {
        brand.individualItems.forEach(item => {
            if(item.sold >= 15){
                popularItems.push(item)
            }
        })
    })

    return popularItems;
}

module.exports = {
    getPopularItems
}