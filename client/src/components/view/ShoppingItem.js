import React,{Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Card from '../dumbComponents/Card';
import BuyButton from '../dumbComponents/Buttons/BuyButton';
import AddToCartModal from '../Cart/AddToCartModal';
import Spinner from '../dumbComponents/Spinner';
import {newFavouriteRequest, newRatingRequest} from '../axios/UserRequests';
import {handleDiscount,selectRating} from '../dumbComponents/ReusableFunctions';

const ShoppingItem = (props) =>  {
    const [amountToBuy, setAmount] = useState(1);
    const [pageReady, setPageReady] = useState(false);
    const [sizesToBuy, setSizes] = useState(null);

    useEffect(() => {
        setPageReady(true);
        if(!props.isAddToCartClicked){
            setSizes(null);
        }
    }, [pageReady, props.isAddToCartClicked])

    const choosingAmount = (e) => {
        e.stopPropagation();
            let num = parseInt(e.target.value)
            if(isNaN(num) === false){
                setAmount(num);
            }
    }

    const choosingSize = (e) => {
        e.stopPropagation();
        const newSize = parseInt(e.target.id);
        let paragraphs = document.getElementsByClassName("size-on-card-container")[0].children;
        let parArr = Array.from(paragraphs);
        parArr.forEach(item => {
        if(item.id === e.target.id){
          item.style.backgroundColor = "white";
          item.style.color = "black";
          item.style.border = "2px solid black"
        }
        else{
          item.style.backgroundColor = "#318023";
          item.style.color = "black";
        }
        })
        setSizes(newSize);
    }

    const handleRating = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        let value = selectRating(e.target.htmlFor)
     
        if(props.user !== "guest" && props.user.hasOwnProperty('_id')){
        updateRating(value, id);
        }
        else{
            props.handleModal(e, id);
        }
    }

    const updateRating = (value,id) => {
        let newRating = {
            name :id,
            rating: value
        };

        const newRatingPromise = newRatingRequest("new rating", '/', newRating);
        newRatingPromise.then(response => {
           props.updateRatings(response.data.userRatings);
           props.updateItemRating({
               id:id,
               rating: response.data.itemRating, 
               numberOfVotes : response.data.numberOfVotes});
           props.needsUpdateFunction(true);
        }).catch(err => {
        })
    }

    const handleFavourite = (e,id) =>{
        e.preventDefault();
        e.stopPropagation();
        if(props.user !== 'Guest' && props.user.hasOwnProperty('_id')){
            let actionType = "";
            let index = props.user.userFavourites.indexOf(id);
           if(index === -1){
               actionType = "add";
           }
           else{
            actionType = "remove";
           }

           const objectToSend = {
            actionType,
            id
           }
          
         const newFavouritePromise = newFavouriteRequest('new favourite', '/', objectToSend);
         newFavouritePromise.then(response => {

            props.updateFavourites(response.data);
            props.needsUpdateFunction(true);
         }).catch(err => {
         })
        }
        else{
        props.handleModal(e);
        }
    }


    let items;
    let slicedItems = [];
    let maxNumber = 24;
    if(window.screen.width > 1149 && window.screen.width < 1700){
        maxNumber = 20;
    }

        let firstValue = (parseInt(props.currentPage) - 1) * maxNumber;
        let secondValue = (parseInt(props.currentPage) * maxNumber);
        slicedItems = props.items.slice(firstValue, secondValue); 


    if(props.currentPage === undefined){
        slicedItems = props.items
    }

    if (pageReady) {
        items = slicedItems.map((item, index) => {
            let newCost = item.cost
            let isFavourite = -1;
            if(props.user.hasOwnProperty('_id')){
                isFavourite = props.user.userFavourites.indexOf(item._id);
            }
            if(item.discount && item.discount !== "no"){
                let discountAmount = handleDiscount(item.discountType, props.discounts);
                newCost = item.cost - (item.cost * discountAmount / 100);
            }
            return (
                <div className={`${props.className} ${isFavourite !== -1 ? "shopping-item-favourite" : ""}`} id={item._id} key={item.fullName + index}>
                    <Card
                        brand={item.brand}
                        cost={newCost}
                        favourite={props.user.hasOwnProperty('_id') ? (isFavourite !== -1 ? true : false) : null}
                        favouriteHandler={(e) => handleFavourite(e, item._id)}
                        fullName={item.fullName}
                        handleRating={e => handleRating(e, item._id)}
                        imgSource={props.location !== "home" ? `../${item.imagePaths[0]}` : item.imagePaths[0]}
                        imgAlt={"alt"}
                        id={item._id}
                        key={item.fullName + index}
                        klasa="fx-basic fx-center-all shopping-item-title"
                        numberOfVotes={item.numberOfVotes}
                        rating={item.rating}
                        user={props.user}
                    />
                    {props.isAddToCartClicked ? (props.itemToCart._id === item._id ?
                        <AddToCartModal
                            addToCart={() => props.addToCart(sizesToBuy, amountToBuy)}
                            choosingAmount={choosingAmount}
                            choosingSize={choosingSize}
                            availability={item.availability}
                            error={props.error}
                            errorMessage={props.errorMessage}
                            /> : null) : null}
                    {item.discount ?
                        <div className="fx-column fx-justify-center shopping-item-discount">
                            <div>{handleDiscount(item.discountType, props.discounts)}% OFF</div>
                        </div> : null}
                   <div className="fx-basic fx-justify-center"><BuyButton click={e =>  props.handleModal(e, item)} text="Add to Cart" klasa="buy_button" /></div>
                </div>
            )
        })
    

    return (
        <Fragment>
            {items}
        </Fragment>
   
    )
} else{
    return <Spinner />
}
}

const mapDispatchToProps = (dispatch) => {
    return {
        needsUpdateFunction(bool){
            dispatch({type:"appStates/needsUpdateFunction", payload:bool})
        },
        updateFavourites(favourites){
            dispatch({type:"user/updateFavourites", payload:favourites})
        },
        updateItemRating(rating){
            dispatch({type: "shop/updateItemRating", payload: rating})
        },
        updateRatings(data){
            dispatch({type:"user/updateRatings", payload: data})
        }
    }
}

export default connect(null, mapDispatchToProps)(ShoppingItem);