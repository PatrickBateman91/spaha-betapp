import React from 'react';
import { currentUrl } from '../../SharedComponents/Mode';
import { shortenWord } from '../../SharedComponents/ReusableFunctions';
import EmptyProfile from './EmptyProfile';
import './styles.scss';

const PreviousPurchases = (props) => {

    const purchases = props.userPreviousPurchases.map((item, index) => {
        const totalCost = (item.itemDetails.cost * item.purchaseObject.amount).toFixed(2);
        return (
            <div className="fx-basic fx-align-center purchase-item" key={item.itemDetails.fullName + index}>
                <div className="purchase-image"><img src={`${currentUrl}/${item.itemDetails.imagePaths[0]}`} alt={item.itemDetails.fullName} /></div>
                <div className="purchase-name"><p>{shortenWord(item.itemDetails.fullName, 2)}</p></div>
                <div><p>{item.purchaseObject.size}</p></div>
                <div className="purchase-brand"><p>{item.itemDetails.brand}</p></div>
                <div><p>{item.purchaseObject.discount ? `${item.purchaseObject.discountAmount}%` : '/'}</p></div>
                <div><p>{totalCost}$</p></div>
                {item.purchaseObject.amount > 1 ? <div className="purchase-amount">x{item.purchaseObject.amount}</div> : null}
                <div className="delete-purchase" onClick={props.deletePurchase.bind(this, item.purchaseObject.purchaseId)}>x</div>
            </div>
        )
    })

    if (props.userPreviousPurchases.length === 0) {
        return <EmptyProfile message="You have no previous purchases" />
    } else {
        return (
            <div className="purchase-table">
                <div className="fx-basic purchase-header">
                    <div className="table-empty"></div>
                    <div><p>Name</p></div>
                    <div><p>Size</p></div>
                    <div><p>Brand</p></div>
                    <div><p>Discount</p></div>
                    <div><p>Price</p></div>
                </div>
                <div>
                    {purchases}
                </div>
            </div>
        );
    }
}

export default PreviousPurchases;