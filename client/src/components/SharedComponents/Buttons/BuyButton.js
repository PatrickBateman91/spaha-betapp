import React from 'react';
import './styles.scss';

const BuyButton = (props) => {
    return (
        <div onClick={props.click} className={props.klasa}>
            {props.text}
        </div>
    );
};

export default BuyButton;