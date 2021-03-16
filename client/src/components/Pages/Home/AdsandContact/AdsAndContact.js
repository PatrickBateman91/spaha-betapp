import React from 'react';
import Ads from './Ads';
import Contact from './Contact';
import './styles.scss';

const AdsAndContact = () => {
    return (
        <div className="ads-and-contact-container fx-basic fx-justify-around">
            <Ads />
            <Contact />
        </div>
    );
};

export default AdsAndContact;