import React, { Fragment, Component } from 'react';
import {adminResponseRequest, getAdminFeedbackRequest, markAsAdminRead, markAsResolved } from '../../../services/axios/AdminRequests';
import { connect } from 'react-redux';
import { shortenWord } from '../../SharedComponents/ReusableFunctions';
import { userFeedbackRequest } from '../../../services/axios/UserRequests';
import EmptyProfile from '../../Pages/Profile/EmptyProfile';
import IndividualComplain from './IndividualComplain';
import ListOfFeedbacks from './ListOfFeedbacks';
import './styles.scss';

class ManageFeedback extends Component {
        state = {
            contactClicked: false,
            clickedObject: {},
            pageLoaded: false
        }
    

    componentDidMount() {
        window.scrollTo(0,0);
        if (this.props.user.hasOwnProperty("_id") && this.props.type === "user" && !this.props.user.admin) {
            this.setState({
                pageLoaded: true
            })
        } else if (this.props.user.hasOwnProperty("_id") && this.props.type === "admin" && this.props.user.admin) {
            this.getAdminDataFromServer();
        }

    }

    getAdminDataFromServer = () => {
        if (this.props.type === "admin") {
            const getAdminFeedbackPromise = getAdminFeedbackRequest("get feedback");
            getAdminFeedbackPromise.then(res => {
                this.props.setAdminFeedbackData(res.data);
                this.setState({
                    pageLoaded:true
                })
            }).catch(err => {
                let errorMessage = "Something went wrong";
                if(typeof err.response.data === "string"){
                    errorMessage = err.response.data;
                }
               this.setState({
                   error:true,
                   errorMessage: errorMessage
               })
            })
        }
    }

    handleAnswerSubmit = (e, _id) => {
        let newObject = {
            text: document.getElementById("contact-answer-form").elements[0].value,
            _id
        }
        e.preventDefault();
        if (this.props.type === "admin") {
            if(newObject.text !== ""){
                const adminResponsePromise = adminResponseRequest('new admin response', newObject);
                adminResponsePromise.then(res => {
                    this.props.updateContactForm(res.data);
                    this.setState({
                        clickedObject: res.data
                    }, () => {
                        document.getElementById("contact-answer-form").elements[0].value = ""
                    })
                }).catch(err => {
                    this.setState({
                        error:true,
                        errorMessage: err.response.data || "Could not send message to the user!"
                    })
                })
            }
        }
        else if (this.props.type === "user") {
            if (newObject.text !== "") {
                const uploadAnswerPromise = userFeedbackRequest('new user answer', newObject);
                uploadAnswerPromise.then(res => {
                    this.props.updateContactForm(res.data);
                    this.setState({
                        clickedObject: res.data
                    }, () => {
                        document.getElementById("contact-answer-form").elements[0].value = ""
                    })
                }).catch(err => {

                    this.setState({
                        error: true,
                        errorMessage: err.response.data || "Could not send answer!"
                    })
                })
            } else {
                this.setState({
                    error: true,
                    errorMessage: "Message cannot be blank!"
                })
            }

        }
    }

    handleReturn = () => {
        this.setState({
            contactClicked: false,
            clickedObject: {}
        }, () => {
            window.scrollTo(0, 0);
        })
    }

    handleResolved = (e, id) => {
        const markAsResolvedPromise = markAsResolved('mark as resolved', id);
        markAsResolvedPromise.then(res => {
            this.props.updateContactForm(res.data);
            this.setState({
                contactClicked: false,
                clickedObject: {}
            })
        }).catch(err => {
            this.setState({
                error:true,
                errorMessage:"Could not mark as resolved!"
            }, () => {
                window.scrollTo(0,0);
            })
        })
    }

