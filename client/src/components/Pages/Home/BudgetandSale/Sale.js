import React from 'react';
import { getRandomNumbers } from '../../../SharedComponents/ReusableFunctions';
import SaleItem from './SaleItem';
import './styles.scss';

const Sale = (props) => {
    let randomNumbersArray = [];
    if(props.items.length > 0){
        randomNumbersArray = getRandomNumbers(props.items.length - 1, 2);
    }

    const itemsDivs = props.items.map((item, index) => {
        if(randomNumbersArray.indexOf(index) !== -1){
             randomNumbersArray = randomNumbersArray.filter(num => num !== index);
             return <SaleItem discounts={props.discounts} item={item} key={item._id}/>
        } else return null;
    })

    return (
        <div className="budget-sale-holder fx-column">
            <div className="budget-sale-image-container fx-basic fx-wrap fx-justify-center">
                {itemsDivs}
            </div>
            <div className="sale-text-container fx-column fx-align-center fx-justify-between">
                <div className="budget-sale-title">
                    It's always sale in Philadelphia
                </div>
                <div className="budget-sale-link">
                    <a href="/shop/discounts">Discover more</a>
                </div>
            </div>
        </div>
    );
};

export default Sale;