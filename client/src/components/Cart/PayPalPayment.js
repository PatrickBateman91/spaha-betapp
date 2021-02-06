import React, {useState, useEffect} from 'react';

const PayPalPayment = (props) => {
    const {total, handlePayPal} = props;
    const [error, setError] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,      
        maximumFractionDigits: 2,
     });
//Da budu max dvije decimale da paypal ne izbacuje error
     const totalNumber = parseFloat(formatter.format(total));

     console.log("Ja?")
     console.log(document.getElementById('paypal-button-container'))
     
    useEffect(() => {
        window.paypal.getFundingSources().forEach(function(fundingSource) {
            if(fundingSource === "paypal"){
               window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description:"Shoe store checkout",
                            amount: {
                                currency_code: "USD",
                                value : totalNumber
                            }
                        }]
                    })
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    handlePayPal(order);
                },
                onError: err => {
                    setError(true);
                },
                    fundingSource: fundingSource
                }).render("#paypal-button-container")
            }
        }, [totalNumber, handlePayPal]);
    
    }, [totalNumber, handlePayPal])



    
  

    return (
        <div id="paypal-container" className={"visibility-none"}>
        <div className="fx-column fx-align-center">
            <span className="paypal-disclaimer">Once you have clicked <span className="paypal-bold">Paypal</span> you will be redirected to PayPal to complete your purchase securely. </span>
            <div className={`fx-basic fx-justify center ${error ? "" : "visibility-none"}`}><span className={`${error ? "auth-message auth-error" : ""}`}>Could not process the order at the moment!</span></div>
            <div id="paypal-button-container" className="fx-basic fx-justify-center paypal-container-class"></div>
        </div>  
    </div>
    );
};

export default PayPalPayment;