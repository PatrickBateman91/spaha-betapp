import React from 'react';
import Category from '../Category';
import '../styles.scss';

const NewArrivals = (props) => {
    return (
        <Category href="/shop/new-arrivals" items={props.items} title="New Arrivals"/>
    );
};

export default NewArrivals;