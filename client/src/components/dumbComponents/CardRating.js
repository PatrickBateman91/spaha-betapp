import React from 'react'

const CardRating = (props) => {
  let userRatings = [];
  if(props.userId && props.userId !== "rating"){
    userRatings = props.userRatings;
  }

let index;
let hasRating = false;
 for (let i = 0; i < userRatings.length; i++){
    if(userRatings[i].name === props.itemId){
      index = i;
      hasRating = true;
      break;
    }
 }

  //Da se izbjegne error Proptypes checked
  let blank = () => {
    return;
  }

    return (
      <div className="fx-basic fx-wrap rating-my-container" onMouseEnter={props.hoverIn} onMouseLeave={props.hoverOut} onClick={e => props.handleRating(e, props.itemId)}>
             <fieldset className={hasRating ? "user-rating" : "rating"} >
          <input onChange={blank} id="star5" type="radio" checked={hasRating ? userRatings[index].rating > 4.75 : props.rating > 4.75} value="5" /><label className="full" htmlFor="star5"></label>
          <input onChange={blank} id="star4half" type="radio" checked={hasRating ? userRatings[index].rating > 4.25 : props.rating > 4.25} value="4.5" /><label className="half" htmlFor="star4half"></label>
          <input onChange={blank} id="star4" type="radio" checked={hasRating ? userRatings[index].rating > 3.75 : props.rating > 3.75} value="4" /><label className="full" htmlFor="star4"></label>
          <input onChange={blank} id="star3half" type="radio" checked={hasRating ? userRatings[index].rating > 3.25 : props.rating > 3.25} value="3.5" /><label className="half" htmlFor="star3half"></label>
          <input onChange={blank} id="star3" type="radio" checked={hasRating ? userRatings[index].rating > 2.75 : props.rating > 2.75} value="3" /><label className="full" htmlFor="star3"></label>
          <input onChange={blank} id="star2half" type="radio" checked={hasRating ? userRatings[index].rating > 2.25 : props.rating > 2.25} value="2.5" /><label className="half" htmlFor="star2half"></label>
          <input onChange={blank} id="star2" type="radio" checked={hasRating ? userRatings[index].rating > 1.75 : props.rating > 1.75} value="2" /><label className="full" htmlFor="star2"></label>
          <input onChange={blank} id="star1half" type="radio" checked={hasRating ? userRatings[index].rating > 1.25 : props.rating > 1.25} value="1.5" /><label className="half" htmlFor="star1half"></label>
          <input onChange={blank} id="star1" type="radio" checked={hasRating ? userRatings[index].rating > 0.75 : props.rating > 0.75} value="1" /><label className="full" htmlFor="star1" ></label>
          <input onChange={blank} id="starhalf" type="radio" checked={hasRating ? userRatings[index].rating > 0 :props.rating > 0} value="0.5" /><label className="half" htmlFor="starhalf"></label>
        </fieldset>
      </div>
    )
  }


export default CardRating;
