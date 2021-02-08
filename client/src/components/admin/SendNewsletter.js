import React, {useState} from 'react';
import { sendNewsletterRequest } from '../axios/AdminRequests';
import {windowWidth} from '../dumbComponents/ReusableFunctions';

const SendNewsletter = (props) => {
    window.scrollTo(0,0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
       const subject = document.getElementById("send-newsletter").elements[0].value;
       const emailBody = document.getElementById("send-newsletter").elements[1].value;
       if(subject !== "" && emailBody !== ""){
        const data = {
            subject, emailBody
        }
        const newsletterPromise = sendNewsletterRequest('send newsletter', data);
        newsletterPromise.then(res => {
            setSuccess(true);
        }).catch(err => {
            let errorMessage = "Could not send email at the moment!"
 
            if(typeof err.response.data === "string"){
                errorMessage = err.response.data;
            }
            setErrorMessage(errorMessage);
            setError(true);
        })
       } else{
           setErrorMessage("Fields cannot be empty!")
           setError(true);
       }

    }

    const handleChange = (e) => {
        if(error){
            setError(false);
        }
    }

    const handleAfterFinish = (e) => {
        if(e.target.innerHTML === "Send another?"){
            setSuccess(false);
        } else if(e.target.innerHTML === "Go to Home"){
            props.history.push('/');
        }
    }

    if(!success){
        return (
            <div className="fx-basic fx-justify-center admin-newsletter-container">
                     <form name="send-newsletter" id="send-newsletter" className="fx-column" onChange={handleChange} onSubmit={handleSubmit}>
                            <label htmlFor="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" placeholder="What is email about?"></input>
                            <textarea rows={window.innerWidth > 1280 ? "25" : window.innerWidth > 1000 ? "20" : window.innerWidth > 768 ? "15" : "10"} cols={window.innerWidth > 1280 ? "100" : window.innerWidth > 1000 ? "85" : window.innerWidth > 768 ? "75" : "30"}></textarea>
                            <div className={`fx-basic fx-justify-center ${error ? "" : "visibility-none"}`}><span className={`auth-message auth-error`}>{error ? errorMessage : "Basic error"}</span></div>
                            <button form="send-newsletter">Submit</button>
                        </form>
            </div>
        )
    } else{
        return (
            <div className="fx-column fx-center-all width-max">
            <div className="item-added-success-holder">
            <div className="fx-basic fx-justify-center fx-align-center auth-message auth-success"><span>Newsletter email sent successfully!</span></div>
            <div className="fx-column fx-align-center" onClick={handleAfterFinish}>
                <div className="item-added-button">Send another?</div>
                </div> 
                </div>
        </div>
        )
    }


};

export default SendNewsletter;