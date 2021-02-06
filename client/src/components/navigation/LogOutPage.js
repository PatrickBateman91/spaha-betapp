import React from 'react';
import {signOutRequest} from '../axios/UserRequests';
import {connect} from 'react-redux';

const LogOutPage = (props) => {
   const signOutPromise = signOutRequest();
   signOutPromise.then(res => {
    props.logOutUser();
    setTimeout(() => props.history.push('/'), 1000)
   }).catch(err => {
    setTimeout(() => props.history.push('/'), 1000)
   })
    
    return (
        <div className="main-container fx-basic fx-center-all">
           <span className="log-out-title"> You have logged out. Redirecting you to home page...</span>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        logOutUser: () => {
            dispatch({type: "user/logOutUser"})
        }
    }
}

export default connect(null,mapDispatchToProps)(LogOutPage);