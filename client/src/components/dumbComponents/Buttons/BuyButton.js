import React from 'react';

const BuyButton = (props) => {
    return (
        <div onClick={props.click} className={props.klasa}>
            {props.text}
        </div>
    );
};

export default BuyButton;