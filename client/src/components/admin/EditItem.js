import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddEditForm from '../dumbComponents/addEditForm';
import {currentUrl} from '../dumbComponents/Mode';
import { uploadNewItemRequest } from '../axios/AdminRequests';


class EditItem extends Component {
        state = {
           item: {
            fullName: "",
            brand: "",
            cost: "",
            discount: false,
            discountType: "",
            rating: "",
            numberOfVotes: 50,
            availability: {
                "37": 0,
                "38": 0,
                "39": 0,
                "40": 0,
                "41": 0,
                "42": 0,
                "43": 0,
                "44": 0,
                "45": 0,
                "46": 0
            }
           },
           firstInputs : [
           {type: "text", name: "fullName", label: "Name of the item:"}, 
           {type: "number", name: "cost", label: "Price"},
           {name: "discount", label: "Is it on discount?"},
           {type: "text", name:"discountType", label: "What type of discount?"},
           {type: "number", name:"rating", label: "Rating"},
           {type: "number",name: "numberOfVotes", label: "Number of starting votes"}
           ],
           secondInputs :  [
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
            { name: "input_46", label: "46" }
        ],
           gotItems : false,
           error : false,
           errorMessage:"",
           editItemId: "",
           pageReady:false,
           success: false,
           successMessage:""
        }
    
   
    componentDidMount(){
        uploadNewItemRequest('remove-temp-files', {});
      if(this.props.items.length > 0){
        let item = [];
        for(let i = 0; i < this.props.items.length; i++){
            if(this.props.items[i]._id === this.props.match.params.id){
                    //Izbjegavanje Cannot assign to object
                    const newAvailability = {...this.props.items[i].availability};
                    item.availability = {...newAvailability};
                    item.brand = this.props.items[i].brand;
                    item.cost = this.props.items[i].cost;
                    item.discount = this.props.items[i].discount;
                    item.discountType = this.props.items[i].discountType;
                    item.fullName = this.props.items[i].fullName;
                    item.gender = this.props.items[i].gender;
                    const newImagePaths = [...this.props.items[i].imagePaths]                    
                    item.imagePaths = [...newImagePaths]
                    item.numberOfVotes = this.props.items[i].numberOfVotes;
                    item.rating = this.props.items[i].rating;
                    item._id = this.props.items[i]._id;
                   break;
            }
        }
        this.setState({
            gotItems:true,
            item,
            pageReady:true
        })
      }
    }

    componentDidUpdate(prevProps){
        if(this.props.items.length > 0 && !this.state.pageReady){
            let item = {};
            for(let i = 0; i < this.props.items.length; i++){
          
                if(this.props.items[i]._id === this.props.match.params.id){
                    //Izbjegavanje Cannot assign to object
                    const newAvailability = {...this.props.items[i].availability};
                    item.availability = {...newAvailability};
                    item.brand = this.props.items[i].brand;
                    item.cost = this.props.items[i].cost;
                    item.discount = this.props.items[i].discount;
                    item.discountType = this.props.items[i].discountType;
                    item.fullName = this.props.items[i].fullName;
                    item.gender = this.props.items[i].gender;
                    const newImagePaths = [...this.props.items[i].imagePaths]                    
                    item.imagePaths = [...newImagePaths]
                    item.numberOfVotes = this.props.items[i].numberOfVotes;
                    item.rating = this.props.items[i].rating;
                    item._id = this.props.items[i]._id;
                   break;
                }
            }
            this.setState({
                gotItems:true,
                item,
                pageReady:true
            })
        }
    }

    componentWillUnmount(){
        uploadNewItemRequest('remove-temp-files', {});
    }

    handleDiscount = (value) => {
        const newItem = { ...this.state.item };
        if (value === "true") {
            newItem.discount = true;
            this.setState({ item: newItem })
            document.getElementById("discountType").value = "";
        }
        else {
            newItem.discount = false;
            newItem.discountType = "";
            this.setState({ item: newItem })
            document.getElementById("discountType").value = "";
        }
    }

