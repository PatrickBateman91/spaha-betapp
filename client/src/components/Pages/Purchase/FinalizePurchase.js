import React, { Component, Fragment } from 'react';
import { creditCardRequest, payPalRequest } from '../../../services/axios/ItemRequests';
import { connect } from 'react-redux';
import { currentUrl } from '../../SharedComponents/Mode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faInfo } from '@fortawesome/free-solid-svg-icons'
import { shortenWord } from '../../SharedComponents/ReusableFunctions';
import CreditCartPayment from './CreditCardPayment';
import PaypalPayment from './PayPalPayment';
import SuccessfulPurchase from './SuccessfulPurchase';
import './styles.scss';

class FinalizePurchase extends Component {

    state = {
        creditCardFields: {
            billingAddress: "",
            cardCity: "",
            cardCountry: "",
            cardName: "",
            cardNumber: "",
            cardPostalCode: "",
            cvcCvv: "",
            expiryMonth: "",
            expiryYear: "",
        },
        creditCardDisclaimer: "Credit card payment is not connected to any account, however it is connected to the database so any purchases will be affected in the item's availability and included in the admin stats, as well as in user previous purchases!",
        detailedCart: [],
        error: false,
        errorMessage: "",
        payPalDisclaimer: "PayPal payment is connected to sandbox PayPal API!",
        pageLoaded: false,
        selectedPaymentMethod: "credit-card",
        success: false
    }

    componentDidMount() {
        if (this.props.items.length > 0) {
            this.gettingCartData();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.items.length > 0 && !this.state.pageLoaded) {
            if (this.props.user === "guest" || !this.props.user.hasOwnProperty('_id')) {
                this.props.history.push('/sign-in');
            } else {
                this.gettingCartData();
            }
        }
        if (this.props.needsUpdate) {
            if (this.props.user === "guest" || !this.props.user.hasOwnProperty('_id')) {
                this.props.history.push('/sign-in');
            } else {
                this.gettingCartData();
                this.props.needsUpdateFunction(false);
            }

        }
    }

    changePaymentMethod = (e) => {
        e.stopPropagation();
        if (this.state.selectedPaymentMethod === e.target.value) {
            document.getElementById(e.target.id).checked = false;
            if (e.target.value === "paypal") {
                document.getElementById('paypal-container').classList.remove("visibility-none");
                document.getElementById('paypal-container').classList.remove("payment-visible");
                document.getElementById('paypal-container').classList.add("payment-not-visible");
            } else if (e.target.value === "credit-card") {
                document.getElementById('credit-card-container').classList.remove("payment-visible");
                document.getElementById('credit-card-container').classList.add('payment-not-visible');
            }

            this.setState({
                error: false,
                selectedPaymentMethod: ""
            })
        } else {
            if (e.target.value === "paypal") {
                document.getElementById('credit-card-container').classList.remove("payment-visible");
                document.getElementById('credit-card-container').classList.add('payment-not-visible');
                setTimeout(() => {
                    document.getElementById('paypal-container').classList.remove("visibility-none");
                    document.getElementById('paypal-container').classList.remove("payment-not-visible");
                    document.getElementById('paypal-container').classList.add('payment-visible');
                }, 500)



            } else if (e.target.value === "credit-card") {
                ;

                document.getElementById('paypal-container').classList.remove("visibility-none");
                document.getElementById('paypal-container').classList.remove("payment-visible");
                document.getElementById('paypal-container').classList.add("payment-not-visible");
                setTimeout(() => {
                    document.getElementById('credit-card-container').classList.remove("payment-not-visible");
                    document.getElementById('credit-card-container').classList.add('payment-visible');
                }, 500)
            }
            this.setState({
                error: false,
                selectedPaymentMethod: e.target.value
            })
        }
    }

    continueShopping = (e) => {
        this.props.history.push('/');
    }

