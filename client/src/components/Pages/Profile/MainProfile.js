import React, { Component, Fragment } from 'react';
import { accountDetailsRequest, addToCartRequest, deleteUserPurchaseRequest } from '../../../services/axios/UserRequests';
import { addToCartVANJSKA, checkCorrectMailFormat, filterArray, passwordCheck, removeDuplicates } from '../../SharedComponents/ReusableFunctions';
import { connect } from 'react-redux';
import AccountDetails from './AccountDetails';
import ManageFeedback from '../../Admin/Feedback/ManageFeedback';
import PreviousPurchases from './PreviousPurchases';
import ProfileCart from '../../Parts/Cart/ProfileCart';
import Suggestions from './Suggestions';
import YourFavourites from './YourFavourites';
import './styles.scss';

class MainProfile extends Component {
    state = {
        accountDetailsformActive: true,
        detailedCart: [],
        favourites: [],
        error: false,
        errorMessage: "",
        itemToCart: null,
        isAddToCartClicked: false,
        newUserData: {},
        listItems: [
            { name: "accountdetails", shown: true, label: "Account settings" },
            { name: "previouspurchases", shown: false, label: "Previous purchases" },
            { name: "profilecart", shown: false, label: "Cart" },
            { name: "suggestions", shown: false, label: "Recommended for you" },
            { name: "yourfavourites", shown: false, label: "Your favourites" },
            { name: "contactfeedback", shown: false, label: "Contact feedback" }],
        modalOpen: false,
        pageLoaded: false,
        success: false,
        successMessage: "",
        suggestions: []
    }


