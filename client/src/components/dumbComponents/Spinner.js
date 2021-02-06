import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader'

const Spinner = () => {
    return (
        <div className="fx-basic fx-justify-center fx-align-center spinner-container">
               <MoonLoader/>
        </div>
    );
};

export default Spinner;