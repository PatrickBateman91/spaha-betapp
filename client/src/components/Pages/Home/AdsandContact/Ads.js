import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import './styles.scss';

const Ads = (props) => {
    return (
        <div className="ad-home fx-column fx-align-center fx-justify-around" >
            <a href="https://spaha-betapp.netlify.app" target="_blank" rel="noopener noreferrer">
                <span>Have you tried our Bet web app?</span>
                <img src={`${currentUrl}/public/images/general/bet-web-app.JPG`} alt="bet-web-app" />

            </a>
        </div>
    );
};

export default Ads;