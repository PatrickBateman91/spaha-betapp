import React from 'react';

const EmptyProfile = (props) => {
    return (
        <div className="empty-profile-div fx-basic fx-justify-center fx-align-center"><span>{props.message}</span></div>
    );
};

export default EmptyProfile;