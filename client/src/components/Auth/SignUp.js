import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import '../../App.css' ;
import {checkCorrectMailFormat, passwordCheck} from '../dumbComponents/ReusableFunctions';
import {signUpRequest} from '../axios/UserRequests';
import {connect} from 'react-redux';
import Spinner from '../dumbComponents/Spinner';

const SignUp = (props) =>  {

const [error, setError] = useState(false);
const [errorMessage, setErrorMessage] = useState("")
const [loading, setLoading] = useState(true);
const [success, setSuccess] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

useEffect(() => {
    if(props.user.hasOwnProperty('_id') && !success){
        props.history.push('/');
    } else if(props.user === "guest"){
       setLoading(false);
     }
}, [props.user, props.history, success])

const handleChange = (e) => {
setError(false);
setSuccess(false);
}

const handleSubmit = (e) => {
e.preventDefault();
const firstName = document.getElementById('firstName').value;
const lastName = document.getElementById('lastName').value;
const email = document.getElementById('email').value;
const userAddress = document.getElementById('userAddress').value;
const password = document.getElementById('password').value;
const newsletter = document.getElementById('newsletter').checked;
let errorTrigger = false;

if(!passwordCheck(password)){
    errorTrigger = true;
    setErrorMessage('Password has to be between 6 and 16 characters long and contain at least 1 number!');
    setError(true);
}
if(!checkCorrectMailFormat(email)){
    errorTrigger = true;
    setErrorMessage('Email is not correctly formatted!');
    setError(true);
}

if(userAddress.length < 3){
    errorTrigger = true;
    setErrorMessage('Please enter correct address!');
    setError(true);
}

if(lastName.length < 1){
    errorTrigger = true;
    setErrorMessage('Lastname cannot be empty!');
    setError(true);
}

if(firstName.length < 1){
    errorTrigger = true;
    setErrorMessage('Firstname cannot be empty!');
    setError(true);
} 

if(firstName === "" 
|| lastName === ""
|| email === ""
|| userAddress === ""
|| password === ""){
    errorTrigger = true;
    setErrorMessage('Please fill all fields!');
    setError(true);
}

if(!errorTrigger){
    const signUpPromise = signUpRequest(firstName, lastName, userAddress, email, password, newsletter)
    document.getElementById('submitForm').children[0].disabled = "disabled";
    signUpPromise.then(userResponse => {
        localStorage.setItem('shop-app-token', userResponse.data.token)
        setError(false);
        setSuccessMessage('Account created successfully!')
        setSuccess(true);
        props.updateUser(userResponse.data.user);
        setTimeout(() => props.history.push('/'), 700);
    }).catch(err => {
        document.getElementById('submitForm').children[0].disabled = false;
        let errorMessage;
        if(err.response.data.keyPattern.hasOwnProperty('email')){
            errorMessage = "Email is already registered";
        } else if(err.response.data.keyPattern.hasOwnProperty('password')){
            errorMessage = "Password has to be between 6 and 16 characters long and contain at least 1 number!"
        } else {
            errorMessage = "Could not sign up at the moment!"
        }
        setErrorMessage(errorMessage);
        setError(true);
    })
}
}
   
        return (
            <div className="fx-basic fx-justify-center fx-align-center auth-form-container">
                {!loading ?  <div className="fx-column fx-align-center auth-form-holder">
                    <p className="general-form-title">Enter your details here</p>
                    
                        <form id="submitForm"
                            onChange={e => handleChange(e)}
                            onSubmit={e => handleSubmit(e)}
                        >
                            <fieldset className="fieldset">
                        <div className="signUpFields">
                            <div className="auth-form-line  fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" placeholder="First name"></input>
                            </div>

                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" placeholder="Last name"></input>
                            </div>

                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="userAddress">Address</label>
                                <input type="text" id="userAddress" placeholder="Address"></input>
                            </div>

                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Email"></input>
                            </div>

                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="Password" autoComplete="password"></input>
                            </div>
                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label htmlFor="newsletter" id="newsletter-label">Sign up for newsletter</label>
                                <input defaultChecked={true} type="checkbox" id="newsletter"></input>
                            </div>

                            </div>
                            <div className={`${!error && !success ? "visibility-none auth-message" : error ? "auth-message auth-error" : "auth-message auth-success"}`}>{error ? errorMessage : success ? successMessage :"Filler text"}</div>
                            <div className="formButton fomButton fx-basic fx-justify-center">
                                <button className="general-form-button" form="submitForm">Sign Up</button>
                            </div>
                            </fieldset>
                        </form >
                    </div>  : <Spinner />}
                </div>
    
        )
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (userData) => {
            dispatch({type: "user/updateUser", payload: userData})
          }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));