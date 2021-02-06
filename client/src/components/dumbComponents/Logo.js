import React from 'react';
import '../../App.css';
import logo from '../../images/shopping-logo.png'

const Logo = () => {
    return (
        <div className="fx-align-center fx-basic">
            <img src={logo} alt="logo" />
            <p>TOKEN SHOP</p>
        </div>
    );
};

export default Logo;