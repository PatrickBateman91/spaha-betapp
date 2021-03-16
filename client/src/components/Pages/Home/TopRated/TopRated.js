import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import './styles.scss';

const TopRated = () => {
    return (
        <div className="fx-basic fx-justify-between fx-align-center top-rated-container">
            <div className="top-rated-image-container fx-basic fx-center-all">
                <img src={`${currentUrl}/public/images/general/top-rated.png`} alt="" />
            </div>

            <div className="top-rated-text-container">
                <div className="top-rated-text fx-column">
                    <span>Check out</span>
                    <span>The best of the best</span>
                </div>
                <div className="top-rated-link fx-basic fx-justify-center">
                    <a href={`/shop/top-rated`}>Shop now</a>
                </div>
            </div>
        </div>
    );
};

export default TopRated;