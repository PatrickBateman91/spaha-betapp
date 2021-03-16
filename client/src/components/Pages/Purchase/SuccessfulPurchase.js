import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import './styles.scss';

const SuccessfulPurchase = (props) => {
    return (
        <div className="fx-column fx-justify-around fx-align-center payment-success-container">
            <div className="payment-complete-title">THANK YOU!</div>
           <div className="fx-column fx-align-center">
           <div className="fx-basic fx-align-center">
           <div>Purchase completed successfuly!</div>
           <FontAwesomeIcon icon={faCheck} />
           </div>
            <div>Items will be shipped to your address in 5-7 work days!</div>
           </div>
            <div><button onClick={props.continueShopping} className="continue-shopping-button">CONTINUE SHOPPING</button></div>
        </div>
    );
};

export default SuccessfulPurchase;