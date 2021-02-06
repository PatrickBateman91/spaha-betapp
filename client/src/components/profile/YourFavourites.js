import React from 'react';
import ShoppingItem from '../view/ShoppingItem';
import EmptyProfile from '../dumbComponents/EmptyProfile';

const YourFavourites = (props) =>  {
if(props.favourites.length === 0){
    return    <EmptyProfile message="You have no favourites so far"/>
} else{
    return (
        <div className="favourites-container fx-basic fx-wrap fx-align-start">
     <ShoppingItem 
     addToCart={props.addToCart}
     className="shopping-item sh-item-half" 
     discounts={props.discounts}
     error={props.error}
     errorMessage={props.errorMessage}
     handleModal={props.handleModal} 
     items={props.favourites}
     itemToCart={props.itemToCart}
     isAddToCartClicked={props.isAddToCartClicked} 
     location="favourites"
     user={props.user} 
     />
        </div>
    );
}


};



export default YourFavourites;