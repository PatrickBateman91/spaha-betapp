import React, { Fragment } from 'react';
import LoginModal from '../../Auth/LoginModal';
import './styles.scss';

const AccountDetails = (props) => {
    return (
        <Fragment>
            <div className="account-details-holder">
                <form id="accountDetails" onChange={props.handleAccountFormChange}>
                    <div className="fx-basic fx-justify-between">
                        <label htmlFor="account-firstName">First name</label>
                        <input type="text" id="account-firstName" className={!props.formActive && props.newUserData.firstName !== props.user.firstName ? "account-details-changed" : ""} defaultValue={props.user.firstName} disabled={props.formActive} autoComplete="first name"></input>
                    </div>
                    <div className="fx-basic fx-justify-between">
                        <label htmlFor="account-lastName">Last name</label>
                        <input type="text" id="account-lastName" className={!props.formActive && props.newUserData.lastName !== props.user.lastName ? "account-details-changed" : ""} defaultValue={props.user.lastName} disabled={props.formActive} autoComplete="last name"></input>
                    </div>
                    <div className="fx-basic fx-justify-between">
                        <label htmlFor="account-userAddress">Address</label>
                        <input type="text" id="account-userAddress" className={!props.formActive && props.newUserData.userAddress !== props.user.userAddress ? "account-details-changed" : ""} defaultValue={props.user.userAddress} disabled={props.formActive} autoComplete="address"></input>
                    </div>
                    <div className="fx-basic fx-justify-between">
                        <label htmlFor="account-email">Email</label>
                        <input type="email" id="account-email" className={!props.formActive && props.newUserData.email !== props.user.email ? "account-details-changed" : ""} defaultValue={props.user.email} disabled={props.formActive} autoComplete="email"></input>
                    </div>
                    <div className="fx-basic fx-justify-between">
                        <label htmlFor="account-password">Password</label>
                        <input type="password" id="account-password" className={!props.formActive && props.newUserData.password !== "" ? "account-details-changed" : ""} defaultValue="" placeholder="**********" disabled={props.formActive} autoComplete="password"></input>
                    </div>
                </form>
                <div className={`fx-basic fx-justify-center fx-align-center auth-message ${!props.error ? "visibility-none" : "auth-error"}`}><span>{props.error ? props.errorMessage : "Basic error"}</span></div>
                <div className="fx-basic fx-justify-around account-details-buttons">
                    <button type="submit" form="accountDetails" onClick={(e) => props.handleModal(e)}>Submit details</button>
                    <button form="accountDetails" type="button" onClick={e => props.handleEdit(e)}>Edit details</button>
                </div>
            </div>
            {props.modalOpen ?
                <LoginModal
                    auth={true}
                    buttonText="Confirm"
                    error={props.error}
                    errorMessage={props.errorMessage}
                    handleModal={(e) => props.handleModal(e)}
                    handleCredentials={props.handleCredentials}
                    newUserData={props.newUserData}
                    klasa="account-details-modal"
                    success={props.success}
                    successMessage={props.successMessage}
                    text="Please type your password to change account details!"
                    type="password"
                    user={props.user}
                /> : null}
        </Fragment>
    );

};

export default AccountDetails;