import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import './styles.scss';

const KidsShoes = () => {
    return (
        <div className="fx-basic fx-justify-between kids-shoes-home-container">
            <div className="kids-shoes-home-image-container">
                <img src={`${currentUrl}/public/images/general/kids-shoes.jpg`} alt="Kids shoes" />
            </div>
            <div className="kids-shoes-home-text-container fx-column fx-align-center">
                <div className="kids-shoes-home-text fx-column">
                    <span>Preschool discount</span>
                    <span>For children of all ages</span>
                </div>
                <div className="kids-shoes-home-link fx-basic fx-justify-center">
                    <a href={`/shop/kids`}>Shop now</a>
                </div>
            </div>
        </div>
    );
};

export default KidsShoes;