import React from 'react';
import BuyButton from '../dumbComponents/Buttons/BuyButton';

const AddToCartModal = (props) => {
    if(props.user !== 'Guest'){
        let sizes = Object.keys(props.availability);
        let availableSizes = sizes.map(item => {
            if(props.availability[item] > 0){
                return(
                    <p id={item} key={item} onClick={props.choosingSize} className="fx-basic sizes-available size-on-card-number">{item}</p>
                )
            }
            else return null;
        })
        return (
            <div className="add-to-cart-modal">
              <div className="size-title-on-card">Choose size and amount:</div>
              <div className="fx-basic fx-justify-center">
            <div className="fx-basic fx-justify-center">
                <div className="fx-basic fx-wrap size-on-card-container" id="card-size-container">
                {availableSizes}
                </div>
                </div>
            </div>
            <div className={`error-size ${props.error ? "" : "visibility-none"}`}><span>{props.error ? `${props.errorMessage}` : "Basic error"}</span></div>
            <div className="fx-basic fx-justify-around fx-align-center amount-and-buy-on-card">
                <input type="number" min={1} defaultValue={1} onChange={props.choosingAmount}/>
                
                <BuyButton click={props.addToCart} text='Add' klasa="buy_button"/>
            </div>
            </div>
        );
    }
    else{
    }
};

export default AddToCartModal;