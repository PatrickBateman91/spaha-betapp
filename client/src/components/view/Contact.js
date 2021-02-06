import React, {useState, useEffect} from 'react';
import { checkCorrectMailFormat } from '../dumbComponents/ReusableFunctions';
import { connect } from 'react-redux';
import { contactFormRequest } from '../axios/OtherRequests';
import Spinner from '../dumbComponents/Spinner';

const Contact = (props) => {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    if(loading){
        window.scrollTo(0,0);
    }

    useEffect(() => {
        if(props.user === "guest"){
            setLoading(false);
        }
        if(props.user.hasOwnProperty('_id')){
        
            if(document.getElementById("contact-form") !== null){
                document.getElementById("contact-form").elements[1].value = props.user.email;
                document.getElementById("contact-form").elements[1].disabled = true;
            }
            setLoading(false);
        }
    }, [props.user, loading])

   const handleContactSubmit = (e) => {
        e.preventDefault();
        let subject = document.getElementById("contact-form").elements[0].value;
        let email = document.getElementById("contact-form").elements[1].value;
        let text = document.getElementById("contact-form").elements[2].value;

        if (subject === "") {
            setErrorMessage("Subject can't be empty");
            setError(true);
        }
        else if (email === "") {
            setErrorMessage("Please enter contact email address");
            setError(true);
        }
        else if (!checkCorrectMailFormat(email)) {
            setErrorMessage("Please format your email address correctly");
            setError(true);
        }
        else if (text === "" || text.split(" ").length < 5) {
            setErrorMessage("Contact form must include at least 5 words");
            setError(true);
        }

        else {
            const auth = props.user.hasOwnProperty("_id");
            let objToSend = { subject, email, text, auth }
            const contactFormPromise = contactFormRequest(objToSend);
            document.getElementById("contact-form").elements[0].disabled = true;
            document.getElementById("contact-form").elements[1].disabled = true;
            document.getElementById("contact-form").elements[2].disabled = true;
            document.querySelector('#contact-form > button').disabled = true;
            contactFormPromise.then(response => {
                if (props.user.hasOwnProperty('_id')) {
                    props.newContactForm(response.data);
                }
                setSuccess(true);
                setTimeout(() => props.history.push('/'), 1500);
              
            }).catch(err => {
                document.getElementById("contact-form").elements[0].disabled = false;
                document.getElementById("contact-form").elements[2].disabled = false;
                document.querySelector('#contact-form > button').disabled = false;
                let errorMessage = "Could not send contact form!";
                if(typeof err.response.data === "string"){
                    errorMessage = err.response.data;
                }
                setErrorMessage(errorMessage);
                setError(true);
            })
        }
    }

        return (
            !loading ? 
            <div className="fx-basic fx-justify-center" id="contact-container">
                     
             {   success ? <div className="newsletter-success" id="contact-success">Thank you for your comment. We will respond as soon as possible!</div> :
                    <form name="contact-form" id="contact-form" className="fx-column" onSubmit={e => handleContactSubmit(e)} onChange={e => setError(false)}>
                        <label htmlFor="contact-subject">Subject</label>
                        <input type="text" id="contact-subject" placeholder="What is this about?"></input>
                        <div id="contact-response-email" className="fx-basic fx-align-center">
                            <label htmlFor="contact-email">Response email</label>
                            <input type="text" id="contact-email" placeholder="Where we do reply?"></input>
                        </div>
                        <textarea rows="25" cols="100"></textarea>
                        <div className={`fx-basic fx-justify-center ${error ? "" : "visibility-none"}`}><span className={`auth-message auth-error`}>{error ? errorMessage : "Basic error"}</span></div>
                        <button form="contact-form">Submit</button>
                    </form>}
            </div>
            :
            <Spinner loading={loading}/>
        )
    
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        newContactForm(contactForm) {
            dispatch({ type: "user/newContactForm", payload: contactForm })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact)