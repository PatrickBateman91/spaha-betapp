import React from 'react';

const CreditCardPayment = (props) => {
    return (
        <div id="credit-card-container" className="fx-column payment-visible">
<form name="credit-card-data">
         <div className="credit-card-line fx-column fx-justify-between">
             <label htmlFor="cardNumber">Card Number</label>
             <input onChange={props.formCardsChange} type="text" placeholder="1234 5678 9012 3456" id="cardNumber"  maxLength="20"  name="cardNumber" value={props.creditCardFields.cardNumber} />
         </div>

         <div className="credit-card-line fx-column fx-justify-between">
             <label htmlFor="cardName">Card Name</label>
             <input onChange={props.formCardsChange} type="text" placeholder="Amar Spahić" id="cardName" name="cardName" value={props.creditCardFields.cardName} />
         </div>

         <div className="fx-basic payment-expiry-line">

<div className="fx-column fx-justify-between">
    <label htmlFor="expiryMonth">Expiry Month</label>
    <input onChange={props.formCardsChange} type="text" value={props.creditCardFields.expiryMonth} placeholder="MM" name="expiryMonth" id="expiryMonth" maxLength="2" />
</div>

<div className="fx-column fx-justify-between">
   <label htmlFor="expiryYear">Expiry Year</label>
    <input onChange={props.formCardsChange} type="text" placeholder="YY" id="expiryYear" name="expiryYear" maxLength="2" value={props.creditCardFields.expiryYear} />
</div>

<div className="fx-column fx-justify-between">
<label htmlFor="cvcCvv">CVC/CVV/Security number</label>
    <input onChange={props.formCardsChange} type="text" placeholder="123" id="cvcCvv" name="cvcCvv" maxLength="3" value={props.creditCardFields.cvcCvv} />
</div>

</div>

         <div className="credit-card-line fx-column fx-justify-between">
             <label htmlFor="billingAddress">Billing address</label>
             <input onChange={props.formCardsChange} type="text" placeholder="Kralja Tomislava 5" id="billingAddress" name="billingAddress" value={props.creditCardFields.billingAddress} />
         </div>
         
         <div className="fx-basic payment-address-line">

             <div className="fx-column fx-justify-between">
                 <label htmlFor="cardCity">City</label>
                 <input onChange={props.formCardsChange} type="text" value={props.creditCardFields.cardCity} placeholder="Sarajevo" name="cardCity" id="cardCity" />
             </div>

             <div className="fx-column fx-justify-between">
                <label htmlFor="cardCountry">Country</label>
                 <input onChange={props.formCardsChange} type="text" placeholder="Bosnia and Herzegovina" id="cardCountry" name="cardCountry" value={props.creditCardFields.cardCountry} />
             </div>
             
             <div className="fx-column fx-justify-between">
             <label htmlFor="cardPostalCode">Postal code</label>
                 <input onChange={props.formCardsChange} type="text" placeholder="71000" id="cardPostalCode" name="cardPostalCode" value={props.creditCardFields.cardPostalCode} />
             </div>
             
         </div>

  <div className={`fx-basic fx-justify-center payment-error ${!props.error ? "visibility-none" : ""}`}><span>{!props.error ? "Basic error" : props.errorMessage}</span></div>
             <div className="fx-basic fx-justify-center payment-checkout-button"><button onClick={props.handleCreditCard}>PAY {props.total.toFixed(2)}$</button></div>
             </form>
         </div>
    );
};

export default CreditCardPayment;