import React from 'react'
import './styles.scss';

const ListOfFeedbacks = (props) => {

     return (
        <div id="contact-container" className="fx-basic fx-wrap">

        <div id="contact-header" className="fx-basic contact-list fx-justify-around fx-align-center">
            <div className="contact-subject">Subject</div>
          {props.whoIsLogged === "admin" ?   <div className="contact-email">Email</div> : null}
            <div className="contact-text">Text</div>
            <div className="contact-status">Status</div>
            </div>
            {props.contacts}
    </div>
     )
}

export default ListOfFeedbacks;
