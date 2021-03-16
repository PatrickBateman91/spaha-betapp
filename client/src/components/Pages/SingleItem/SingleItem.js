import React, { Component, Fragment } from 'react';
import { addToCartVANJSKA, checkCorrectMailFormat, passwordCheck, selectRating } from '../../SharedComponents/ReusableFunctions';
import { addToCartRequest, newRatingRequest, signInRequest } from '../../../services/axios/UserRequests';
import { connect } from 'react-redux';
import { currentUrl } from '../../SharedComponents/Mode';
import { Link } from 'react-router-dom';
import BuyButton from '../../SharedComponents/Buttons/BuyButton';
import CardRating from '../../Parts/ShoppingItems/CardRating';
import EditItemButton from '../../SharedComponents/Buttons/EditItemButton';
import LoginModal from '../../Auth/LoginModal';
import Sizes from '../../Parts/ShoppingItems/Sizes';
import ShoppingItem from '../../Parts/ShoppingItems/ShoppingItem';
import './styles.scss';

class SingleItem extends Component {
    state = {
        currentImage: "",
        earlierRating: null,
        error: false,
        errorMessage: '',
        formError: false,
        formErrorMessage: '',
        guestAction: {},
        haveVoted: null,
        item: {},
        itemToCart: [],
        isAddToCartClicked: false,
        modalOpen: false,
        pageReady: false,
        ratings: [],
        selectedSize: null,
        selectedAmount: 1,
        success: false,
        successMessage: "",
        suggestionsError: false,
        suggestionsErrorMessage: "",
        suggestions: []
    }

    addToCart = () => {
        if (this.state.selectedSize !== null && this.state.selectedAmount > 0) {
            if (this.state.selectedAmount <= this.state.item.availability[this.state.selectedSize]) {

                let returnedState = addToCartVANJSKA(this.state.selectedSize, this.state.selectedAmount, this.state.item)
                if (!returnedState.error) {
                    const addToCartPromise = addToCartRequest("/", "add item to cart", returnedState.newItem);
                    addToCartPromise.then(response => {
                        const bodyRect = document.body.getBoundingClientRect();
                        const elemRect = document.getElementById(`image-${this.state.item._id}`).getBoundingClientRect();
                        const top = elemRect.top - bodyRect.top;
                        const left = elemRect.left - bodyRect.left;
                        let cloneItem = document.getElementById(`image-${this.state.item._id}`).cloneNode(true);
                        cloneItem.style.position = "absolute";
                        cloneItem.style.top = top + "px";
                        cloneItem.style.left = left + "px";
                        cloneItem.classList.add('single-item-to-animation');
                        document.querySelector('#root').appendChild(cloneItem);
                        setTimeout(() => {
                            cloneItem.remove();
                            this.props.updateCart(response.data)
                        }, 1000)

                        this.setState({
                            isAddToCartClicked: false,
                            success: true,
                            successMessage: "Item added to the cart!"
                        })
                    }).catch(err => {
                        this.setState({
                            error: true,
                            errorMessage: err.response.data || "Something went wrong!"
                        })
                    })

                } else {
                    this.setState({
                        error: true,
                        errorMessage: returnedState.errorMessage
                    })
                }
            }
            else {
                this.setState({
                    error: true,
                    errorMessage: `We only have ${this.state.item.availability[this.state.selectedSize]} ${this.state.item.availability[this.state.selectedSize] === 1 ? "pair" : "pairs"} of selected sizes available!`
                }
                )
            }
        }
        else if (this.state.selectedSize === null) {
            this.setState({
                error: true,
                errorMessage: `Please select size!`
            })
        }
    }

