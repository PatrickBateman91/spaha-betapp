import React from 'react';
import { getRandomNumbers } from '../../../SharedComponents/ReusableFunctions';
import HomeItem from './HomeItem';
import ShowMore from './ShowMore';
import './styles.scss';

const Category = (props) => {
    let randomNumbersArray = [];
    let numberOfItems = 8;
    let windowWidth = window.screen.width;

    if(windowWidth < 480){
        numberOfItems = 4
    }

    else if(windowWidth >= 480 && windowWidth < 768){
        numberOfItems = 4;
    }

    else if(windowWidth >= 768 && windowWidth < 1150){
        numberOfItems = 5;
    }

    else if(windowWidth >= 1150 && windowWidth < 1700){
        numberOfItems = 6;
    }

    if (props.items.length > 0) {
        randomNumbersArray = getRandomNumbers(props.items.length - 1, numberOfItems);
    }

    const itemsDivs = props.items.map((item, index) => {
        if (randomNumbersArray.indexOf(index) !== -1 && randomNumbersArray.length > 2) {
            randomNumbersArray = randomNumbersArray.filter(num => num !== index);
            return <HomeItem altText={props.title} item={item} key={item._id} text={props.title === "Popular" ? `${item.sold} sold this month` : item.brand} />
        } else return null;
    })

    return (
        <div className="categories-container fx-column">
            <div className="categories-title">
                <span>{props.title}</span>
            </div>
            <div className="categories-body fx-basic fx-justify-around">
                {itemsDivs}
                <ShowMore href={props.href} items={props.items} randomNumbersArray={randomNumbersArray} />
            </div>
        </div>
    );
};

export default Category;