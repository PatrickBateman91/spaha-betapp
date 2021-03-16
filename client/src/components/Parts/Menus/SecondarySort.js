import React from 'react';
import './styles.scss';

const SecondarySort = (props) => {

    return (
        <div className="secondary-sort-container fx-basic fx-justify-start">
            <div className="secondary-sort-title fx-basic fx-justify-between"
                id="secondarySortTitle"
                onClick={props.sortToggler}>{props.secondarySortModalText}
                <i className={props.secondarySortModal ? "fas fa-caret-up" : "fas fa-caret-down"}></i></div>
            {props.secondarySortModal ? <div id="items-to-show" onClick={(e) => props.handleSort(e)}>
                <div><p>Price (low to high)</p></div>
                <div><p>Rating</p></div>
                <div><p>Number of reviews</p></div>
                <div><p>Price (high to low)</p></div>
            </div> : null}
        </div>
    );

}

export default SecondarySort;