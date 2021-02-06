import React  from 'react';
import ShoppingItem from '../view/ShoppingItem';

const Suggestions = (props) => {
        return (
            <div className="sugesstions-container fx-basic fx-wrap fx-align-start">
                 <ShoppingItem
                   addToCart={props.addToCart}
                    className="shopping-item sh-item-half"
                    error={props.error}
                    errorMessage={props.errorMessage}
                    discounts={props.discounts}
                    handleModal={props.handleModal}
                    items={props.suggestions}
                    isAddToCartClicked={props.isAddToCartClicked}
                    itemToCart={props.itemToCart}
                    location="suggestions"
                    user={props.user}         
                    />
            </div>
        );
    
};

export default Suggestions;