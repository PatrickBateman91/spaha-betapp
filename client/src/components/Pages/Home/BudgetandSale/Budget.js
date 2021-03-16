import React from 'react';
import { getRandomNumbers } from '../../../SharedComponents/ReusableFunctions';
import BudgetItem from './BudgetItem';
import './styles.scss';

const Budget = (props) => {
    let randomNumbersArray = [];
    if(props.items.length > 0){
        randomNumbersArray = getRandomNumbers(props.items.length - 1, 2);
    }

    const itemsDivs = props.items.map((item, index) => {
        if(randomNumbersArray.indexOf(index) !== -1){
             randomNumbersArray = randomNumbersArray.filter(num => num !== index);
             return <BudgetItem item={item} key={item._id}/>
        } else return null;
    })

    return (
        <div className="budget-sale-holder fx-column">
            <div className="budget-sale-image-container fx-basic fx-wrap fx-justify-center">
            {itemsDivs}
            </div>
            <div className="budget-text-container fx-column fx-wrap fx-align-center fx-justify-between">
                <div className="budget-sale-title">
                    <span>Tight on budget? No problem.</span>
                </div>
                <div className="budget-sale-link">
                    <a href="/shop/budget">Discover more</a>
                </div>
            </div>
        </div>
    );
};

export default Budget;