import React from 'react';
import Category from '../Category';
import '../styles.scss';

const Popular = (props) => {
    return (
        <Category href="/shop/popular" items={props.items} title="Popular"/>
    );
};

export default Popular;