    formCardsChange = (e) => {
        if (e.target.id !== "cardName" && e.target.id !== "cardCity" && e.target.id !== "cardCountry" && e.target.id !== "billingAddress") {
            let trigger = false;
            let trimmedNumber = e.target.value.replace(/\s/g, '');
            if (!isNaN(trimmedNumber)) {
                trigger = true;
                let copyFields = { ...this.state.creditCardFields }
                copyFields[e.target.id] = e.target.value;

                if (e.target.id === "cardNumber") {
                    if (trigger) {
                        const cardNumber = [];
                        let slicedSentence = trimmedNumber.split("");
                        slicedSentence.forEach((letter, index) => {
                            if (index % 4 === 0) {
                                cardNumber.push(" ");
                                cardNumber.push(letter);
                            } else {
                                cardNumber.push(letter)
                            }
                        })

                        let newCardNumber = cardNumber.join("");
                        copyFields.cardNumber = newCardNumber;
                    }
                }

                this.setState({
                    creditCardFields: copyFields,
                    error: false,
                    errorMessage: ""
                })
            }

        } else {
            let copyFields = { ...this.state.creditCardFields }
            copyFields[e.target.id] = e.target.value;
            this.setState({
                creditCardFields: copyFields,
                error: false,
                errorMessage: ""
            })
        }
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

        let total = detailedCart.reduce((acc, curr) => {
            return (curr.cost * curr.amount) + acc;
        }, 0);
        if (total === 0 && !this.state.success) {
            this.props.history.push('/');
        }
        this.setState({
            detailedCart,
            pageLoaded: true,
            total
        })

    }

