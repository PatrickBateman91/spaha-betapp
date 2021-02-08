import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { addToCartVANJSKA,checkCorrectMailFormat, passwordCheck, removeDuplicates, selectRating} from '../dumbComponents/ReusableFunctions';
import {addToCartRequest, newRatingRequest, signInRequest} from '../axios/UserRequests';
import ShoppingItem from './ShoppingItem';
import LoginModal from '../Auth/LoginModal';

class SearchComponent extends PureComponent {
   
        state={
            error: false,
            errorMessage:"",
            formError:false,
            formErrorMessage:'',
            guestAction:{},
            haveVoted : false,
            isAddToCartClicked:false,
            isEmpty: false,
            items: [],
            itemToCart:null,
            itemsReady: false,
            modalOpen:false,
            pageLoaded: false,
            searchItems: [],
            success:false,
            successMessage:""
        }
      
    

addToCart = (size, amount) => {
        let returnedState = addToCartVANJSKA(size, amount, this.state.itemToCart)
        if(!returnedState.error){
         const addToCartPromise =  addToCartRequest("/", "add item to cart", returnedState.newItem);
          addToCartPromise.then(response => {
            this.props.updateCart(response.data)
            this.setState({
              isAddToCartClicked:false,
              success:true,
              successMessage:"Item added to the cart!"
            })
          }).catch(err => {
            this.setState({
              error: true,
              errorMessage: err.response.data || "Something went wrong!"
            })
          })
         
        } else{
          this.setState({
            error: true,
            errorMessage: returnedState.errorMessage
          })
        }
}

componentDidMount(){
  window.scrollTo(0,0);
    if(this.props.items.length !== 0){
        this.setState({pageLoaded: true}, () => {
            this.updateSearch();
        })
    }
}

componentDidUpdate(prevProps){
 if(prevProps.match.params.keywords !== this.props.match.params.keywords || prevProps.items !== this.props.items){
    this.updateSearch();
 } else if(this.props.needsUpdate){
    this.props.needsUpdateFunction(false);
    this.updateSearch();
 }
}

componentWillUnmount(){
this.setState({pageLoaded:false})
}

clearError = () => {
    this.setState({formError: false, formErrorMessage: ""})
}

closeSort = (e) => {
  if(this.state.isAddToCartClicked){
    if(e.target.id === "search-holder"){
      this.setState({
        isAddToCartClicked:false
      })
    } 
  }
}

handleCredentials = (e) => {
    e.preventDefault();
    const email = document.getElementById('loginForm').elements[0].value;
    const password = document.getElementById('loginForm').elements[1].value;
    if(!checkCorrectMailFormat(email)){
       return this.setState({
            formError:true,
            formErrorMessage:"Email is not correctly formatted!",
            success:false
        })
    }
    if(!passwordCheck(password)){
        return this.setState({
            formError:true,
            formErrorMessage:"Password has to be between 6 and 16 characters long and include at least 1 digit!",
            success:false
        })
    }


    const signInPromise = signInRequest(email, password);
    document.getElementById('loginForm').elements[0].disabled = true;
    document.getElementById('loginForm').elements[1].disabled = true;
    signInPromise.then(userResponse => {
        this.props.updateUser(userResponse.data.user);
        this.props.needsUpdateFunction(true);
        this.setState({
            success:true,
            successMessage:"Logged in succesfully!"
        }, () => {
            if(this.state.guestAction.hasOwnProperty('type')){
                if(this.state.guestAction.type === "buy"){
                    const itemToCart = this.state.guestAction.payload;
                    document.querySelector('body').style.overflowY = 'auto';
                    setTimeout(() => {
                      this.setState({
                        guestAction:{},
                        isAddToCartClicked:true,
                        itemToCart,
                        modalOpen:false
                      })
                  }, 800)
                  }  else if(this.state.guestAction.type === "rating"){
                    let newRating = {
                      name : this.state.guestAction.payload.id,
                      rating: this.state.guestAction.payload.value
                  };
      
                  const newRatingPromise = newRatingRequest("new rating", '/', newRating);
                  newRatingPromise.then(response => {
                     this.props.updateRatings(response.data.userRatings);
                     this.props.updateItemRating({
                         id:newRating.name,
                         rating: response.data.itemRating, 
                         numberOfVotes : response.data.numberOfVotes});
                     this.props.needsUpdateFunction(true);
                     document.querySelector('body').style.overflowY = 'auto';
                     setTimeout(() => {
                      this.setState({
                        guestAction:{},
                        modalOpen:false
                      })
                  }, 800)
                  }).catch(err => {
                      this.setState({
                          error:true,
                          errorMessage:err.response.data || "Something went wrong!"
                      })
                  })
                  } else{
                    document.querySelector('body').style.overflowY = 'auto';
                    setTimeout(() => {
                      this.setState({
                        modalOpen:false
                      })
                  }, 800)
                  }
            }




            setTimeout(() => {
                this.setState({
                  modalOpen:false
                })
            }, 800)
            
        })
    }).catch(err => {
        document.getElementById('loginForm').elements[0].disabled = false;
        document.getElementById('loginForm').elements[1].disabled = false;
        return this.setState({
            formError:true,
            formErrorMessage:err.response.data || "Could not login at the moment!"
        })
    })
    
}

handleModal = (e,item) => {
  e.stopPropagation();
    if(this.props.user !== "guest" && this.props.user.hasOwnProperty('_id')){
      if(this.state.isAddToCartClicked && e.target.className === "buy_button"){
        this.setState({
          error:false,
          itemToCart: item
        })
      } else{
        let isOpen = !this.state.isAddToCartClicked;
        this.setState({ 
            isAddToCartClicked: isOpen, 
            itemToCart: item});
      }
    }
    else{
      if (e.target.id === "cartModal") {
        document.querySelector('body').style.overflowY = 'auto';
        this.setState({ modalOpen: false });
      }
      else if(e.target.className === 'buy_button' 
      || e.target.parentNode.className === 'rating'
      || e.target.className === 'far fa-heart'){
          let guestAction = {};
          if(e.target.parentNode.className === 'rating'){
            let value = selectRating(e.target.htmlFor);
            guestAction = {
              type:"rating",
              payload:{
                value,
                id:item
              }
            }
          } else if(e.target.className === 'buy_button'){
            guestAction = {
              type:"buy",
              payload:item
            }
          }




        this.setState({
            guestAction,
            modalOpen: true
        }, () => {
         document.querySelectorAll('.modal-cart')[0].style.top = `${window.pageYOffset}px`;
         document.querySelector('body').style.overflowY = 'hidden';
        })
      }
    }
}

updateSearch(){
    let searchParameter = this.props.match.params.keywords;
    let searchItems = [];
    let searchWords = searchParameter.split(" ");
      
        this.props.items.forEach(item => { 
            searchWords.forEach(search => {
                if(item.brand.toLowerCase().indexOf(search) !== -1){
                searchItems.push(item);
                }
                if(item.fullName.toLowerCase().indexOf(search) !== -1){
                searchItems.push(item);
                }
            })
        })
        let unique = removeDuplicates(searchItems);
        if(unique.length !== 0){
            this.setState({items: unique,itemsReady:true,isEmpty:false})
        }
        else{
            this.setState({items: unique, itemsReady:true, isEmpty:true})
        }

}

updateParentsRating = () => {
  this.updateSearch();
}

