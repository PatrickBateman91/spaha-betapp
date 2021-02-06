import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

const CheckOutButton = (props) => {
    return (
        <div onClick={props.goToCheckOut} className="fx-basic fx-justify-around fx-align-center go-to-checkout-button">
                       <FontAwesomeIcon icon={faLock} />
           <span> Go to Checkout</span>
        </div>
    );
};

export default CheckOutButton;