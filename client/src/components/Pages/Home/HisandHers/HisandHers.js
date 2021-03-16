import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import './styles.scss';

const HisandHers = () => {
    return (
        <div className="his-and-hers-container fx-basic fx-justify-between">
            <div className="hers-container">
                    <div className="hers-link fx-basic fx-justify-center">
                        <a href={`/shop/women`}>Shop Hers</a>
                    </div>

                <div className="hers-image-container fx-basic fx-justify-start">
                    <img src={`${currentUrl}/public/images/general/hers.png`} alt="female shoes" />
                </div>
            </div>

            <div className="his-container">
                    <div className="his-link fx-basic fx-justify-center">
                    <a href={`/shop/men`}>Shop His</a>
                    </div>

                <div className="his-image-container fx-basic fx-justify-end">
                    <img src={`${currentUrl}/public/images/general/his.png`} alt="female shoes" />
                </div>
            </div>
        </div>
    );
};

export default HisandHers;