import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import { Link } from 'react-router-dom';
import { shortenByCharacters } from '../../../SharedComponents/ReusableFunctions';
import './styles.scss';

const HomeItem = (props) => {
    return (
        <Link to={`/item/${props.item._id}`}>
            <div className="home-item-container fx-column">
                <div className="home-item-image-container fx-basic fx-center-all">
                    <img src={`${currentUrl}/${props.item.imagePaths[1]}`} alt={`${props.altText} ${props.item.brand} shoe`} />
                </div>
                <div className="home-item-body fx-column">
                    <span>{props.text}</span>
                    <span>{shortenByCharacters(props.item.fullName, 18)}</span>
                    <span className="red">{props.item.cost}$</span>
                </div>
            </div>
        </Link>
    );
};

export default HomeItem;