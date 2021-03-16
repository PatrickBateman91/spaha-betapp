import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import { handleDiscount } from '../../../SharedComponents/ReusableFunctions';
import {Link} from 'react-router-dom';
import './styles.scss';

const SaleItem = (props) => {
    return (
        <div className="budget-sale-single-item">
            <Link to={`item/${props.item._id}`}>
            <img src={`${currentUrl}/${props.item.imagePaths[1]}`} alt={props.item.fullName} />
            </Link>

            <div className="fx-column fx-justify-center budget-sale-price">
                    <span>{handleDiscount(props.item.discountType, props.discounts)}% OFF</span>
                </div>
        </div>
    );
};

export default SaleItem;