import React from 'react';
import Budget from './Budget';
import Sale from './Sale';
import './styles.scss';

const BudgetandSale = (props) => {
    return (
        <div className="budget-and-sale-container fx-basic fx-wrap fx-justify-between">
            <Budget items={props.budgetItems} />
            <Sale discounts={props.discounts} items={props.saleItems} />
        </div>
    );
};

export default BudgetandSale;