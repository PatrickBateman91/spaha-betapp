import React from 'react';
import './styles.scss';

const BackToStoreButton = (props) => {
    return (
        <div onClick={props.backToStore} className="fx-basic fx-justify-center fx-align-center back-to-store-button">
            <span>Back to store</span>
        </div>
    );
};

export default BackToStoreButton;