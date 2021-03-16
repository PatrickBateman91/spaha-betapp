import React from 'react';
import { currentUrl } from '../../../SharedComponents/Mode';
import { Link } from 'react-router-dom';
import '../styles.scss';

const ShowMore = (props) => {
    let imgDivs = props.items.map((item, index) => {
        if (props.randomNumbersArray.indexOf(index) !== -1) {
            return <img src={`${currentUrl}/${item.imagePaths[1]}`} alt={item.fullName} key={item._id} />
        } else return false;
    })

    return (
        <Link to={props.href}>
            <div className="show-more-container fx-column fx-align-center fx-justify-center">
                <div className="show-more-image-container fx-column fx-wrap fx-justify-center">
                    {imgDivs}
                </div>
                <span>Show more</span>
                <span>+</span>
            </div>
        </Link>
    );
};

export default ShowMore;