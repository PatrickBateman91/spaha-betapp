import React from 'react';

const BackToStoreButton = (props) => {
    return (
        <div onClick={props.backToStore} className="fx-basic fx-justify-end fx-align-center back-to-store-button">
           <span>Back to store</span>
        </div>
    );
};

export default BackToStoreButton;