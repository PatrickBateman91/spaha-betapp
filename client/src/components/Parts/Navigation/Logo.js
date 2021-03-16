import React from 'react';
import logo from '../../../assets/images/shopping-logo.png'
import './styles.scss';

const Logo = () => {
    return (
        <div className="fx-align-center fx-basic">
            <img src={logo} alt="logo" />
            <p>TOKEN SHOP</p>
        </div>
    );
};

export default Logo;