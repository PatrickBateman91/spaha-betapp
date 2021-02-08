import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import CardRating from './CardRating';
import {currentUrl} from '../dumbComponents/Mode';
import { shortenWord } from './ReusableFunctions';


const Card = (props) => {
    const worthyCheck = props.rating > 4.25 && props.numberOfVotes > 10;
    return (
        <Fragment>
            <Link to={`/item/${props.id}`}>
                <div className={props.klasa}><p className="bold">{shortenWord(props.fullName, 3)}</p></div>
                <div className="shopping-item-brand relative"><p>{props.brand}</p>
                    {props.user.hasOwnProperty('_id') && props.user !== "guest" ? <div onClick={props.favouriteHandler} className="favourite-icon-container"><i className={props.favourite ? "fas fa-heart" : "far fa-heart"}></i></div> : null}
                    {worthyCheck ? <div className="shopping-top"></div> : null}
                </div>
                <p className="shopping-item-cost">{props.cost.toFixed(2)}$</p>
                <div className="fx-basic fx-center-all shopping-item-image">
                    <img src={currentUrl + "/" + props.imgSource} alt={props.imgAlt} />
                </div>
            </Link>
            <div className="fx-column fx-wrap fx-center-all">
                <CardRating
                    handleRating={props.handleRating}
                    itemId={props.id}
                    rating={props.rating}
                    userRatings={props.user !== "guest" && props.user ? props.user.userRatings : []}
                    userId={props.user._id}
                />
                <div className="shopping-people-number">{props.numberOfVotes} people rated this item!</div>
            </div>
        </Fragment>
    )
}

export default Card;