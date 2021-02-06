import React,{Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

const IndividualComplain = (props) => {
     const copyClickedObject = JSON.parse(JSON.stringify(props.clickedObject))
     let answers=[];
     let finalItems;
     
          if(props.clickedObject.userQuestions.length > 0){
               props.clickedObject.userQuestions.forEach((item, index) =>{
                    copyClickedObject.userQuestions[index].type="user";
                    answers.push(item)
               })
          }
     
          if(props.clickedObject.adminAnswers.length > 0){
               props.clickedObject.adminAnswers.forEach((item, index) =>{
                    copyClickedObject.adminAnswers[index].type="admin";
                    answers.push(item)
               })
          }
         let sortedAnswers = answers.sort((a,b) => {
              const firstDate = new Date(a.timestamp);
              const secondDate = new Date(b.timestamp);
              return firstDate - secondDate;
         })
     
          finalItems = sortedAnswers.map(item => {
               const newDate = new Date(item.timestamp);
              let year = newDate.getFullYear();
              let month = newDate.getMonth() + 1;
              let day = newDate.getDate();
              let hour = newDate.getHours();
              let minute = newDate.getMinutes();
              let second = newDate.getSeconds();
              
              return (
               <Fragment key={item._id}>
                       {item.type === "user" ? 
               <div className={props.whoIsLogged === "admin" ? "fx-column user-answer-container" : "fx-column admin-answer-container" }>
               <div className={props.whoIsLogged === "admin" ?  "contact-answer-text" : "show-admin-answer"}>
                    <div>{item.text}</div>
                    <span className="contact-date">{`${hour < 10 ? "0" + hour : hour }:${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}, - ${day}. ${month}, ${year}.`}</span>
               </div>
               </div> 
              :
               <div className={props.whoIsLogged === "admin" ? "fx-column admin-answer-container" : "fx-column user-answer-container"}> 
                    <div className={props.whoIsLogged === "admin" ? "show-admin-answer" : "contact-answer-text"}>
                         <div>{item.text}</div>
                         <span className="contact-date">{`${hour < 10 ? "0" + hour : hour }:${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}, - ${day}. ${month}, ${year}.`}</span>
                    </div>
                    </div> 
        }
       </Fragment>
              )
         })
     

     return (
  
      <div className="fx-column contact-answer-container">
          <div><span>Subject:</span> {props.clickedObject.subject}</div>
          <div><span>From: </span>{props.whoIsLogged === "admin" ? "Amar Spahić": props.clickedObject.user[0].email}</div>
          {props.whoIsLogged === "admin" && !props.clickedObject.resolved && props.clickedObject.type === "guest" ? <div className="fx-basic fx-justify-end guest-message-info">
               <div className="fx-basic">
               <FontAwesomeIcon icon={faInfo} />
        <span>  This question was asked by a person with no account on our website. Your reply will be sent automatically to the provided email. Conversation will be automatically marked as resolved once you answer!</span>
               </div>
          </div> : null}
          {props.clickedObject.hasOwnProperty("userQuestions") > 0 ? finalItems : null}
               <form className="fx-column" name="contact-answer-form" id="contact-answer-form" onSubmit={e => props.handleAnswerSubmit(e, props.clickedObject._id, props.clickedObject.subject)}>
               {props.clickedObject.resolved ? null: <textarea rows="15" cols="80"></textarea>}
                    <div className="fx-basic">
                         {props.clickedObject.resolved ? null : <button type="submit" form="contact-answer-form">Submit answer</button>}
                         {props.clickedObject.resolved ? null : props.whoIsLogged === "admin" ? <button type="button" onClick={(e) => props.handleResolved(e,props.clickedObject._id)}>Mark question as resolved</button> : null}
                         <button type="button" onClick={props.handleReturn}>Return</button>
                    </div>
               </form>
               </div>
     )
}

export default IndividualComplain;
