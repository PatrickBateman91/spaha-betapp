import React from 'react';
import {NavLink} from 'react-router-dom';
import SearchBox from '../dumbComponents/SearchBox';

const LinksSignedOut = (props) => {
   
    return (
        <ul className="fx-basic fx-align-center">
            <SearchBox handleSearch={props.handleSearch} />
            <li><NavLink to="/sign-in">LOGIN</NavLink></li>
            <li><NavLink to="/sign-up">SIGN UP</NavLink></li>
        </ul>
    )
}

export default LinksSignedOut;