    addToCart = (size, amount) => {
        let returnedState = addToCartVANJSKA(size, amount, this.state.itemToCart)
        if (!returnedState.error) {
            const addToCartPromise = addToCartRequest("/", "add item to cart", returnedState.newItem);
            addToCartPromise.then(response => {
                const bodyRect = document.body.getBoundingClientRect();
                const elemRect = document.getElementById(this.state.itemToCart._id).getBoundingClientRect();
                const top = elemRect.top - bodyRect.top;
                const left = elemRect.left - bodyRect.left;
                let cloneItem = document.getElementById(this.state.itemToCart._id).cloneNode(true);
                cloneItem.style.position = "absolute";
                cloneItem.style.top = top + "px";
                cloneItem.style.left = left + "px";
                cloneItem.classList.add('item-to-card-animation');
                document.querySelector('#root').appendChild(cloneItem);
                setTimeout(() => {
                    cloneItem.remove();
                    this.props.updateCart(response.data)
                    this.props.needsUpdateFunction(true);
                }, 1000)

                this.setState({
                    isAddToCartClicked: false,
                    success: true,
                    successMessage: "Item added to the cart!"
                })
            }).catch(err => {
                this.setState({

                    error: true,
                    errorMessage: "Something went wrong!"
                })
            })

        } else {
            this.setState({
                error: true,
                errorMessage: returnedState.errorMessage
            })
        }

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.items.length !== 0) {
            const notifications = this.props.user.contactForms.reduce((acc, curr) => {
                if (!curr.answerRead) {
                    return acc += 1;
                } else {
                    return acc;
                }
            }, 0)
            this.setState({
                notifications,
                pageLoaded: true
            })
            this.gettingCartData();
            this.getPurchasedItems();
            this.getFavourites();
            this.getSuggestionsPartOne();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.items.length !== this.props.items.length) {
            if (this.props.user === "guest" || !this.props.user.hasOwnProperty('_id') || this.props.user._id !== this.props.match.params.id) {
                this.props.history.push('/sign-in')
            } else {
                const notifications = this.props.user.contactForms.reduce((acc, curr) => {
                    if (!curr.answerRead) {
                        return acc += 1;
                    } else {
                        return acc;
                    }
                }, 0)
                if (this.state.notifications !== notifications) {
                    this.setState({ notifications })
                }
                this.gettingCartData();
                this.getFavourites();
                this.getPurchasedItems();
                this.getSuggestionsPartOne();
            }
        }
        if (prevProps.appStates.needsUpdate === false && this.props.appStates.needsUpdate) {
            const notifications = this.props.user.contactForms.reduce((acc, curr) => {
                if (!curr.answerRead) {
                    return acc += 1;
                } else {
                    return acc;
                }
            }, 0)
            if (this.state.notifications !== notifications) {
                this.setState({ notifications })
            }
            this.props.needsUpdateFunction(false);
            this.gettingCartData();
            this.getFavourites();
            this.getPurchasedItems();
            this.getSuggestionsPartOne();
        }
    }

    deletePurchase = (id) => {
        const deleteUserPurchasePromise = deleteUserPurchaseRequest("delete purchase", id);
        deleteUserPurchasePromise.then(res => {
            this.props.updatePurchases(res.data);
            this.props.needsUpdateFunction(true);
        }).catch(err => {
            this.setState({
                error: true,
                errorMessage: err.response.data || "Could not delete purchase item!"
            })
        })
    }

    gettingCartData = () => {
        const detailedCart = [];
        for (let i = 0; i < this.props.user.userCart.length; i++) {
            for (let j = 0; j < this.props.items.length; j++) {
                if (this.props.user.userCart[i].name === this.props.items[j]._id) {
                    const newCartItem = { ...this.props.items[j] };
                    newCartItem.amount = this.props.user.userCart[i].amount;
                    newCartItem.size = this.props.user.userCart[i].size;
                    newCartItem.cartId = this.props.user.userCart[i]._id;
                    detailedCart.push(newCartItem);
                    break;
                }
            }
        }
        const newUserData = {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            userAddress: this.props.user.userAddress,
            email: this.props.user.email,
            password: ""
        }
        this.setState({
            detailedCart,
            newUserData,
            pageLoaded: true
        })

    }

    getFavourites = () => {
        const filteredItems = [];
        for (let i = 0; i < this.props.user.userFavourites.length; i++) {
            for (let j = 0; j < this.props.items.length; j++) {
                if (this.props.user.userFavourites[i] === this.props.items[j]._id) {
                    filteredItems.push(this.props.items[j]);
                    break;
                }
            }
        }
        this.setState({
            favourites: filteredItems
        })

    }

    getPurchasedItems = () => {
        let filteredItems = [];
        for (let i = 0; i < this.props.user.userPreviousPurchases.length; i++) {
            for (let j = 0; j < this.props.items.length; j++) {
                if (this.props.user.userPreviousPurchases[i].name === this.props.items[j]._id) {
                    let purchaseObject = {
                        amount: this.props.user.userPreviousPurchases[i].amount,
                        discount: this.props.user.userPreviousPurchases[i].discount,
                        discountAmount: this.props.user.userPreviousPurchases[i].discountAmount,
                        name: this.props.user.userPreviousPurchases[i].name,
                        size: this.props.user.userPreviousPurchases[i].size,
                        purchaseId: this.props.user.userPreviousPurchases[i]._id
                    }
                    filteredItems.push({
                        itemDetails: this.props.items[j],
                        purchaseObject
                    });
                    break;
                }
            }
        }
        this.setState({
            userPreviousPurchases: filteredItems
        })
    }

    getRandomSuggestions = () => {
        let randomArray = [];
        while (randomArray.length < 3) {
            var r = Math.floor(Math.random() * this.props.items.length);
            if (randomArray.indexOf(r) === -1) {
                randomArray.push(r)
            }
        }
        let randomSuggestions = [this.props.items[randomArray[0]], this.props.items[randomArray[1]], this.props.items[randomArray[2]]]
        this.setState({
            suggestions: randomSuggestions
        })
    }

    getSuggestionsPartOne = () => {
        let suggestions = [];
        suggestions.push(...this.props.user.userFavourites);

        this.props.user.userCart.forEach(cartItem => {
            suggestions.push(cartItem.name)
        })

        this.props.user.userPreviousPurchases.forEach(purchase => {
            suggestions.push(purchase.name)
        })
        let filteredSuggestions = filterArray(suggestions);
        const detailedSuggestions = [];

        for (let i = 0; i < filteredSuggestions.length; i++) {
            for (let j = 0; j < this.props.items.length; j++) {
                if (filteredSuggestions[i] === this.props.items[j]._id) {
                    detailedSuggestions.push(this.props.items[j]);
                    break;
                }
            }
        }

        let randomNumber = 3 - detailedSuggestions.length;
        if (randomNumber < 1) {
            randomNumber = 0;
        }


        let priceAverage = detailedSuggestions.reduce((acc, curr) => {
            return acc + curr.cost;
        }, 0)


        priceAverage = Math.round(priceAverage / detailedSuggestions.length);

        let brandObject = {
            Adidas: 0,
            Nike: 0,
            Puma: 0,
            Reebok: 0,
            Umbro: 0,
            Lacoste: 0
        }

        detailedSuggestions.forEach(item => {
            brandObject[item.brand]++;
        })

        this.getSuggestionsPartTwo([], 0, priceAverage, priceAverage - 10, priceAverage + 10, brandObject)
    }

    getSuggestionsPartTwo = (finalArray = [], iteration = 0, priceAverage, low, high, brandObject) => {
        let iterationCount = iteration;
        let filteredSuggestions = finalArray;
        filteredSuggestions = this.props.items.filter(item => {
            if (item.cost > low && item.cost < high && brandObject[item.brand] > 0 && filteredSuggestions.length < 4) {
                return item;
            } else {
                return false;
            }
        })
        filteredSuggestions = removeDuplicates(filteredSuggestions);

        if (filteredSuggestions.length === 3) {
            this.setState({
                suggestions: filteredSuggestions
            })
        } else if (filteredSuggestions.length > 3) {
            const reducedSuggestions = [filteredSuggestions[0], filteredSuggestions[1], filteredSuggestions[2]];
            this.setState({
                suggestions: reducedSuggestions
            })
        }

        else {
            if (iterationCount < 5) {
                iterationCount++;
                let newLow = low - 10;
                let newHigh = high + 10;
                this.getSuggestionsPartTwo(filteredSuggestions, iterationCount, priceAverage, newLow, newHigh, brandObject);
            } else {
                this.getRandomSuggestions();
            }
        }
    }

    handleAccountFormChange = (e) => {
        const field = e.target.id.replace('account-', "");
        const copynewUserData = { ...this.state.newUserData };
        copynewUserData[field] = e.target.value;
        this.setState({
            error: false,
            newUserData: copynewUserData
        })
    }

    handleCredentials = (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById('password').value;
        if (!passwordCheck(oldPassword)) {
            return this.setState({
                error: true,
                errorMessage: "Password is not correct!"
            })
        }
        const newUserData = { ...this.state.newUserData };
        newUserData.newPassword = this.state.newUserData.password;
        newUserData.oldPassword = oldPassword;
        const accountDetailsPromise = accountDetailsRequest('change account details', newUserData);
        accountDetailsPromise.then(response => {


            this.setState({
                error: false,
                errorMessage: "",
                accountDetailsformActive: true,
                success: true,
                successMessage: "Account data changed successfully!"
            }, () => {
                this.props.updateUser(response.data);
                this.props.needsUpdateFunction(true);
                document.querySelector('body').style.overflowY = 'auto';
                setTimeout(() => {
                    this.setState({
                        modalOpen: false,
                        success: false,
                        successMessage: ""
                    })
                }, 1000)
            });
        }).catch(err => {
            this.setState({
                error: true,
                errorMessage: err.response.data
            })
        })
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.setState({
            accountDetailsformActive: false,
            error: false
        })
    }

    handleListChange(arg) {
        let copyState = [...this.state.listItems];
        copyState.forEach(item => {
            if (item.name === arg) {
                item.shown = true
            }
            else {
                item.shown = false;
            }
        })
        this.setState({
            listItems: copyState,
            error: false,
            itemToCart: null,
            isAddToCartClicked: false,
            success: false
        });
    }

    handleModal = (e, item) => {
        e.preventDefault();
        if (e.target.innerHTML === "Submit details") {
            if (!this.state.formActive) {

                if (this.state.newUserData.firstName.length < 2) {
                    return this.setState({
                        error: true,
                        errorMessage: "First name has to have at least one letter"
                    })
                }
                if (this.state.newUserData.lastName.length < 2) {
                    return this.setState({
                        error: true,
                        errorMessage: "Last name has to have at least one letter"
                    })
                }

                if (this.state.newUserData.userAddress.length < 2) {
                    return this.setState({
                        error: true,
                        errorMessage: "Address has to have at least one letter"
                    })
                }

                if (!checkCorrectMailFormat(this.state.newUserData.email)) {
                    return this.setState({
                        error: true,
                        errorMessage: "Email is not correctly formatted!"
                    })
                }

                if (this.state.newUserData.password !== "" && !passwordCheck(this.state.newUserData.password)) {
                    return this.setState({
                        error: true,
                        errorMessage: "Password has to be between 6 and 16 characters long and contain at least 1 number!"
                    })
                }

                if (this.state.newUserData.firstName === this.props.user.firstName &&
                    this.state.newUserData.lastName === this.props.user.lastName &&
                    this.state.newUserData.email === this.props.user.email &&
                    this.state.newUserData.userAddress === this.props.user.userAddress &&
                    this.state.newUserData.password === ""
                ) {
                    return this.setState({
                        error: true,
                        errorMessage: "No changes were made!"
                    })
                }

                this.setState({
                    modalOpen: true,
                }, () => {
                    document.querySelectorAll('.modal-cart')[0].style.top = `${window.pageYOffset}px`;
                    document.querySelector('body').style.overflowY = 'hidden';
                })
            }
        }
        else if (e.target.id === "cartModal") {
            this.setState({
                modalOpen: false
            }, () => {
                document.querySelector('body').style.overflowY = 'auto';
            })
        } else if (e.target.innerHTML === "Add to Cart") {
            let isOpen = !this.state.isAddToCartClicked;
            this.setState({
                isAddToCartClicked: isOpen,
                itemToCart: item
            });
        }
    }

    render() {
        const listToRender = this.state.listItems.map(item => {

            if (item.name === "contactfeedback") {
                return (
                    <li key={item.name} onClick={() => this.handleListChange(item.name)}>
                        <span>{item.label}</span>
                        {this.state.pageLoaded ? <span className={`${this.state.notifications === 0 ? "" : "auth-error"}`}>
                            {this.state.notifications === 0 ? "" : `(${this.state.notifications})`}
                        </span> : null}
                    </li>
                )
            } else if (item.name === "profilecart") {
                return (
                    <li key={item.name} onClick={() => this.handleListChange(item.name)}>
                        <span>{item.label}</span>
                        {this.state.pageLoaded ? <span>
                            {this.props.user.userCart.length === 0 ? "" : `(${this.props.user.userCart.length})`}
                        </span> : null}
                    </li>
                )
            } else {
                return (
                    <li key={item.name} onClick={() => this.handleListChange(item.name)}>{item.label}</li>
                )
            }
        })
        return (

            <div className="fx-basic fx-wrap fx-justify-around fx-align-start profile-container">
                <div className="fx-basic profile-left">
                    <ul>
                        {listToRender}
                    </ul>
                </div>
                <div className={`fx-basic fx-justify-center ${this.state.listItems[0].shown ? "fx-align-center" : ""} profile-right`}>
                    {this.state.pageLoaded ?
                        <Fragment>
                            {this.state.listItems[0].shown ?
                                <AccountDetails
                                    error={this.state.error}
                                    errorMessage={this.state.errorMessage}
                                    formActive={this.state.accountDetailsformActive}
                                    handleAccountFormChange={this.handleAccountFormChange}
                                    handleEdit={this.handleEdit}
                                    handleCredentials={this.handleCredentials}
                                    handleModal={this.handleModal}
                                    items={this.props.items}
                                    modalOpen={this.state.modalOpen}
                                    newUserData={this.state.newUserData}
                                    success={this.state.success}
                                    successMessage={this.state.successMessage}
                                    user={this.props.user} /> : null}
                            {this.state.listItems[1].shown ?
                                <PreviousPurchases
                                    deletePurchase={this.deletePurchase}
                                    discounts={this.props.discounts}
                                    userPreviousPurchases={this.state.userPreviousPurchases}
                                    userId={this.props.user._id} /> : null}
                            {this.state.listItems[2].shown ?
                                <ProfileCart
                                    appLocation="Profile"
                                    continueShopping={() => this.props.history.push('/')}
                                    detailedCart={this.state.detailedCart}
                                    favourites={this.props.user.userFavourites}
                                    userId={this.props.user._id}
                                    userCart={this.props.user.userCart}
                                    userPurchases={this.props.user.userPreviousPurchases} /> : null}
                            {this.state.listItems[4].shown ?
                                <YourFavourites
                                    addToCart={this.addToCart}
                                    discounts={this.props.discounts}
                                    error={this.state.error}
                                    errorMessage={this.state.errorMessage}
                                    favourites={this.state.favourites}
                                    handleModal={this.handleModal}
                                    modalOpen={this.state.modalOpen}
                                    itemToCart={this.state.itemToCart}
                                    isAddToCartClicked={this.state.isAddToCartClicked}
                                    user={this.props.user} /> : null}
                            {this.state.listItems[3].shown ?
                                <Suggestions
                                    addToCart={this.addToCart}
                                    error={this.state.error}
                                    errorMessage={this.state.errorMessage}
                                    discounts={this.props.discounts}
                                    handleModal={this.handleModal}
                                    modalOpen={this.state.modalOpen}
                                    itemToCart={this.state.itemToCart}
                                    isAddToCartClicked={this.state.isAddToCartClicked}
                                    suggestions={this.state.suggestions}
                                    user={this.props.user}
                                /> : null}
                            {this.state.listItems[5].shown ?
                                <ManageFeedback
                                    type="user" /> : null}
                        </Fragment>
                        : null}

                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        appStates: {
            needsUpdate: state.appStates.needsUpdate
        },
        discounts: state.admin.discounts,
        items: state.shop.items,
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
        updatePurchases(purchases) {
            dispatch({ type: "user/updatePurchases", payload: purchases })
        },
        updateUser(user) {
            dispatch({ type: "users/updateUser", payload: user })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainProfile);