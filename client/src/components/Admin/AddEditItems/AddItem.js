import React, { Component, Fragment } from 'react';
import { currentUrl } from '../../SharedComponents/Mode';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { uploadNewItemRequest } from '../../../services/axios/AdminRequests';
import AddEditForm from './Reusable/addEditForm';
import UploadFile from '../../SharedComponents/uploadFile';
import './styles.scss';

class AddItem extends Component {
    state = {
        addedItemId: "",
        item: {
            fullName: "",
            brand: "",
            cost: 0,
            discount: false,
            discountType: "",
            gender: "Men",
            rating: 0,
            numberOfVotes: 50,
            availability: {
                "25": 0,
                "26": 0,
                "27": 0,
                "28": 0,
                "29": 0,
                "30": 0,
                "31": 0,
                "32": 0,
                "33": 0,
                "34": 0,
                "35": 0,
                "36": 0,
                "37": 0,
                "38": 0,
                "39": 0,
                "40": 0,
                "41": 0,
                "42": 0,
                "43": 0,
                "44": 0,
                "45": 0,
                "46": 0,
            }
        },
        firstInputs: [
            { type: "text", name: "fullName", label: "Name of the item:" },
            { name: "gender", label: "Select gender" },
            { type: "text", name: "brand", label: "Brand" },
            { type: "number", name: "cost", label: "Price" },
            { name: "discount", label: "Is it on discount?" },
            { type: "text", name: "discountType", label: "What type of discount?" },
            { type: "number", name: "rating", label: "Rating" },
            { type: "number", name: "numberOfVotes", label: "Number of starting votes" }
        ],
        secondInputs: [
            { name: "input_25", label: "25" },
            { name: "input_26", label: "26" },
            { name: "input_27", label: "27" },
            { name: "input_28", label: "28" },
            { name: "input_29", label: "29" },
            { name: "input_30", label: "30" },
            { name: "input_31", label: "31" },
            { name: "input_32", label: "32" },
            { name: "input_33", label: "33" },
            { name: "input_34", label: "34" },
            { name: "input_35", label: "35" },
            { name: "input_36", label: "36" },
            { name: "input_37", label: "37" },
            { name: "input_38", label: "38" },
            { name: "input_39", label: "39" },
            { name: "input_40", label: "40" },
            { name: "input_41", label: "41" },
            { name: "input_42", label: "42" },
            { name: "input_43", label: "43" },
            { name: "input_44", label: "44" },
            { name: "input_45", label: "45" },
            { name: "input_46", label: "46" }],
        formSuccess: false,
        formError: false,
        formErrorMessage: "",
        formSuccessMessage: "",
        imgLink1: null,
        imgLink2: null,
        imgLink3: null,
        imgLink4: null,
        imgLink5: null
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // uploadNewItemRequest('remove-temp-files');
    }

    componentWillUnmount() {
        uploadNewItemRequest('remove-temp-files');
    }

    handleAfterFinish = (e) => {
        if (e.target.innerHTML === "Go to added item") {
            this.props.history.push(`/item/${this.state.addedItemId}`)
        } else if (e.target.innerHTML === "Add another item") {
            this.setState({
                item: {
                    fullName: "",
                    brand: "",
                    cost: 0,
                    discount: false,
                    discountType: "",
                    gender: "Men",
                    rating: 0,
                    numberOfVotes: 50,
                    availability: {
                        "25": 0,
                        "26": 0,
                        "27": 0,
                        "28": 0,
                        "29": 0,
                        "30": 0,
                        "31": 0,
                        "32": 0,
                        "33": 0,
                        "34": 0,
                        "35": 0,
                        "36": 0,
                        "37": 0,
                        "38": 0,
                        "39": 0,
                        "40": 0,
                        "41": 0,
                        "42": 0,
                        "43": 0,
                        "44": 0,
                        "45": 0,
                        "46": 0,
                    }
                },
                imgLink1: null,
                imgLink2: null,
                imgLink3: null,
                imgLink4: null,
                imgLink5: null,
                formSuccess: false,
                formSuccessMessage: "",
                addedItemId: ""
            })
        }
    }

    handleDiscount = (value) => {
        const newItem = { ...this.state.item };
        if (value === "true") {
            newItem.discount = true;
            this.setState({ item: newItem })
        }
        else {
            newItem.discount = false;
            newItem.discountType = "";
            this.setState({ item: newItem })
            document.getElementById("discountType").value = "";
        }
    }

    handleGender = (e) => {
        let elem = document.getElementById("gender");
        let value = elem.options[elem.selectedIndex].innerHTML;
        const newItem = { ...this.state.item };
        newItem.gender = value;
        this.setState({
            item: newItem
        })
    }

    handleChange = (e) => {
        if (e.target.id[0] !== "i" && e.target.id !== "discount") {
            const newValue = { ...this.state.item };
            if (e.target.type === "number") {
                let formError;
                let formErrorMessage;
                if (e.target.value > 0) {
                    newValue[e.target.id] = parseFloat(e.target.value);
                    formError = false;
                    formErrorMessage = "";
                }
                else {
                    newValue[e.target.id] = 0;
                    formError = true;
                    formErrorMessage = "Please enter a positive number!"
                }
                this.setState({
                    item: newValue,
                    formError: formError,
                    formErrorMessage: formErrorMessage
                })
            } else if (e.target.id === "gender") {
                this.handleGender();
            }
            else {
                newValue[e.target.id] = e.target.value;
                this.setState({
                    item: newValue,
                    formError: false,
                    formErrorMessage: ""
                })
            }

        } else if (e.target.id === "discount") {
            let value = e.target.value;
            this.handleDiscount(value);
        }

        if (e.target.className === "availability") {
            const newItem = { ...this.state.item };
            let formError;
            let formErrorMessage;
            let label = e.target.id.slice(e.target.id.length - 2);
            label.toString();
            if (e.target.value > 0) {
                newItem.availability[label] = parseFloat(e.target.value);
                formError = false;
                formErrorMessage = "";
            }
            else {
                newItem.availability[label] = 0;
                formError = true;
                formErrorMessage = "Please enter a positive number!"
            }
            this.setState({
                item: newItem,
                formError: formError,
                formErrorMessage: formErrorMessage
            })
        }
    }

    handleFileUpload = (e) => {
        if (e.target.files.length === 1) {
            if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg") {
                if (e.target.files[0].size < 3097152) {
                    let imageNumber = e.target.id[11];
                    let imageKey = `imgLink${imageNumber}`;
                    const formData = new FormData();
                    formData.append('imageNumber', imageNumber);
                    formData.append('file', e.target.files[0])
                    const uploadNewItemPromise = uploadNewItemRequest("image-upload", formData);
                    uploadNewItemPromise.then(res => {
                        if (this.state[imageKey] === null) {
                            this.setState({
                                [imageKey]: res.data.path
                            })
                        } else {
                            this.setState({
                                [imageKey]: res.data.path
                            })
                        }

                    }).catch(err => {
                        return this.setState({
                            error: true,
                            errorMessage: "Could not upload image!"
                        })
                    })
                }
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let formErrorMessage = "";
        let errorTrigger = false;
        if (this.state.item.fullName === "") {
            errorTrigger = true;
            formErrorMessage = "Item needs to have a name!";
        }
        else if (this.state.item.brand === "") {
            errorTrigger = true;
            formErrorMessage = "Item needs to have a brand!";
        }

        else if (this.state.item.cost <= 0) {
            errorTrigger = true;
            formErrorMessage = "Cost must be larger than 0 !";
        }

        else if (this.state.item.discount) {
            if (this.state.item.discountType === "")
                errorTrigger = true;
            formErrorMessage = "Discount type can't be empty!";
        }

        else if (this.state.item.rating <= 0) {
            errorTrigger = true;
            formErrorMessage = "Rating must be a number between 1 and 5!";
        }

        else if (this.state.imgLink1 === null ||
            this.state.imgLink2 === null ||
            this.state.imgLink3 === null ||
            this.state.imgLink4 === null ||
            this.state.imgLink5 === null) {
            errorTrigger = true;
            formErrorMessage = "Please upload all five images!"

        }

        const objToSend = {
            item: {
                availability: this.state.item.availability,
                fullName: this.state.item.fullName,
                brand: this.state.item.brand,
                cost: this.state.item.cost,
                discount: this.state.item.discount,
                discountType: this.state.item.discountType,
                gender: this.state.item.gender,
                rating: this.state.item.rating,
                numberOfVotes: this.state.item.numberOfVotes,
            },
            exts: [this.state.imgLink1, this.state.imgLink2, this.state.imgLink3, this.state.imgLink4, this.state.imgLink5]
        }

        if (!errorTrigger) {
            const uploadNewItemPromise = uploadNewItemRequest("add-new-item", objToSend);
            document.getElementById('add-new-item').children[0].disabled = "disabled";
            uploadNewItemPromise.then(res => {
                this.setState({
                    addedItemId: res.data._id,
                    formSuccess: true,
                    formSuccessMessage: "Item added!"
                }, () => {
                    window.scrollTo(0, 0);
                    this.props.addNewItem(res.data);
                })
            }).catch(err => {
                document.getElementById('add-new-item').children[0].disabled = false;
                this.setState({
                    formError: true,
                    formErrorMessage: "Could not add item at the moment!"
                })
            })
        }
        if (errorTrigger) {
            this.setState({
                formError: true,
                formErrorMessage: formErrorMessage
            })
        }
    }

    render() {
        return (
            <Fragment>
                {!this.state.formSuccess ?
                    <div className="add-edit-item-form">
                        <p className="general-form-title">Add item to the store:</p>

                        <form
                            id="add-new-item"
                            onChange={event => this.handleChange(event)}
                            onSubmit={event => this.handleSubmit(event)}
                            encType="multipart/form-data"
                        >
                            <fieldset className="fieldset">
                                <div className="fx-column fx-justify-between fx-align-center">

                                    <div className="fx-basic fx-justify-between fx-align-center add-item-image-holder">
                                        <span>Main image</span>
                                        <div className="fx-basic fx-align-center">
                                            <UploadFile handleFileUpload={this.handleFileUpload} number={1} />
                                            {this.state.imgLink1 ? <img src={currentUrl + "/" + this.state.imgLink1} key={this.state.imgLink1} alt="temp-1" /> : <div className="add-item-image-placeholder"></div>}
                                        </div>
                                    </div>


                                    <div className="fx-basic fx-justify-between fx-align-center add-item-image-holder">
                                        <span>Image number 2</span>
                                        <div className="fx-basic fx-align-center">
                                            <UploadFile handleFileUpload={this.handleFileUpload} number={2} />
                                            {this.state.imgLink2 ? <img src={currentUrl + "/" + this.state.imgLink2} key={this.state.imgLink2} alt="temp-2" /> : <div className="add-item-image-placeholder"></div>}
                                        </div>
                                    </div>


                                    <div className="fx-basic fx-justify-between fx-align-center add-item-image-holder">
                                        <span>Image number 3</span>
                                        <div className="fx-basic fx-align-center">
                                            <UploadFile handleFileUpload={this.handleFileUpload} number={3} />
                                            {this.state.imgLink3 ? <img src={currentUrl + "/" + this.state.imgLink3} key={this.state.imgLink3} alt="temp-3" /> : <div className="add-item-image-placeholder"></div>}
                                        </div>
                                    </div>
                                    <div className="fx-basic fx-justify-between fx-align-center add-item-image-holder">
                                        <span>Image number 4</span>
                                        <div className="fx-basic fx-align-center">
                                            <UploadFile handleFileUpload={this.handleFileUpload} number={4} />
                                            {this.state.imgLink4 ? <img src={currentUrl + "/" + this.state.imgLink4} key={this.state.imgLink4} alt="temp-4" /> : <div className="add-item-image-placeholder"></div>}
                                        </div>
                                    </div>
                                    <div className="fx-basic fx-justify-between fx-align-center add-item-image-holder">
                                        <span>Image number 5</span>
                                        <div className="fx-basic fx-align-center">
                                            <UploadFile handleFileUpload={this.handleFileUpload} number={5} />
                                            {this.state.imgLink5 ? <img src={currentUrl + "/" + this.state.imgLink5} key={this.state.imgLink5} alt="temp-5" /> : <div className="add-item-image-placeholder"></div>}
                                        </div>
                                    </div>
                                </div>
                                <AddEditForm
                                    firstInputs={this.state.firstInputs}
                                    formError={this.state.formError}
                                    formErrorMessage={this.state.formErrorMessage}
                                    gender={this.state.item.gender}
                                    handleGender={this.handleGender}
                                    items={this.state.item}
                                    secondInputs={this.state.secondInputs}
                                    type="add" />
                                <div className="fx-basic fx-justify-around">
                                    <button form="add-new-item" className="general-form-button confirmation-button">Add item</button>
                                </div>
                            </fieldset>
                        </form >
                    </div>
                    :
                    <div className="item-added-success-holder">
                        <div className="fx-basic fx-justify-center fx-align-center auth-message auth-success"><span>{this.state.formSuccessMessage}</span><FontAwesomeIcon icon={faCheck} /></div>
                        <div className="fx-column fx-align-center" onClick={this.handleAfterFinish}>
                            <div className="item-added-button">Go to added item</div>
                            <div className="item-added-button">Add another item</div>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addNewItem(item) {
            dispatch({ type: "shop/addNewItem", payload: item })
        }
    }
}

export default connect(null, mapDispatchToProps)(AddItem);