import React from 'react';
import './styles.scss';

const EmptyProfile = (props) => {
    return (
        <div className="empty-profile-div fx-basic fx-justify-center fx-align-center"><span>{props.message}</span></div>
    );
};

export default EmptyProfile;