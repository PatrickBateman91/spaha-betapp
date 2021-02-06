import React from 'react';
import '../../App.css';

const Sizes = (props) => {
    const selectSize = (e) => {
        let availableSizes = document.getElementsByClassName("sizes-available");
        let sizesArray = Array.from(availableSizes);
        sizesArray.forEach(item => {
            if(item.innerText === e.target.innerText){

                item.style.backgroundColor = "black";
                item.style.color = "white";
            }
            else{

               item.style.backgroundColor = "#318023";
               item.style.color = "black";
            }
        })
        props.handleSize(parseInt(e.target.innerText));
    }

        let sizesKeys = Object.keys(props.item.availability)
        let value1 = props.item.gender === "Men" ? 36 : props.item.gender === "Women" ? 34 : 24;
        let value2 = props.item.gender === "Men" ? 47 : props.item.gender === "Women" ? 45 : 38;
        let renderItems = [];
            renderItems = sizesKeys.map(size => {
                
           if(parseInt(size) > value1 && parseInt(size) < value2){
            return (
                <p key={size} 
                className={`fx-basic fx-center-all ${props.item.availability[size] > 0 ? "sizes-available" : "sizes-not-available"}`}
                onClick={props.item.availability[size] > 0 ? selectSize : null}
                >
                {size}
                </p>
            )
           } else return false;
            })
        return(
          <div className="fx-basic fx-justify-center">
            <div className="fx-basic fx-wrap sizes-container">
                {renderItems}
            </div>
            </div>
        )
    }


export default Sizes;