    openComplain(id) {
        const clickedObject = this.props.user.contactForms.filter(form => form._id === id);
        if (this.props.type === "admin") {
            if(!clickedObject[0].openedByAdmin){
                const markAsAdminPromise = markAsAdminRead("mark as read", id); 
                markAsAdminPromise.then(res => {
                 this.props.updateContactForm(res.data);
                 this.setState({
                     contactClicked: true,
                     clickedObject: clickedObject[0]
                 })
                }).catch(err => {
                    this.setState({
                        error:true,
                        errorMessage: err.response.data || "Could not mark as read!"
                    })
                })
            } else{
                this.setState({
                    contactClicked: true,
                    clickedObject: clickedObject[0]
                }) 
            } 
        }

        else if (this.props.type === "user") {
            if (!clickedObject[0].answerRead) {
                const markAsReadPromise = userFeedbackRequest('mark as read', clickedObject[0]);
                markAsReadPromise.then(res => {
                 
                    this.props.updateContactForm(res.data);
                    this.setState({
                        contactClicked: true,
                        clickedObject: clickedObject[0]
                    }, () => {
                        this.props.needsUpdateFunction(true);
                    })
                }).catch(err => {
                    this.setState({
                        error: true,
                        errorMessage: err.response.data || "Could not open complaint!"
                    })
                })
            } else {
                this.setState({
                    contactClicked: true,
                    clickedObject: clickedObject[0]
                })
            }
        }
    }

    render() {
        let contacts = [...this.props.user.contactForms];
        if (this.state.pageLoaded) {

            contacts.sort((a, b) => {
                let lastTimestamp1, lastTimestamp2;
                if (a.lastAnswer === "user") {
                    lastTimestamp1 = a.userQuestions[a.userQuestions.length - 1].timestamp;
                } else {
                    lastTimestamp1 = a.adminAnswers[a.adminAnswers.length - 1].timestamp;
                }

                if (b.lastAnswer === "user") {
                    lastTimestamp2 = b.userQuestions[b.userQuestions.length - 1].timestamp;
                } else {
                    lastTimestamp2 = b.adminAnswers[b.adminAnswers.length - 1].timestamp;
                }

                const aDate = new Date(lastTimestamp1);
                const bDate = new Date(lastTimestamp2);
                return bDate - aDate;
            })
      
            contacts = contacts.map((contact, index) => {
                let lengthUser, lengthAdmin, lastText;
                contact.userQuestions.length > 0 ? lengthUser = contact.userQuestions.length - 1 : lengthUser = 0;
                contact.adminAnswers.length > 0 ? lengthAdmin = contact.adminAnswers.length - 1 : lengthAdmin = 0;
                contact.lastAnswer === "user" ? lastText = contact.userQuestions[lengthUser].text : lastText = contact.adminAnswers[lengthAdmin].text
                return (
                    <div className="fx-basic contact-list fx-justify-around fx-align-center contact-item" key={`${contact.email}${index}`} >
                        <div className="contact-subject" onClick={e => this.openComplain(contact._id)}>{shortenWord(contact.subject, 3)}</div>
                        {this.props.type === "admin" ? <div className="contact-email">{contact.email ? contact.email : contact.user[0].email}</div> : null}
                        <div className={`${this.props.type === "admin" ? contact.openedByAdmin ? "normal" : "heavy-bold" : contact.answerRead ? "normal" : "heavy-bold"} contact-text`}>{shortenWord(lastText, 7)}</div>
                        {contact.resolved ? <div className="green contact-status">Answered</div> : contact.lastAnswer === "admin" ? <div className="yellow contact-status">On going</div> : <div className="red contact-status">Not answered</div>}
                    </div>
                )
            })
        }
        return (
            this.props.user.contactForms.length === 0 ? 
                <Fragment>
                    <EmptyProfile message="Your contact inbox is empty"/>
                </Fragment> : 
                <Fragment>
                    {this.state.pageLoaded ? this.state.contactClicked === false ?
                        <ListOfFeedbacks
                            contacts={contacts}
                            whoIsLogged={this.props.type}
                        /> :
                        <IndividualComplain
                            clickedObject={this.state.clickedObject}
                            handleAnswerSubmit={this.handleAnswerSubmit}
                            handleReturn={this.handleReturn}
                            handleResolved={this.handleResolved}
                            user={this.props.user}
                            whoIsLogged={this.props.type}
                        /> : null}
                </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        needsUpdateFunction(bool){
            dispatch({type:"appStates/needsUpdateFunction", payload:bool})
        },
        setAdminFeedbackData(forms){
            dispatch({type:"user/setAdminFeedbackData", payload: forms})
        },
        updateContactForm(contactForm) {
            dispatch({ type: "user/updateContactForm", payload: contactForm })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageFeedback);