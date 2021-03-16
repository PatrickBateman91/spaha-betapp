import React, { useState } from 'react';
import { checkCorrectMailFormat } from '../../../SharedComponents/ReusableFunctions';
import { currentUrl } from '../../../SharedComponents/Mode';
import { newsLetterRequest } from '../../../../services/axios/OtherRequests';
import './styles.scss';

const Newsletter = (props) => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const resetState = () => {
        setError(false);
        setSuccess(false);
    }

    const submitEmail = (e) => {
        e.preventDefault();
        let email = document.getElementById('newsletter-email').value;
        if (checkCorrectMailFormat(email)) {
            const newsLetterPromise = newsLetterRequest('add email to newsletter', email);
            newsLetterPromise.then(response => {
                setSuccessMessage("Thank you for subscribing to our newsletter!");
                setSuccess(true);
                setError(false);
            }).catch(err => {
                let errorMessage = typeof err.response.data === "string" ? err.response.data : "Could not add email to newsletter!";
                setErrorMessage(errorMessage);
                setError(true);
                setSuccess(false);
            })
        }
        else {
            setErrorMessage('Email is not correctly formatted');
            setError(true);
            setSuccess(false);
        }
    }

    return (
        <div className="fx-basic fx-justify-center fx-align-center newsletter-container">
            <div className="fx-column fx-justify-around fx-align-center newsletter-left-container">
                <div className="newsletter-text-container fx-column fx-align-center">
                    <span className="newsletter-title">Earn a 5% discount</span>
                    <span className="newsletter-info">Subscribe for our newsletter and get a 5% discount on your next purchase</span>
                </div>
                <div className={`newsletter-failure ${error ? "" : "visibility-none"}`}>{error ? errorMessage : "Basic error"}</div>
                <div className={`newsletter-success ${success ? "" : "visibility-none"}`}>{success ? successMessage : "Basic success"}</div> 
                <form id="newsletter-form" className="fx-basic fx-justify-between" onChange={resetState} onSubmit={e => submitEmail(e)}>
                        <input type="text" placeholder="Type your email here" id="newsletter-email" />
                        <button type="submit" form="newsletter-form" >Subscribe</button>
                </form>
            </div>
            <div className="newsletter-middle-container fx-basic fx-center-all">
                <img id="discount-card-1" src={`${currentUrl}/public/images/general/discount-card-2.png`} alt="discount card 1" />
                <img id="discount-card-2" src={`${currentUrl}/public/images/general/discount-card-1.png`} alt="discount card 2" />
            </div>
            <div className="newsletter-right-container">
                <img src={`${currentUrl}/public/images/general/discount-season.png`} alt="newsletter" />
            </div>
        </div>
    )

}

export default Newsletter;