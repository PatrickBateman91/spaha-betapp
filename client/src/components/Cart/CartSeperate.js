import React,{Fragment} from 'react';
import {shortenWord }from '../dumbComponents/ReusableFunctions';
import {currentUrl} from '../dumbComponents/Mode';

const CartSeperate = (props) => {
    const itemsToRender = props.items.map((item, index) => {
        return (
            <div className="fx-basic fx-wrap fx-justify-between cart-item" key={item.fullName + index}>
            <div className="fx-basic fx-align-center">
                <div className="cart-picture relative" onMouseEnter={e => props.handlePictureHover(e, "in", item.cartId)} onMouseLeave={e => props.handlePictureHover(e, "out", item._id) }>
                    <img src={`${currentUrl}/${item.imagePaths[0]}`} alt={item.fullName} />
                    {props.pictureHover && props.pictureHoverId === item.cartId ? <div id="cart-hidden-images" className="fx-basic fx-wrap">
            <img src={`${currentUrl}/${item.imagePaths[0]}`} alt="cart 1" />
            <img src={`${currentUrl}/${item.imagePaths[1]}`} alt="cart 2" />
            <img src={`${currentUrl}/${item.imagePaths[2]}`} alt="cart 3" />
            <img src={`${currentUrl}/${item.imagePaths[3]}`} alt="cart 4" />
            <img src={`${currentUrl}/${item.imagePaths[4]}`} alt="cart 5" />
            </div>: null}
                    </div>
           
                <div className="fx-column fx-justify-around">
                <div className="cart-title">{shortenWord(item.fullName,2)}</div>

                <div id="edit-cost-item" className="cart-item-details">
                   {<span>Cost: {item.cost}$</span>}
                    </div>
                    
                {props.editOn ?
                (props.clickedItemId === item._id && props.clickedCartId === item.cartId ? 
                    <Fragment>
                    <div className="cart-item-details">
                        <span>Size:
                        <input min="37" max="46"
                                type="number"
                                id="edit-size"
                                onChange={() => props.handleEditChange(item.cartId, item._id, "size")}
                                defaultValue={item.size} />
                        </span>
                    </div>
        
                    <div className="cart-item-details">
                        <span>Amount:
                        <input min="1"
                                type="number"
                                id="edit-amount"
                                onChange={() => props.handleEditChange(item.cartId,item._id, "amount")}
                                defaultValue={item.amount} />
                        </span>
                    </div>
                </Fragment>
                    
                    : <Fragment>
                    <div className="cart-item-details">
                        <span>Size: {item.size}</span>
                    </div>

                    <div className="cart-item-details">
                        <span>Amount: {item.amount}</span>
                    </div>
                    </Fragment>)
                    :
                    <Fragment>
                            <div className="cart-item-details">
                                <span>Size: {item.size}</span>
                            </div>

                            <div className="cart-item-details">
                                <span>Amount: {item.amount}</span>
                            </div>
                            </Fragment>}

                </div>  
                </div>
              {props.editOn ?
              (props.clickedItemId === item._id && props.clickedCartId === item.cartId ? 
              <div id="confirm-edit-button"><button onClick={() => props.submitChangesToServer(item.cartId, item._id)}>Confirm edit</button></div> :    
              
              <div className="cart-buttons fx-column fx-justify-around">
              <button onClick={() => props.handleEditModal(item.cartId,item._id)}>Edit</button>
              <button onClick={() => props.handleDeleteItem(item.cartId)}>Delete</button>
              <button onClick={() => props.handleMoveToFavourites(item.cartId,item._id)}>Move to Favourites</button>
          </div>) :
              <div className="cart-buttons fx-column fx-justify-around">
              <button onClick={() => props.handleEditModal(item.cartId,item._id)}>Edit</button>
              <button onClick={() => props.handleDeleteItem(item.cartId)}>Delete</button>
              <button onClick={() => props.handleMoveToFavourites(item.cartId,item._id)}>Move to Favourites</button>
          </div>
            }

                </div>
          
        )
    })
        return (
            <Fragment>
                {itemsToRender}
            </Fragment>
    );
};

export default CartSeperate;