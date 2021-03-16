import React from 'react';
import './styles.scss';

const Contact = (props) => {

    return (
        <div className="contact-home-container fx-column fx-justify-around fx-align-center">
            <div className="fx-column">
                <span className="contact-home-title">No matching shoe size?</span>
                <span className="contact-home-title">Have some suggestions?</span>
                <span className="contact-home-title">Need help?</span>
            </div>
            <a href="/contact-us" id="contact-home-button">Contact us</a>
        </div>
    );
};

export default Contact;