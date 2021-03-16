import React, {Fragment} from 'react';
import '../styles.scss';

const AddEditForm = (props) => {
    const firstInputs = props.firstInputs.map(item => {
        if(item.name !== "discount" && item.name !== "gender"){
          return(
              <div className="add-edit-item-full-line fx-basic fx-justify-between" key={item.name}>
              <label htmlFor={item.name}>{item.label}</label>
              <input 
              type={item.type} 
              id={item.name} 
              defaultValue={props.items[item.name]} 
              disabled={item.name === "discountType" ? (props.items.discount ? false : true) : null}
              step={ 0.01} 
              min={item.name === "rating" ? 1 : 1} 
              max={item.name === "rating" ? 5 : 100000}
            />
          </div>
            )
        }
        else if(item.name === "discount"){
            return(
              <div className="add-edit-item-full-line fx-basic fx-justify-between" key={item.name}>
              <label htmlFor={item.name}>{item.label}</label>
              <select id={item.name} defaultValue={props.items.discount}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
              </select>
          </div>
            )
        }
        else if(item.name === "gender"){
           return (
            <div className="add-edit-item-full-line fx-basic fx-justify-between" key={item.name}>
            <label htmlFor={item.name}>{item.label}</label>
            <select id={item.name} defaultValue={props.items.gender} >
                <option value={""}>Men</option>
                <option value={""}>Women</option>
                <option value={""}>Kids</option>
            </select>
        </div>
           )
        } else return false;
     
    })
    let value1 = props.gender === "Men" ? 36 : props.gender === "Women" ? 34 : 24;
    let value2 = props.gender === "Men" ? 47 : props.gender === "Women" ? 45 : 38;
    const secondInputs = props.secondInputs.map(item => {
        if(parseInt(item.label) > value1 && parseInt(item.label) < value2){
            return (
                <div className="fx-basic fx-justify-between fx-align-center add-edit-item-half-line" key={item.name}>
                <label htmlFor={item.name}>{item.label}</label>
                <input id={item.name} defaultValue={props.items.availability[item.label]} type="number" className="availability" min={0} />
            </div>
            )
        } else return false;
    })

    return (
        <Fragment>
              {firstInputs}
                    <div className="add-edit-item-availability">Availability</div>
                    <div className="fx-basic fx-justify-center">
                        <div className="fx-basic fx-wrap availability-holder">{secondInputs}</div>
                    </div>
                    <div className={`${props.formError ? "" : "visibility-none"} fx-basic fx-justify-center`}><span className="auth-message auth-error">{props.formError ? props.formErrorMessage : "Basic error"}</span></div>
        </Fragment>
    );
};

export default AddEditForm;