    addToCartForSuggestions = (size, amount) => {

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
                }, 1000)

                this.setState({
                    isAddToCartClicked: false,
                    success: true,
                    successMessage: "Item added to the cart!"
                })
            }).catch(err => {
                this.setState({
                    suggestionsError: true,
                    suggestionsErrorMessage: err.response.data || "Something went wrong!"
                })
            })

        } else {
            this.setState({
                suggestionsError: true,
                suggestionsErrorMessage: returnedState.errorMessage
            })
        }

    }

    changePicture = (i) => {
        this.setState({
            currentImage: i
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.items.length !== 0) {
            let item = null;
            for (let i = 0; i < this.props.items.length; i++) {
                if (this.props.items[i]._id === this.props.match.params.id) {
                    item = this.props.items[i];
                    break;
                }
            }
            if (item) {
                this.setState({
                    item,
                    currentImage: 0
                }, () => {
                    if (this.state.suggestions.length === 0) {
                        this.getRandomSuggestions();
                    }
                })
            } else {
                this.props.history.push('/404')
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.needsUpdate === false && this.props.needsUpdate) {
            this.props.needsUpdateFunction(false);
            let item = null;
            for (let i = 0; i < this.props.items.length; i++) {
                if (this.props.items[i]._id === this.props.match.params.id) {
                    item = this.props.items[i];
                    break;
                }
            }
            if (item) {
                this.setState({
                    item: item,
                    currentImage: 0
                }, () => {
                    if (this.state.suggestions.length === 0) {
                        this.getRandomSuggestions();
                    } else {
                        const newSuggestions = [];
                        for (let j = 0; j < this.state.suggestions.length; j++) {
                            for (let i = 0; i < this.props.items.length; i++) {
                                if (this.state.suggestions[j]._id === this.props.items[i]._id) {
                                    newSuggestions.push(this.props.items[i]);
                                    break;
                                }
                            }
                        }
                        this.setState({
                            suggestions: newSuggestions
                        })
                    }
                })
            } else {
                this.props.history.push('/404')
            }
        }

        if (prevProps.items !== this.props.items) {

            let item = null;
            for (let i = 0; i < this.props.items.length; i++) {
                if (this.props.items[i]._id === this.props.match.params.id) {
                    item = this.props.items[i];
                    break;
                }
            }
            if (item) {
                this.setState({
                    item: item,
                    currentImage: 0
                }, () => {
                    if (this.state.suggestions.length === 0) {
                        this.getRandomSuggestions();
                    }
                })
            } else {
                this.props.history.push('/404');
            }


        }

        if (prevProps.match.params.id !== this.props.match.params.id) {
            let item = null;
            for (let i = 0; i < this.props.items.length; i++) {
                if (this.props.items[i]._id === this.props.match.params.id) {
                    item = this.props.items[i];
                    break;
                }
            }
            if (item) {
                this.setState({
                    item: item,
                    currentImage: 0
                }, () => {
                    this.getRandomSuggestions();
                    window.scrollTo(0, 0);
                })
            } else {
                this.props.history.push('/404');
            }
        }
    }

    clearError = () => {
        this.setState({ formError: false, formErrorMessage: "" })
    }

    closeModal = (e) => {
        if (this.state.isAddToCartClicked) {
            if (e.target.classList.contains('single-item-holder') || e.target.classList.contains('outer-suggestions-container')) {
                this.setState({
                    isAddToCartClicked: false,
                    itemToCart: []
                })
            };
        }
    }

    getRandomSuggestions = () => {
        let randomArray = [];
        let numberOfSuggestions = 3;
        const windowSize = window.screen.width;

        if (windowSize < 481) {
            numberOfSuggestions = 2;
        } else if (windowSize < 1280) {
            numberOfSuggestions = 3;
        } else if (windowSize < 2299) {
            numberOfSuggestions = 4;
        } else {
            numberOfSuggestions = 5;
        }

        while (randomArray.length < numberOfSuggestions) {
            let r = Math.floor(Math.random() * this.props.items.length);
            if (randomArray.indexOf(r) === -1) {
                randomArray.push(r)
            }
        }
        let randomSuggestions = [];
        for (let i = 0; i < numberOfSuggestions; i++) {
            randomSuggestions.push(this.props.items[randomArray[i]])
        }

        this.setState({
            pageReady: true,
            suggestions: randomSuggestions
        })
    }

    handleAmount = (e) => {
        e.stopPropagation();
        if (e.target.value > this.state.item.availability[this.state.selectedSize]) {
            this.setState({
                selectedAmount: parseInt(e.target.value),
                error: true,
                errorMessage: `We only have ${this.state.item.availability[this.state.selectedSize]} ${this.state.item.availability[this.state.selectedSize] === 1 ? "pair" : "pairs"} of selected sizes available!`,
            })
        }
        else {
            this.setState({ selectedAmount: parseInt(e.target.value), error: false });
        }
    }

    handleCredentials = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const email = document.getElementById('loginForm').elements[0].value;
        const password = document.getElementById('loginForm').elements[1].value;
        if (!checkCorrectMailFormat(email)) {
            return this.setState({
                formError: true,
                formErrorMessage: "Email is not correctly formatted!",
                success: false
            })
        }
        if (!passwordCheck(password)) {
            return this.setState({
                formError: true,
                formErrorMessage: "Password has to be between 6 and 16 characters long and include at least 1 digit!",
                success: false
            })
        }


        const signInPromise = signInRequest(email, password);
        document.getElementById('loginForm').elements[0].disabled = true;
        document.getElementById('loginForm').elements[1].disabled = true;
        signInPromise.then(userResponse => {
            this.props.updateUser(userResponse.data.user);
            this.props.needsUpdateFunction(true);
            this.setState({
                success: true,
                successMessage: "Logged in succesfully!"
            }, () => {

                if (this.state.guestAction.hasOwnProperty('type')) {
                    if (this.state.guestAction.type === "buy suggestion") {
                        const itemToCart = this.state.guestAction.payload;
                        document.querySelector('body').style.overflowY = 'auto';
                        setTimeout(() => {
                            this.setState({
                                guestAction: {},
                                isAddToCartClicked: true,
                                itemToCart,
                                modalOpen: false
                            })
                        }, 800)
                    } else if (this.state.guestAction.type === "buy main") {
                        this.addToCart();
                        document.querySelector('body').style.overflowY = 'auto';
                        this.setState({
                            modalOpen: false
                        })
                    }

                    else if (this.state.guestAction.type === "rating") {
                        let newRating = {
                            name: this.state.guestAction.payload.id,
                            rating: this.state.guestAction.payload.value
                        };

                        const newRatingPromise = newRatingRequest("new rating", '/', newRating);
                        newRatingPromise.then(response => {
                            this.props.updateRatings(response.data.userRatings);
                            this.props.updateItemRating({
                                id: newRating.name,
                                rating: response.data.itemRating,
                                numberOfVotes: response.data.numberOfVotes
                            });
                            this.props.needsUpdateFunction(true);
                            document.querySelector('body').style.overflowY = 'auto';
                            setTimeout(() => {
                                this.setState({
                                    guestAction: {},
                                    modalOpen: false
                                })
                            }, 800)
                        }).catch(err => {
                            this.setState({
                                error: true,
                                errorMessage: err.response.data || "Something went wrong!"
                            })
                        })
                    }
                } else {
                    document.querySelector('body').style.overflowY = 'auto';
                    setTimeout(() => {
                        this.setState({
                            modalOpen: false
                        })
                    }, 800)
                }
            })
        }).catch(err => {
            document.getElementById('loginForm').elements[0].disabled = false;
            document.getElementById('loginForm').elements[1].disabled = false;
            return this.setState({
                formError: true,
                formErrorMessage: err.response.data || "Could not login at the moment!"
            })
        })

    }

    handleDiscount(type) {
        let returnType = 5;
        for (let i = 0; i < this.props.discounts.length; i++) {
            if (type === this.props.discounts[i].name) {
                returnType = this.props.discounts[i].amount;
                break;
            }
        }
        return returnType;
    }

    handleModal = (e, item) => {
        e.stopPropagation();

        if (this.props.user !== "guest" && this.props.user.hasOwnProperty('_id')) {
            if (this.state.isAddToCartClicked && e.target.className === "buy_button") {
                this.setState({
                    itemToCart: item
                });
            } else {
                let isOpen = !this.state.isAddToCartClicked;
                this.setState({
                    isAddToCartClicked: isOpen,
                    itemToCart: item
                });
            }

        }

        else if (e.target.id === "cartModal") {
            this.setState({ modalOpen: false });
            document.querySelector('body').style.overflowY = 'auto';
        }
        else if (e.target.className === 'detailed-buy-button'
            || e.target.className === "buy_button"
            || e.target.parentNode.className === 'rating'
            || e.target.className === 'far fa-heart') {
            let guestAction = {};
            if (e.target.className === 'detailed-buy-button') {
                if (this.state.selectedAmount > 0 && this.state.selectedSize !== null) {
                    guestAction = {
                        type: "buy main",
                        payload: {
                            amount: this.state.selectedAmount,
                            item,
                            size: this.state.selectedSize
                        }
                    }
                }
            } else if (e.target.className === "buy_button") {
                guestAction = {
                    type: "buy suggestion",
                    payload: item
                }
            }

            else if (e.target.parentNode.className === 'rating') {
                let value = selectRating(e.target.htmlFor);
                guestAction = {
                    type: "rating",
                    payload: {
                        value,
                        id: item
                    }
                }
            }
            this.setState({
                guestAction,
                modalOpen: true
            }, () => {
                document.querySelectorAll('.modal-cart')[0].style.top = `${window.pageYOffset}px`;
                document.querySelector('body').style.overflowY = 'hidden';
            })
        }
    }

    handleRating = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.user.hasOwnProperty('_id')) {
            let value;
            switch (e.target.htmlFor) {
                case "star5":
                    value = 5;
                    break;
                case "star4half":
                    value = 4.5;
                    break;
                case "star4":
                    value = 4;
                    break;
                case "star3half":
                    value = 3.5;
                    break;
                case "star3":
                    value = 3;
                    break;
                case "star2half":
                    value = 2.5;
                    break;
                case "star2":
                    value = 2;
                    break;
                case "star1half":
                    value = 1.5;
                    break;
                case "star1":
                    value = 1;
                    break;
                case "starhalf":
                    value = 0.5;
                    break;

                default:
                    value = 3;
                    break;
            }
            this.updateRating(value, id);
        }
        else {
            this.handleModal(e, id)
        }
    }

    handleSize = (newSize) => {
        if (this.state.selectedAmount > this.state.item.availability[newSize]) {
            this.setState({
                error: true,
                errorMessage: `We only have ${this.state.item.availability[newSize]} ${this.state.item.availability[newSize] === 1 ? "pair" : "pairs"} of selected sizes available!`,
                selectedSize: newSize
            })
        }
        else {
            this.setState({
                error: false,
                selectedSize: newSize
            });
        }
    }

    reDirect = () => {
        this.props.history.push('/');
    }

    updateRating(value, id) {

        let newRating = {
            name: id,
            rating: value
        };

        const newRatingPromise = newRatingRequest("new rating", '/', newRating);
        newRatingPromise.then(response => {
            this.props.updateRatings(response.data.userRatings);
            this.props.updateItemRating({
                id: id,
                rating: response.data.itemRating,
                numberOfVotes: response.data.numberOfVotes
            });
            this.props.needsUpdateFunction(true);
        }).catch(err => {
            this.setState({
                error: true,
                errorMessage: err.response.data || "Something went wrong!"
            })
        })
    }

    render() {
        let otherImages = [];
        let newCost;
        if (this.state.pageReady) {
            newCost = this.state.item.cost
            if (this.state.item.discount && this.state.item.discount !== "no") {
                let discountAmount = this.handleDiscount(this.state.item.discountType);
                newCost = this.state.item.cost - (this.state.item.cost * discountAmount / 100);
            }

            for (let i = 0; i < 5; i++) {
                otherImages.push(
                    <img key={i} src={`${currentUrl}/${this.state.item.imagePaths[i]}`} alt={`${this.state.item.fullName} - ${i}`} onMouseOver={e => this.changePicture(i)}></img>
                )
            }
        }
        return (
            <Fragment>
                {this.state.pageReady ?
                    <div className="fx-column single-item-container" onClick={this.closeModal}>
                        <div className="fx-basic fx-justify-around fx-align-center current-directory">
                            <span >{`Amar Shop / Shoes / ${this.state.item.brand} / ${this.state.item.fullName}`}</span>
                            <button onClick={this.reDirect}>Back</button>
                        </div>
                        <div className="single-item-holder">
                            <div className="fx-column single-item-left-container relative">
                                <div>
                                    <img src={`${currentUrl}/${this.state.item.imagePaths[this.state.currentImage]}`} alt={this.state.item.imgAlt} id={`image-${this.state.item._id}`} />
                                </div>
                                <div className="fx-basic fx-justify-center single-item-pictures-container">
                                    {otherImages}
                                </div>
                                {this.props.user && this.props.user.admin ?
                                    <div className="fx-basic edit-button-inner">
                                        <Link to={`/admin/edit-item/${this.props.match.params.id}`}><EditItemButton /></Link>
                                    </div> : null
                                }
                            </div>

                            <div className="fx-column single-item-right-container">
                                <div className="fx-column fx-center-all">
                                    <p className="single-item-name">{this.state.item.fullName}</p>
                                    <p className="single-item-brand">{this.state.item.brand}</p>
                                </div>
                                <p className="single-item-cost">{newCost.toFixed(2)} $</p>
                                <div>
                                    {this.state.pageReady ? <CardRating
                                        handleRating={this.handleRating}
                                        itemId={this.props.match.params.id}
                                        rating={this.state.item.rating}
                                        userRatings={this.props.user.userRatings}
                                        userId={this.props.user._id}
                                    /> : null}
                                    <div className="shopping-people-number center">{this.state.item.numberOfVotes} people rated this item!</div>
                                </div>
                                <Sizes
                                    item={this.state.item}
                                    handleSize={this.handleSize}
                                />
                                <div className="fx-basic fx-justify-center">
                                    <div className="fx-basic fx-justify-around fx-align-center single-item-amount">
                                        <p>Select amount:</p>
                                        <input type="number" min={1} defaultValue={1} onChange={this.handleAmount} />

                                    </div>
                                </div>

                                <div className="fx-basic fx-justify-center"><span className={`auth-message ${!this.state.error ? "visibility-none" : "auth-error"}`}>{this.state.error ? this.state.errorMessage : "Basic error"}</span></div>
                                <Link to={`/admin/edit_item/${this.props.match.params.id}`}>
                                </Link>

                                <div className="detailed_buy_button fx-basic fx-justify-center">

                                    <BuyButton click={this.props.user._id ? this.addToCart : e => this.handleModal(e, this.state.item)} text="Add to Cart" klasa="detailed-buy-button" />
                                </div>

                            </div>
                        </div>
                        {this.state.pageReady ? <div className="fx-column fx-align-center outer-suggestions-container">
                            <span className="outer-suggestions-title">You might like:</span>
                            <div className="fx-basic fx-justify-around outer-suggestions-holder">
                                <ShoppingItem
                                    addToCart={this.addToCartForSuggestions}
                                    error={this.state.suggestionsError}
                                    errorMessage={this.state.suggestionsErrorMessage}
                                    className="shopping-item sh-item-half"
                                    currentPage={1}
                                    discounts={this.props.discounts}
                                    handleModal={this.handleModal}
                                    itemToCart={this.state.itemToCart}
                                    isAddToCartClicked={this.state.isAddToCartClicked}
                                    location="single page"
                                    items={this.state.suggestions}
                                    user={this.props.user ? this.props.user : "Guest"}
                                />
                            </div>
                        </div> : null}
                        {this.state.modalOpen ? <LoginModal
                            auth={false}
                            buttonText="Log in"
                            clearError={this.clearError}
                            error={this.state.formError}
                            errorMessage={this.state.formErrorMessage}
                            handleCredentials={this.handleCredentials}
                            handleModal={this.handleModal}
                            klasa="account_modal"
                            success={this.state.success}
                            successMessage={this.state.successMessage}
                            text="Please login first"
                            type="both"
                            user="guest"
                        /> : null}
                    </div>
                    : null}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        discounts: state.admin.discounts,
        needsUpdate: state.appStates.needsUpdate,
        items: state.shop.items,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        needsUpdateFunction(bool) {
            dispatch({ type: "appStates/needsUpdate", payload: bool })
        },
        updateCart(cart) {
            dispatch({ type: "user/updateCart", payload: cart })
        },
        updateItemRating(rating) {
            dispatch({ type: "shop/updateItemRating", payload: rating })
        },
        updateRatings(ratings) {
            dispatch({ type: "user/updateRatings", payload: ratings })
        },
        updateUser(user) {
            dispatch({ type: 'user/updateUser', payload: user })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleItem)