import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import './styles.scss';

const BrowseAll = () => {
    return (
        <div className="browse-all-container fx-column fx-align-center fx-justify-center">
            <span className="browse-all-title">Not found what you were looking for?</span>
            <img src={`${currentUrl}/public/images/general/yellow-tape.png`} alt="Yellow tape not found" />
            <div className="browse-all-link fx-basic fx-justify-center">
                <a href="/shop/all">Browse all shoes</a>
            </div>
        </div>
    );
};

export default BrowseAll;