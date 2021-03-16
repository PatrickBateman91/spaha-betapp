import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import {Link} from 'react-router-dom';
import './styles.scss';

const BudgetItem = (props) => {
    return (
           <span className="fx-basic budget-sale-single-item">
               <Link to={`/item/${props.item._id}`}>
                    <img src={`${currentUrl}/${props.item.imagePaths[0]}`} alt={props.item.fullName} />
               </Link>
                <div className="fx-column fx-justify-center budget-sale-price">
                    <span>{props.item.cost}$</span>
                </div>
           </span>
    );
};

export default BudgetItem;