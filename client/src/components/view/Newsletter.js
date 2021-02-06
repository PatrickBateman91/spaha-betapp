import React, {useState} from 'react';
import {checkCorrectMailFormat} from '../dumbComponents/ReusableFunctions';
import {newsLetterRequest} from '../axios/OtherRequests';

const Newsletter = (props) => {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [emailValidation, setEmailValidation] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const checkEmail = (e) => {
        if(checkCorrectMailFormat(e.target.value.toLowerCase())){
            setEmailValidation(true);
            setError(false);
            document.querySelector('#newsletter-holder form input').classList.remove('newsletter-red-border');
            document.querySelector('#newsletter-holder form input').classList.add('newsletter-green-border');
        }
        else{
            setError(false);
            setEmailValidation(false);
              document.querySelector('#newsletter-holder form input').classList.remove('newsletter-green-border');
              document.querySelector('#newsletter-holder form input').classList.add('newsletter-red-border');
        }
    }

    const resetState = () => {
        setError(false);
        setEmailValidation(false)
        setSuccess(false);
    }

    const submitEmail = (e) => {
        e.preventDefault();
        let email = document.getElementById('newsletter-email').value;
         if(emailValidation){
            const newsLetterPromise = newsLetterRequest('add email to newsletter', email);
            newsLetterPromise.then(response => {
                setSuccessMessage("Thank you for subscribing to our newsletter!");
                setSuccess(true);
            }).catch(err => {
                let errorMessage = typeof err.response.data === "string" ? err.response.data : "Could not add email to newsletter!";
                setErrorMessage(errorMessage);
                setError(true);
            })
         }
         else{
            setErrorMessage('Email is not correctly formatted');
            setError(true);
         }
    }
     
        return (
            <div className="fx-basic fx-justify-center fx-align-center newsletter-container">
            <div id="newsletter-holder" className="fx-column fx-justify-around fx-align-center">
            <div className="fx-column fx-align-center">
            <span className="newsletter-title">SIGN UP</span>
           <span className="newsletter-title">for our newsletter! </span>
            </div>
        {!success ? 
        <form id="newsletter-form" className={"fx-column fx-align-center"} onChange={e => checkEmail(e)} onSubmit={e => submitEmail(e)}>

<div className={`newsletter-failure ${error ? "" : "visibility-none"}`}>{error ? errorMessage : "Basic error"}</div> 
   
        <div className="fx-basic"><input type="text" placeholder="Type your email here" id="newsletter-email" />
        <button type="submit" form="newsletter-form" >Subscribe</button></div>
        </form> 
        : 
        <div className="fx-column fx-align-center">
        {success ?   <div className="newsletter-success">{successMessage}</div>  : null}
           <button id="newsletter-add-another" onClick={resetState}>Add another one?</button>
            </div>}
            </div>
        
        </div>
        )
    
}

export default Newsletter;