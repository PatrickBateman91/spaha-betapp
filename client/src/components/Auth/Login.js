import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import Spinner from '../dumbComponents/Spinner';
import {checkCorrectMailFormat, passwordCheck} from '../dumbComponents/ReusableFunctions';
import {signInRequest} from '../axios/UserRequests';
import {connect} from 'react-redux';

const Login = (props) =>  {

const [error, setError] = useState(false);
const [errorMessage, setErrorMessage] = useState("")
const [loading, setLoading] = useState(true);
const [success, setSuccess] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

const handleChange = (e) => {
    setError(false);
    setSuccess(false);
}

const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('loginForm').elements[0].value;
    const password = document.getElementById('loginForm').elements[1].value;
    let errorTrigger = false;
    if(!passwordCheck(password)){
        errorTrigger = true;
        setError(true);
        setSuccess(false);
        setErrorMessage("Password has to be between 6 and 16 characters long and include at least 1 digit!");
    }
    
    if(!checkCorrectMailFormat(email)){
        errorTrigger = true;
        setError(true);
        setSuccess(false);
        setErrorMessage("Email is not correctly formatted!");
    }

    if(!errorTrigger){
        const signInPromise = signInRequest(email, password);
        document.getElementById('loginForm').elements[0].disabled = true;
        document.getElementById('loginForm').elements[1].disabled = true;
        signInPromise.then(userResponse => {
            setError(false);
            setSuccessMessage("Logged in succesfully!");
            setSuccess(true);
            props.updateUser(userResponse.data.user);
            props.pageReady(true);
            setTimeout(() => {
                props.history.push('/');
                window.scrollTo(0,0)
            }, 700)
    
        }).catch(err => {
            let errorMessage = "Could not login at the moment!";
            if(typeof err.response.data === "string"){
                errorMessage = err.response.data;
            }
            
            document.getElementById('loginForm').elements[0].disabled = false;
            document.getElementById('loginForm').elements[1].disabled = false;
            setErrorMessage(errorMessage)
            setError(true);
        })
    }
}

useEffect(() => {
    if(props.user.hasOwnProperty('_id') && !success){
        props.history.push('/');
    } else if(props.user === "guest"){
        setLoading(false);
    }
}, [props.user, props.history, success])

        return (
            <div className="fx-basic fx-justify-center fx-align-center auth-form-container">
                {!loading ?  <div className="fx-column fx-align-center auth-form-holder relative">
                <p className="general-form-title">Login</p>
                    <form id="loginForm" onChange={handleChange} onSubmit={e => handleSubmit(e)}>
                        
                        <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label className="left-input" htmlFor="login-email">Email</label>
                                <input className="right-input" type="email" id="login-email" placeholder="Enter your email" autoComplete={"email"}></input>
                            </div>

                            <div className="auth-form-line fx-basic fx-justify-between fx-align-center">
                                <label className="left-input" htmlFor="login-password">Password</label>
                                <input className="right-input" type="password" id="login-password" placeholder="Enter your password" autoComplete={"password"}></input>
                            </div>
                            <div className={`${!error && !success ? "visibility-none auth-message" : error ? "auth-message auth-error" : "auth-message auth-success"}`}>{error ? errorMessage : success ? successMessage :"Filler text"}</div>
                            <div className="formButton fx-basic fx-justify-center">
                                <button type="submit" className="general-form-button" form="loginForm">Login</button>
                            </div>
                    </form>
     
                </div> : <Spinner />}
            </div>
        )
  
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        pageReady: (bool) =>{
            dispatch({type:"appStates/pageReady", payload: bool})
        },
        updateUser: (userData) => {
            dispatch({type: "user/updateUser", payload: userData})
          }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));