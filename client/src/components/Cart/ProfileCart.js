import React, { Component, Fragment } from 'react';
import {withRouter} from 'react-router-dom';
import OrderSummary from './OrderSummary';
import CartSeperate from './CartSeperate';
import { profileCartRequest } from '../axios/UserRequests';
import { connect } from 'react-redux';

class ProfileCart extends Component {

 state = {
            cartEmpty: false,
            clickedCartId:false,
            clickedItemId: false,
            editOn: false,
            editFieldsSupply: true,
            isLoaded: false,
            pictureHover:false,
            pictureHoverId:"",
            transactionSuccess: null,
            transactionError: null,

        }
    

    componentDidMount() {
        if (this.props.detailedCart.length !== 0) {
            this.setState({
                isLoaded: true,
                cartEmpty: false
            })
        } else {
            this.setState({
                isLoaded: true,
                cartEmpty: true
            })
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.detailedCart.length === 0 && !this.state.cartEmpty){
            this.setState({
                cartEmpty: true
            })
        }
    }

    goToCheckOut = (e) => {
        if(this.props.appLocation === "Navbar"){
            this.props.continueShopping(e, "force");
        }
        this.props.history.push('/checkout/finalize-purchase')
    }

    handleEditModal = (cartId, itemId) => {
        this.setState({
            editOn: true,
            clickedCartId: cartId,
            clickedItemId: itemId
        }, () => {
            this.handleEditChange(cartId, itemId, "amount")
        })
    }

    handleEditChange = (cartId, itemId, type) => {
        
        let size = document.getElementById("edit-size");
        let amount = document.getElementById("edit-amount");

        const addSizesClass = () => {
            amount.classList.remove('sizes-not-available');
            amount.classList.add('sizes-available');
            this.setState({ editFieldsSupply: true })
        }

        const removeSizesClass = () => {
            amount.classList.remove('sizes-available');
            amount.classList.add('sizes-not-available');
            this.setState({ editFieldsSupply: false })
        }

        this.props.detailedCart.forEach(item => {
            if (item.cartId === cartId) {
                if (type === "size") {
                    if (item.availability[size.value] >= amount.value) {
                        addSizesClass();
                    }
                    else {
                        removeSizesClass();
                    }
                }
                else if (type === "amount") {
                    if (item.availability[size.value] >= amount.value) {
                        addSizesClass();
                    }
                    else {
                        removeSizesClass();
                    }
                }
            }
        })

    }

    handleMoveToFavourites = (cartId, itemId) => {
        const idObject = {
            cartId,
            itemId
        }
        const moveToFavouritesPromise = profileCartRequest('move to favourites', idObject);
        moveToFavouritesPromise.then(response => {
            this.props.updateFavourites(response.data.newFavourites);
            this.props.updateCart(response.data.newCart);
            this.props.needsUpdateFunction(true);
        }).catch(err => {
            this.setState({
                error: true,
                errorMessage: "Something went wrong"
            })
        })
    }

    handleDeleteItem = (id) => {
        const deleteItemPromise = profileCartRequest('delete item from cart', id)
        deleteItemPromise.then(res => {
            this.props.updateCart(res.data);
            this.props.needsUpdateFunction(true);
        }).catch(err => {
            this.setState({
                error: true,
                errorMessage: err.response.data || "Something went wrong"
            })
        })

    }

    handlePictureHover = (e, type, id) => {
        if(type === "in"){
            this.setState({
                pictureHover:true,
                pictureHoverId:id
            })
        } else if(type === "out"){
            this.setState({
                pictureHover:false,
                pictureHoverId:""
            })
        }
   
    }

    submitChangesToServer = (cartId, itemId) => {
        let size = parseInt(document.getElementById("edit-size").value);
        let amount = parseInt(document.getElementById("edit-amount").value);

        if (this.state.editFieldsSupply) {
            const editedCartItem = {
                size,
                amount,
                name: itemId,
                cartId
            }
            const editCartPromise = profileCartRequest("edit cart", editedCartItem);
            editCartPromise.then(response => {
                this.props.updateCart(response.data);
                this.props.needsUpdateFunction(true);
                this.setState({
                    editOn: false,
                    clickedItemId: ""
                })
            }).catch(err => {
                this.setState({
                    error: true,
                    errorMessage: err.response.data || "Something went wrong"
                })
            })
        }
    }

    render() {
        return (
            <div className={`fx-basic fx-wrap fx-align-center cart-container`}>
                {this.state.isLoaded ? 
                <Fragment>
                    {this.state.cartEmpty ? 
                <div className="fx-column fx-justify-center fx-align-center cart-empty-container">
                   <div className="cart-empty-inner">Your cart is empty!</div>
                   <div className="cart-empty-button-container">
                   <button onClick={this.props.continueShopping} className="continue-shopping-button">CONTINUE SHOPPING</button>
                   </div>
                    </div> 
                :
                <div className="left-cart"> <CartSeperate
                        clickedCartId={this.state.clickedCartId}
                        clickedItemId={this.state.clickedItemId}
                        editOn={this.state.editOn}
                        handleDeleteItem={this.handleDeleteItem}
                        handleMoveToFavourites={this.handleMoveToFavourites}
                        handleEditModal={this.handleEditModal}
                        handleEditChange={this.handleEditChange}
                        handlePictureHover={this.handlePictureHover}
                        items={this.props.detailedCart}
                        pictureHover={this.state.pictureHover}
                        pictureHoverId={this.state.pictureHoverId}
                        submitChangesToServer={this.submitChangesToServer}
                    /></div>}
                    <div className="right-cart">
                        <OrderSummary backToStore={this.props.continueShopping} goToCheckOut={this.goToCheckOut} cartItems={this.props.detailedCart} />
                        </div></Fragment> : <div className="spinner_container"><i className="fas fa-spinner"></i></div>}
                {this.state.transactionSuccess ? <div>Transaction was successfull!</div> : null}
                {this.state.transactionError ? <div>There was an error!</div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        needsUpdateFunction(bool) {
            dispatch({ type: "appStates/needsUpdateFunction", payload: bool })
        },
        updateCart(cart) {
            dispatch({ type: "user/updateCart", payload: cart })
        },
        updateFavourites(favourites) {
            dispatch({ type: "user/updateFavourites", payload: favourites })
        },
        updatePurchases(purchases){
            dispatch({type:"user/updatePurchases", payload: purchases})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileCart));