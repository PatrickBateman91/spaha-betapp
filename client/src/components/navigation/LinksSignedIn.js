import React from 'react';
import {NavLink} from 'react-router-dom';
import SearchBox from '../dumbComponents/SearchBox';
import {withRouter} from 'react-router-dom';

const LinksSignedIn = (props) => {
    return (
        <ul className="fx-basic fx-align-center">
            <SearchBox handleSearch={props.handleSearch} />
            {props.userAdmin? <li><NavLink to={`/admin-dashboard`}>ADMIN</NavLink></li> :null}
    {props.userAdmin? null: <li><NavLink to={`${props.location.pathname}`} id="cartSignedIn" onClick={props.modal}>CART ({props.cartLength})</NavLink></li>}
    {props.userAdmin? null: <li><NavLink to={`/profile/${props.uid}`}>PROFILE {props.notifications !== 0 ? <span className={`${props.notifications === 0 ? "" : "auth-error"}`}>{`(${props.notifications})`}</span> : ""}</NavLink></li>}
            <li><NavLink to="/log-out">LOG OUT</NavLink></li>
        </ul>
    )
}

export default withRouter(LinksSignedIn);