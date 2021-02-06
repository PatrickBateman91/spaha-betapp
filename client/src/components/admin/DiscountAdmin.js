import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const DiscountAdmin = (props) =>  {
        let discounts = props.discounts.map(discount => {
            return (
                <div className="admin-discount-fields-container fx-basic fx-justify-between" key={discount.name}>
                               
                {props.discountEdit && props.discountSelected === discount.name ? 
                <Fragment>
                    <input type="text" id={`contact-name-${discount.name}`} defaultValue={discount.name} />
                    <input type="number" id={`contact-amount-${discount.amount}`} defaultValue={discount.amount}></input>
                    <FontAwesomeIcon icon={faTrash} id="delete-discount" onClick={props.deleteDiscount.bind(this, discount.name)}/>
                </Fragment>
                :
                <Fragment>
                    <label htmlFor={`${discount.name}`}>{discount.name}</label>
                    <label htmlFor={`${discount.amount}`}>{discount.amount}%</label>
                    <FontAwesomeIcon icon={faEdit} className="admin-discount-edit" onClick={props.handleEdit.bind(this, discount.name)} />
                </Fragment>}


                            
                </div>
            )
        })
        
        return (
            <div className="admin-discount-container fx-column fx-align-center">
                <div id="admin-discount-title">Current discounts:</div>
                {discounts.length > 0 ? <div className="fx-column fx-align-center">
                    {discounts}
                    {props.discountEdit ? <button type="button" className="admin-discount-change-button" onClick={props.changeDiscounts}>Submit changes</button> : null}
                </div> : <div className="errorColor">You have no discounts!</div>}
            <div id="admin-add-discount-title">Add New Discount:</div>
            <form id="add-new-discount" className="fx-column fx-align-center" onSubmit={props.submitNewDiscount}>
            <div id="admin-discount-label-input-container">
                
            <label htmlFor={`discount-name`}>Discount name</label>
            <input type="text" id={`discount-name`} ></input>

            <label htmlFor={`discount-percentage`}>Discount percentage</label>
            <input type="number" id={`discount-percentage`}></input>

            </div>
            <button type="submit" form="add-new-discount">Add Discount</button>
            </form>
            </div>
        );
    }


export default DiscountAdmin;