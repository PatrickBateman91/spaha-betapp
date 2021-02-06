import React from 'react';

const ContactHome = (props) => {

    return (
        <div className="contact-home-container fx-column fx-justify-around fx-align-center">
            <div className="fx-column">
            <span className="contact-home-title">No matching shoe size?</span>
            <span className="contact-home-title">Have some suggestions?</span>
            <span className="contact-home-title">Need help?</span>
            </div>
          <button onClick={e => props.reDirect('/contact-us')} id = "contact-home-button">Contact us</button>
        </div>
    );
};

export default ContactHome;