    handleCreditCard = (e) => {
        e.preventDefault();
        const copyFields = { ...this.state.creditCardFields };
        let trimmedCardNumber = copyFields.cardNumber.replace(/\s/g, '');
        if (trimmedCardNumber.length !== 16) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid card number"
            })
        }
        if (copyFields.cardName.length < 2) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid card name"
            })
        }
        if (copyFields.expiryMonth.length !== 2 || parseInt(copyFields.expiryMonth) > 12) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid expiry month!"
            })
        }
        if (copyFields.expiryYear.length !== 2 || parseInt(copyFields.expiryYear) < 20) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid expiry year!"
            })
        }
        if (copyFields.cvcCvv.length !== 3) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid CVC/CVV!"
            })
        }
        if (copyFields.billingAddress.length < 2) {
            return this.setState({
                error: true,
                errorMessage: "Please enter a valid address!"
            })
        }

        if (copyFields.cardCity.length < 2) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid city!"
            })
        }
        if (copyFields.cardCountry.length < 2) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid county!"
            })
        }
        if (copyFields.cardPostalCode.length < 2) {
            return this.setState({
                error: true,
                errorMessage: "Please enter valid postal code!"
            })
        }

        let newFormData = new FormData();
        newFormData.cardName = copyFields.cardName;
        newFormData.cardNumber = trimmedCardNumber;
        newFormData.expiryMonth = parseInt(copyFields.expiryMonth);
        newFormData.expiryYear = parseInt(copyFields.expiryYear);
        newFormData.cvcCvv = parseInt(copyFields.cvcCvv);
        newFormData.billingAddress = copyFields.billingAddress;
        newFormData.cardCity = copyFields.cardCity;
        newFormData.cardCountry = copyFields.cardCountry;
        newFormData.cardPostalCode = copyFields.cardPostalCode;

        document.body.style.pointerEvents = "none";
        document.body.style.cursor = "wait";

        const creditCardPromise = creditCardRequest('credit card', newFormData);
        creditCardPromise.then(res => {
            this.setState({
                success: true
            }, () => {
                document.body.style.pointerEvents = "auto";
                document.body.style.cursor = "auto";
                this.props.updatePurchases(res.data);
                this.props.updateCart([]);
                this.props.needsUpdateFunction(true);
            })
        }).catch(err => {
            let errorMessage = ""
            err.response.data.forEach(sentence => {
                errorMessage += sentence.errorMessage;
            })
            this.setState({
                error: true,
                errorMessage
            })
        })

    }

    handlePayPal = (order) => {
        document.body.style.pointerEvents = "none";
        document.body.style.cursor = "wait";
        const payPalPromise = payPalRequest("paypal");
        payPalPromise.then(res => {
            this.setState({
                success: true
            }, () => {
                document.body.style.pointerEvents = "auto";
                document.body.style.cursor = "auto";
                this.props.updatePurchases(res.data);
                this.props.updateCart([]);
                this.props.needsUpdateFunction(true);
            })
        }).catch(err => {
            let errorMessage = ""
            err.response.data.forEach(sentence => {
                errorMessage += sentence.errorMessage;
            })

            this.setState({
                error: true,
                errorMessage
            })
        })
    }

    render() {
        let cartItems = [];
        if (this.state.pageLoaded) {
            cartItems = this.state.detailedCart.map((cart, index) => {
                return (
                    <div className="payment-cart-item fx-basic fx-justify-between" key={cart.fullName + index}>
                        <div>
                            {shortenWord(cart.fullName, 7)}
                            {cart.amount > 1 ? <span>{`  x${cart.amount}`}</span> : null}
                        </div>
                        <div>
                            {(cart.cost * cart.amount).toFixed(2)}$
                        </div>
                    </div>
                )
            })
        }
        return (
            <Fragment>
                {this.state.pageLoaded ? <div className="fx-basic fx-justify-around payment-container">
                    {this.state.success ?
                        <SuccessfulPurchase continueShopping={this.continueShopping} />
                        : <Fragment>
                            <div className="fx-column payment-left">

                                <div id="payment-secure-title" className="fx-basic fx-justify-between fx-align-center">
                                    <FontAwesomeIcon icon={faLock} />
                                    <span>Secure payment</span>
                                </div>


                                <div className="payment-disclaimer">Please recheck everything before submitting order</div>

                                <div className="payments-holder fx-column fx-justify-center">


                                    <div className="fx-basic fx-justify-between fx-align-center payment-line">
                                        <div>
                                            <input onClick={this.changePaymentMethod} defaultChecked={true} type="radio" value="credit-card" name="select-payment" id="select-credit-card" />
                                            <label htmlFor="select-credit-card"  >Card Payment</label>
                                        </div>
                                        <img id="credit-card-image" src={`${currentUrl}/public/images/general/credit-cards.png`} alt="credit-cards" />
                                    </div>

                                    <CreditCartPayment
                                        creditCardFields={this.state.creditCardFields}
                                        error={this.state.error}
                                        errorMessage={this.state.errorMessage}
                                        formCardsChange={this.formCardsChange}
                                        handleCreditCard={this.handleCreditCard}
                                        total={this.state.total} />
                                    <div className="fx-basic fx-justify-between fx-align-center payment-line">
                                        <div>
                                            <input onClick={this.changePaymentMethod} type="radio" value="paypal" name="select-payment" id="select-paypal" />
                                            <label htmlFor="select-paypal">PayPal</label>
                                        </div>
                                        <img id="paypal-image" src={`${currentUrl}/public/images/general/paypal.png`} alt="paypal" />
                                    </div>

                                    <PaypalPayment
                                        handlePayPal={this.handlePayPal}
                                        detailedCart={this.state.detailedCart}
                                        total={this.state.total}
                                    />

                                </div>

                            </div>
                            <div className="payment-right fx-column">
                                <div className="payment-order-holder">
                                    <div id="payment-order-title">Order Summary:</div>
                                    {cartItems}
                                    <div className="cart_total fx-basic fx-justify-between">
                                        <p>Total:</p>
                                        <p className="payment-total">{this.state.total.toFixed(2)}$</p>
                                    </div>
                                </div>

                                {this.state.selectedPaymentMethod !== "" ? <div className="credit-card-dummy fx-basic fx-justify-center">
                                    <FontAwesomeIcon icon={faInfo} />
                                    <span>{this.state.selectedPaymentMethod === "credit-card" ? this.state.creditCardDisclaimer : this.state.payPalDisclaimer}</span>
                                </div> : null}
                            </div>
                        </Fragment>}
                </div> : null}
            </Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        needsUpdate: state.appStates.needsUpdate,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalizePurchase);