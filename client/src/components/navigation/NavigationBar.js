import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import LinksSignedIn from './LinksSignedIn';
import LinksSignedOut from './LinksSignedOut';
import Logo from '../dumbComponents/Logo';
import ProfileCart from '../Cart/ProfileCart';
import { getUserRequest } from '../axios/UserRequests';

const NavigationBar = (props) => {

    const [loaded, setLoaded] = useState(false);
    const [modalOpen, setModal] = useState(false);
    const [notifications, setNotifications] = useState(0);
    const [detailedCart, setDetailedCart] = useState([]);
    const {needsUpdate} = props;

    const gettingCartData = useCallback((openModal) => {
        const detailedCart = [];
        if (props.user.hasOwnProperty('_id')) {
            for (let i = 0; i < props.user.userCart.length; i++) {
                for (let j = 0; j < props.items.length; j++) {
                    if (props.user.userCart[i].name === props.items[j]._id) {
                        const newCartItem = { ...props.items[j] };
                        newCartItem.amount = props.user.userCart[i].amount;
                        newCartItem.size = props.user.userCart[i].size;
                        newCartItem.cartId = props.user.userCart[i]._id;
                        detailedCart.push(newCartItem);
                        break;
                    }
                }
            }
        }
        setDetailedCart(detailedCart);
        setModal(openModal);

            if (props.user.hasOwnProperty('_id') && props.user.userCart.length > 7) {
                document.querySelector('body').style.overflowY = 'scroll';
            } else if (modalOpen) {
                document.querySelector('body').style.overflowY = 'hidden';
            }
    }, [modalOpen, props.items, props.user])

    const handleModal = (e, force) => {
        e.stopPropagation();
        if (e.target.id === "cartModal"
            || e.target.parentNode.id === "redirect-to-sign-up"
            || e.target.className === "left_cart"
            || e.target.className === "right_cart"
            || e.target.id === "modal-cartId"
            || e.target.innerHTML === "CONTINUE SHOPPING"
            || e.target.innerHTML === "Back to store"
            || force === "force") {
            setModal(false);
            document.querySelector('body').style.overflowY = 'auto';
        } else if (e.target.id === "cartSignedIn") {

            gettingCartData(true);
            document.querySelector('body').style.overflowY = 'hidden';
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (document.getElementById('searchForm').elements[0].value !== "") {
            let searchField = document.getElementById('searchForm').elements[0].value;
            props.history.push(`/search/${searchField}`)
            document.getElementById('searchForm').elements[0].value = "";
        }
    }

    const reDirect = (path) => {
        props.history.push(path)
    }

    if (!loaded) {
        setLoaded(true);
        const getUserPromise = getUserRequest();
        getUserPromise.then(userResponse => {
            if (userResponse.data.user.hasOwnProperty('_id')) {
                const notifications = userResponse.data.user.contactForms.reduce((acc, curr) => {
                    if (!curr.answerRead) {
                        return acc += 1;
                    } else {
                        return acc;
                    }
                }, 0)
                setNotifications(notifications);
            }

            let user = userResponse.data.user || "guest";
            props.updateUser(user);
            props.changeDiscounts(userResponse.data.discounts);
            props.setBrands(userResponse.data.brands);
            props.updateShop(userResponse.data.items);
            props.pageReady(true);
         
        }).catch(err => {
            console.log(err);
            props.pageReady(true);
        })
    }

    useEffect(() => {
     
        if (needsUpdate && props.user.hasOwnProperty('_id')) {
            const newNotifications = props.user.contactForms.reduce((acc, curr) => {
                if (!curr.answerRead) {
                    return acc += 1;
                } else {
                    return acc;
                }
            }, 0)

            if (notifications !== newNotifications) {
                setNotifications(newNotifications);
            }
            if (modalOpen) {
                gettingCartData(true);
                props.needsUpdateFunction(false);
            } else {
                gettingCartData(false);
                props.needsUpdateFunction(false);
            }
        }
    },  [needsUpdate, loaded, notifications, modalOpen, gettingCartData, props])

    return (
        
        <Fragment>
            <div className="fx-basic fx-justify-between fx-align-center navigation-bar">
                <div className=" fx-basic fx-align-center navigation-bar-left">
                    <NavLink to="/"><Logo onClick={reDirect.bind(this, "/")} /></NavLink>

                </div>
                <div className=" fx-basic navigation-bar-right">
                    {props.appLoaded ? props.user !== "guest" && props.user.hasOwnProperty("_id") && props.appLoaded ?
                        <LinksSignedIn
                            cartLength={props.user.userCart.length}
                            handleSearch={handleSearch}
                            modal={handleModal}
                            notifications={notifications}
                            userAdmin={props.user.admin}
                            uid={props.user._id}
                        /> :
                        <LinksSignedOut handleSearch={handleSearch} /> : null}
                </div>
            </div>
            {modalOpen ?
                <div className="fx-basic fx-justify-center fx-align-center modal-cart" onClick={handleModal} id="modal-cartId">
                    <div className="modal-cart-holder">
                        <ProfileCart
                            appLocation="Navbar"
                            continueShopping={handleModal}
                            detailedCart={detailedCart}
                            favourites={props.user.userFavourites}
                            userCart={props.user.userCart}
                            userId={props.user._id}
                            userPurchases={props.user.userPreviousPurchases}
                        />
                    </div>
                </div>
              : null}
        </Fragment>
    )

}

const mapStateToProps = (state) => {
    return {
        appLoaded: state.appStates.appLoaded,
        items: state.shop.items,
        needsUpdate: state.appStates.needsUpdate,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeDiscounts: (discounts) => {
            dispatch({ type: "admin/changeDiscounts", payload: discounts })
        },
        needsUpdateFunction: (bool) => {
            dispatch({ type: "appStates/needsUpdateFunction", payload: bool })
        },
        pageReady: (bool) => {
            dispatch({ type: "appStates/pageReady", payload: bool })
        },

        updateShop: (items) => {
            dispatch({ type: "shop/updateShop", payload: items });
        },

        updateUser: (userData) => {
            dispatch({ type: "user/updateUser", payload: userData })
        },
        setBrands: (brands) => {
            dispatch({ type: "admin/setBrands", payload: brands })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));