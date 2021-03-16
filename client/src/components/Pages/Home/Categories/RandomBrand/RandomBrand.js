import React from 'react';
import Category from '../Category';
import '../styles.scss';

const RandomBrand = (props) => {
    let randomNum = Math.floor(Math.random() * (props.brands.length - 1)) + 1;
    const selectedBrand = props.brands[randomNum];
    const brandItems = props.items.filter(item => item.brand === selectedBrand);
    return (
        <Category href={`/shop/brand/${selectedBrand}`} items={brandItems} title={`Catch up on ${selectedBrand}`}/>
    );
};

export default RandomBrand; 