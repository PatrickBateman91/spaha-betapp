import React, { Fragment } from 'react';
import {shortenWord, windowWidth} from '../dumbComponents/ReusableFunctions';
import CheckOutButton from '../dumbComponents/Buttons/CheckOutButton';
import BackToStoreButton from '../dumbComponents/Buttons/BackToStoreButton';

const OrderSummary = (props) => {
    let items = props.cartItems.map((item, index) => {
        return (
            <div className="fx-basic fx-justify-between order-list-item" key={item.fullName + index}>
                <div>
                    {shortenWord(item.fullName,3)}
        {item.amount > 1 ?<span>{`  x${item.amount}`}</span> : null}
                </div>
                <div>
                    {(item.cost * item.amount).toFixed(2)}$
                </div>
            </div>
        )
    })
    let total = props.cartItems.reduce((acc, curr) => {
        return (curr.cost * curr.amount) + acc;
    },0)

    return (
        <Fragment>
            {props.cartItems.length > 0 ? 
                <div className="order-container order-in-modal">
                    <p>Order Summary:</p>
                    {items}
                    <div className="fx-basic fx-justify-between order-total">
                    <p>Total:</p>
                    <p>{total.toFixed(2)}$</p>
                    </div>
                    <CheckOutButton goToCheckOut={props.goToCheckOut} />
                    {!windowWidth(768) ? <BackToStoreButton backToStore={props.backToStore}/> : null}
                     </div>  : null}
       
        </Fragment>
    );
};

export default OrderSummary;