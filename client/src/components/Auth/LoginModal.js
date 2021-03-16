import React from 'react';
import {NavLink} from 'react-router-dom';
import './styles.scss';

const LoginModal = (props) => {

    const cancelOverFlow = () => {
        document.querySelector('body').style.overflowY = 'auto';
    }
        return (
            <div className="modal-cart fx-basic fx-center-all" onClick={props.handleModal} id="cartModal">
                <div className={`fx-basic fx-center-all ${props.klasa}`} >
                <div className="fx-column fx-align-center form">
                <p>{props.text}</p>
                    <form id="loginForm" name="loginForm" onChange={props.clearError} >
                        
                      {props.type === "both" ?   <div className="fx-basic fx-align-center fx-justify-between auth-form-line">
                                <label className="left-input" htmlFor="Reemail">Email</label>
                                <input className="right-input" type="email" id="email" placeholder="Enter your email"></input>
                            </div> : null}

                            <div className="fx-basic fx-justify-between fx-align-center auth-form-line">
                                <label className="left-input" htmlFor="Repassword" >Password</label>
                                <input className="right-input" type="password" id="password" autoComplete="password"placeholder="Enter your password"></input>
                            </div>
                            {props.type === "password" ?         
                    <div className="account-details-holder fx-basic fx-justify-center">
            <div className="account-details-recheck">
            <div className="fx-basic fx-justify-between">
                <label htmlFor="recheck-firstName">First name</label>
                <input type="text" id="recheck-firstName" className={props.newUserData.firstName === props.user.firstName ? "" : "account-details-changed"}  defaultValue={props.newUserData.firstName} disabled={true} autoComplete="first name"></input>
            </div>
            <div className="fx-basic fx-justify-between">
                <label htmlFor="recheck-lastName">Last name</label>
                <input type="text" id="recheck-lastName" className={props.newUserData.lastName === props.user.lastName ? "" : "account-details-changed"} defaultValue={props.newUserData.lastName} disabled={true}autoComplete="last name"></input>
            </div>
            <div className="fx-basic fx-justify-between">
                <label htmlFor="recheck-address">Address</label>
                <input type="text" id="recheck-address" className={props.newUserData.userAddress === props.user.userAddress ? "" : "account-details-changed"} defaultValue={props.newUserData.userAddress} disabled={true} autoComplete="address"></input>
            </div>
            <div className="fx-basic fx-justify-between">
                <label htmlFor="recheck-email">Email</label>
                <input type="email" id="recheck-email" className={props.newUserData.email === props.user.email ? "" : "account-details-changed"} defaultValue={props.newUserData.email} disabled={true} autoComplete="email"></input>
            </div>
            <div className="fx-basic fx-justify-between">
                <label htmlFor="recheck-password">Password</label>
                <input type="text" id="recheck-password" className={props.newUserData.password ===  "" ? "" : "account-details-changed"} defaultValue={props.newUserData.newPassword || "*********"} disabled={true} autoComplete="password"></input>
            </div>
            </div>
        </div> : null}
        <div className={`${!props.error && !props.success ? "visibility-none auth-message" : props.error ? "fx-basic fx-justify-center auth-error auth-message" : "fx-basic fx-justify-center auth-success auth-message"} `}><span>{props.error ? props.errorMessage : props.successMessage}</span></div>
                            <div className="fx-basic fx-justify-center">
                    <button type="submit" onClick={e => props.handleCredentials(e)} form="loginForm">{props.buttonText}</button>
                            </div>
                    </form>
                    {props.auth ? null : <p id="redirect-to-sign-up"><NavLink to="/sign-up" onClick={cancelOverFlow}>Don't have an account? Sign Up Here!</NavLink></p>}
                </div>
                </div>
            </div>
        );
}

export default LoginModal;