    handleChange(e){
        const newValue = {...this.state.item};
        if(e.target.id[0] !== "i" && e.target.id !== "discount"){
            if(e.target.type === "number"){
                
                if(e.target.value > 0) {
                 newValue[e.target.id] =  parseFloat(e.target.value);
                }
                else{
                 newValue[e.target.id] = 0;
                }
                 this.setState({
                    item : newValue
                 })
            }
            else{
    
                newValue[e.target.id] = e.target.value;
                this.setState({
                    item : newValue
                })
            }
        } else if(e.target.id === "discount"){
            let value = e.target.value;
            this.handleDiscount(value);
        }

        if(e.target.className === "availability"){

            let label = e.target.id.slice(e.target.id.length -2);
            label.toString();
            if(e.target.value > 0){
                
                newValue.availability[label] = parseFloat(e.target.value);
            }
            else{
                newValue.availability[label] = 0;
            }
            this.setState({item : newValue})
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

    handleSubmit = (e) => {
        e.preventDefault();
        let errorTrigger = false;
        let errorMessage = "";
        if (this.state.item.fullName === "") {
            errorTrigger = true;
            errorMessage = "Item needs to have a name!";
        }
        else if (this.state.item.brand === "") {
            errorTrigger = true;
            errorMessage = "Item needs to have a brand!";
        }

        else if (this.state.item.cost <= 0) {
            errorTrigger = true;
            errorMessage = "Cost must be larger than 0 !";
        }

        else if (this.state.item.discount && this.state.item.discount !== "no") {

          
            if (this.state.item.discountType === "")
            errorTrigger = true;
                errorMessage = "Discount type can't be empty!";
        }

        else if (this.state.item.rating <= 0) {
            errorTrigger = true;
            errorMessage = "Rating must be a number between 1 and 5!";
        }
        if(errorTrigger){
            return this.setState({
                error:true,
                errorMessage
            })
        }

     document.getElementById('edit-item-form').children[0].disabled = true;
 
        const objToSend = {
            item:{
                availability : this.state.item.availability,
                fullName:this.state.item.fullName,
                cost:this.state.item.cost,
                discount:this.state.item.discount,
                discountType:this.state.item.discountType,
                _id: this.state.item._id,
                rating:this.state.item.rating,
                numberOfVotes:this.state.item.numberOfVotes,
            },
            exts:[this.state.item.imagePaths]
       }

       const editItemPromise = uploadNewItemRequest("edit item",objToSend);
       editItemPromise.then(res => {
        this.props.updateSingleItem(res.data);
        this.setState({
            success:true, 
            successMessage:"Item changed successully!!"}, () => {
           setTimeout(() => {
            this.props.history.push(`/item/${res.data._id}`)
           },500)
        })
    }).catch(err => {
        document.getElementById('edit-item-form').children[0].disabled = false;
        this.setState({
            error:true,
            errorMessage:errorMessage || "Could not edit item!"
        })
    })
    }

    handleUploadClick = (number) => {
        document.getElementById(`upload-image-${number}`).click();
    }

    uploadFile = (e, number) => {
        if (e.target.files.length === 1) {
            if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg") {
                if (e.target.files[0].size < 3097152) {
                    const formData = new FormData();
                    formData.append('imageNumber', number)
                    formData.append('item-id', this.props.match.params.id);
                    formData.append('file', e.target.files[0]);
                    const uploadPicturePromise = uploadNewItemRequest("image-upload", formData);
                    uploadPicturePromise.then(res => {
                        const copyItem = {...this.state.item};
                        copyItem.imagePaths[number-1] = res.data.path;
                        this.setState({
                            item:copyItem
                        })
                    }).catch(err => {
                        console.log(err);
                        return this.setState({
                            error: true,
                            errorMessage: "Could not upload image!"
                        })
                    })
                }
            }
        }
    }

  render() {
    return (
        <div id="edit-item-container" className="fx-basic fx-justify-center">
            <div id="edit-item-holder" className="fx-basic fx-justify-center">
            {this.state.pageReady ?  <div className="fx-column fx-align-center add-edit-item-form">
                <p className="general-form-title">Edit item from the store:</p>
          <form id="edit-item-form"
                    onChange={event => this.handleChange(event)}
                    onSubmit={event => this.handleSubmit(event)}
                >
                    <fieldset className="fieldset">
                    <div className="fx-basic fx-wrap fx-justify-center">

                        <div className="edit-item-picture-container fx-basic fx-wrap">
                        <div className="fx-column fx-justify-between fx-align-center edit-item-picture-holder">
                            <img src={`${currentUrl}/${this.state.item.imagePaths[0]}`} alt={this.state.item.fullName}></img>
                        <span onClick={e => this.handleUploadClick(1)}>Change picture</span>
                        <input type="file" accept="image/x-png,image/jpg,image/jpeg" onChange={e => this.uploadFile(e, 1)} id="upload-image-1" className="display-none" />
                            </div>

                            <div className="fx-column fx-justify-between fx-align-center edit-item-picture-holder">
                           
                            <img src={`${currentUrl}/${this.state.item.imagePaths[1]}`} alt="shop item 1"></img>
                            <span onClick={e => this.handleUploadClick(2)}>Change picture</span>
                            <input type="file" accept="image/x-png,image/jpg,image/jpeg" onChange={e => this.uploadFile(e, 2)} id="upload-image-2" className="display-none" />
                            </div>
                            <div className="fx-column fx-justify-between fx-align-center edit-item-picture-holder">
                            <img src={`${currentUrl}/${this.state.item.imagePaths[2]}`} alt="shop item 2"></img>
                            <span onClick={e => this.handleUploadClick(3)}>Change picture</span>
                            <input type="file" accept="image/x-png,image/jpg,image/jpeg" onChange={e => this.uploadFile(e, 3)} id="upload-image-3" className="display-none" />
                            </div>

                            <div className="fx-column fx-justify-between fx-align-center edit-item-picture-holder">
                            <img src={`${currentUrl}/${this.state.item.imagePaths[3]}`} alt="shop item 3"></img>
                            <span onClick={e => this.handleUploadClick(4)}>Change picture</span>
                            <input type="file" accept="image/x-png,image/jpg,image/jpeg" onChange={e => this.uploadFile(e, 4)} id="upload-image-4" className="display-none" />
                            </div>

                            <div className="fx-column fx-justify-between fx-align-center edit-item-picture-holder">
                            <img src={`${currentUrl}/${this.state.item.imagePaths[4]}`} alt="shop item 4"></img>
                            <span onClick={e => this.handleUploadClick(5)}>Change picture</span>
                            <input type="file" accept="image/x-png,image/jpg,image/jpeg" onChange={e => this.uploadFile(e, 5)} id="upload-image-5" className="display-none" />
                            </div>
                        </div>
                    </div>

             

{this.state.gotItems ? 
<AddEditForm 
discount={this.handleDiscount} 
firstInputs={this.state.firstInputs} 
formError={this.state.error}
formErrorMessage={this.state.errorMessage}
gender={this.state.item.gender}
handleGender={this.handleGender} 
items={this.state.item} 
secondInputs={this.state.secondInputs}
type="edit"
/> : null}
<div className={`fx-basic fx-justify-center ${!this.state.success ? "visibility-none" : ""}`}><span className="auth-message auth-success">{this.state.success ? this.state.successMessage : "Basic message"}</span></div>

                    <div className="fx-basic fx-justify-around">
                        <button  form="edit-item-form" className="general-form-button confirmation-button">Confirm changes</button>
                    </div>
                    </fieldset>
                </form >
            </div> :  null}
            </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        items:state.shop.items,
        user:state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateSingleItem(item){
            dispatch({type:"shop/updateSingleItem", payload:item})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);