    render() {
        return (
            <div id="search-holder" className={`fx-basic fx-wrap fx-align-start ${this.state.isEmpty ? "fx-center-all" : "fx-justify-start"}`} onClick={this.closeSort}>
                {this.state.isEmpty ? <div className="auth-message auth-error">No items meet your match!</div> : null}
                {this.state.itemsReady ?
                    <ShoppingItem
                        addToCart={this.addToCart}
                        className="shopping-item sh-item-full"
                        discounts={this.props.discounts}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                        handleModal={this.handleModal}
                        itemToCart={this.state.itemToCart}
                        items={this.state.items}
                        isAddToCartClicked={this.state.isAddToCartClicked}
                        location="search"
                        updateParentsRating={this.updateParentsRating} 
                        user={this.props.user ? this.props.user : 'Guest'}
                       /> : <div className="spinner_container"><i className="fas fa-spinner"></i></div>}
                        {this.state.modalOpen ? 
                        <LoginModal 
                        auth={false}
                        buttonText="Log in"
                        clearError={this.clearError}
                        error={this.state.formError} 
                        errorMessage ={this.state.formErrorMessage} 
                        handleCredentials={this.handleCredentials}
                        handleModal={this.handleModal} 
                        klasa="account_modal" 
                        success={this.state.success}
                        successMessage={this.state.successMessage}   
                        text="Please login first"
                        type="both"
                        user="guest"
                         /> :null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        discounts:state.admin.discounts,
        items: state.shop.items,
        needsUpdate: state.appStates.needsUpdate,
        user:state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        needsUpdateFunction(bool){
            dispatch({type:"appStates/needsUpdateFunction", payload:bool})
        },
        updateCart(cart){
            dispatch({type:"user/updateCart", payload:cart})
        },
        updateItemRating(rating){
            dispatch({type:"shop/updateItemRating", payload:rating})
        },
        updateRatings(ratings){
            dispatch({type:"user/updateRatings", payload:ratings})
        },
        updateUser(user){
            dispatch({type:"user/updateUser", payload:user})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);