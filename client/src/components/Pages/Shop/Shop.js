import React, { Component } from 'react';
import {addToCartRequest, newRatingRequest, signInRequest} from '../../../services/axios/UserRequests';
import {addToCartVANJSKA, checkCorrectMailFormat,filterFunction, passwordCheck, removeDuplicates, selectRating, sizeFunction, windowWidth  } from '../../SharedComponents/ReusableFunctions';
import { connect } from 'react-redux';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import FilterMenu from '../../Parts/Menus/FilterMenu';
import LoginModal from '../../Auth/LoginModal';
import Pagination from './Pagination';
import SecondarySort from '../../Parts/Menus/SecondarySort';
import ShoppingItem from '../../Parts/ShoppingItems/ShoppingItem';
import './styles.scss';

class Shop extends Component {

  state = {
      error: false,
      errorMessage: '',
      guestAction:{},
      isAddToCartClicked: false,
      itemToCart: null,
      items: [],
      modalOpen: false,
      mobileMenuOpen: false,
      shopLoaded:false,
      success:false,
      successMessage:""
  }

  addToCart = (size, amount) => {
    let returnedState = addToCartVANJSKA(size, amount, this.state.itemToCart)

    if (!returnedState.error) {
      const addToCartPromise = addToCartRequest("/", "add item to cart", returnedState.newItem);
      addToCartPromise.then(response => {
        this.props.userFunctions.updateCart(response.data)

        this.setState({
          isAddToCartClicked: false,
          success: true,
          successMessage: "Item added to the cart!"
        })
      }).catch(err => {
        this.setState({
          error: true,
          errorMessage: err.response.data || "Something went wrong!"
        })
      })
    }

    else {
      this.setState({
        error: true,
        errorMessage: returnedState.errorMessage
      })
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);

    if(this.props.appStates.appLoaded && !this.state.shopLoade){
      this.handleMount();
    }
    
    if(this.props.appStates.filteredReady){
   
      if(this.props.appStates.usingFilter){
      if(this.props.appStates.filters.brand.length !== 0){
        this.props.appStates.filters.brand.forEach(brand => {
          document.getElementById(`brand-${brand}`).checked = true;
        })
      }
      if(this.props.appStates.filters.size.length !== 0){
        this.props.appStates.filters.size.forEach(size => {
          document.getElementById(`size-${size}`).checked = true;
        })
      }
      }
     
      if(this.props.appStates.usingSort){
        if(this.props.appStates.sorts.price.length !== 0){
           document.getElementById(`price-${this.props.appStates.sorts.price[0]}`).checked = true;
        }
        if(this.props.appStates.sorts.discount === "Discount"){
         document.getElementById('discount-Discount').checked = true;

        }
        if(this.props.appStates.sorts.gender.length !== 0){
          document.getElementById(`gender-${this.props.appStates.sorts.gender[0]}`).checked = true;
        }
      }
     }
  }

  componentDidUpdate(prevProps) {
    if((this.props.appStates.appLoaded && !this.state.shopLoaded)){
      this.handleMount();
    }
    
    if (prevProps.appStates.needsUpdate === false && this.props.appStates.needsUpdate) {
      this.props.appStateFunctions.needsUpdateFunction(false);
      this.gettingFilteredData();
    }

    if (prevProps.location.pathname !== this.props.location.pathname){
      this.handleMount(true);
    }
  }

  closeSort = (e) => {
    if (this.props.appStates.secondarySortModal) {
      this.sortToggler();
    }

    if (this.state.isAddToCartClicked && (e.target.id === "home-container" || e.target.id === "home-holder"  || e.target.id === "filter-menu" || e.target.className.indexOf('home-shopping-container') !== -1)) {
      this.setState({
        isAddToCartClicked: false,
        mobileMenuOpen: false,
        itemToCartId: null,
        error: false,
        errorMessage: '',
      })
    }

    if (this.state.mobileMenuOpen) {
      this.setState({
        mobileMenuOpen: false
      })
    }
    
  }

  clearError = () => {
    this.setState({ error: false, errorMessage: "" })
  }

  gettingFilteredData() {
    let finalFiltered = [];

    // Filteri za brand i size
    if (this.props.appStates.usingFilter) {
      if (this.props.appStates.filters.brand.length !== 0) {
        finalFiltered = this.handleBrands();
      }
      if (this.props.appStates.filters.size.length !== 0) {
        finalFiltered = this.handleSize(this.props.shop.items, finalFiltered);
      }
    }

    //Filteri za price, discount i gender:
    if (this.props.appStates.usingSort) {
      if (this.props.appStates.sorts.price.length !== 0) {
        finalFiltered = this.handlePrice(this.props.shop.items, finalFiltered)
      }
      if (this.props.appStates.sorts.discount.length !== 0) {
        finalFiltered = this.handleDiscount(this.props.shop.items, finalFiltered);
      }
      if (this.props.appStates.sorts.gender.length !== 0) {
        finalFiltered = this.handleGender(this.props.shop.items, finalFiltered);
      }
    }

    else {
      finalFiltered.sort(function (a, b) {
        return b.numberOfVotes - a.numberOfVotes;
      });
    }

    if (!this.props.appStates.usingFilter && !this.props.appStates.usingSort) {
      finalFiltered = [...this.props.shop.items];
    }

    //Sekundarni sort
    if (this.props.appStates.usingSecondarySort) {
      if (this.props.appStates.usingSecondarySort !== 'cost') {
        finalFiltered.sort((a, b) => {
          return b[this.props.appStates.usingSecondarySort] - a[this.props.appStates.usingSecondarySort];
        });
      }

      else {
        if (this.props.appStates.costType === 1) {
          finalFiltered.sort((a, b) => {
            return b[this.props.appStates.usingSecondarySort] - a[this.props.appStates.usingSecondarySort];
          });
        }

        else {
          finalFiltered.sort((a, b) => {
            return a[this.props.appStates.usingSecondarySort] - b[this.props.appStates.usingSecondarySort];
          });
        }
      }
    }

    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(finalFiltered);
    this.props.appStateFunctions.setPage("1");
  }

  handleBrands() {
    let filtering = [...this.props.appStates.filters.brand];
    let newItems = [];

    filtering.forEach(item => {
      let results = filterFunction(this.props.shop.items, item);
      newItems.push(...results);
    })
   
    return newItems;
  }

  handleCredentials = (e) => {
    e.preventDefault();
    const email = document.getElementById('loginForm').elements[0].value;
    const password = document.getElementById('loginForm').elements[1].value;

    if (!checkCorrectMailFormat(email)) {
      return this.setState({
        error: true,
        errorMessage: "Email is not correctly formatted!",
        success: false
      })
    }

    if (!passwordCheck(password)) {
      return this.setState({
        error: true,
        errorMessage: "Password has to be between 6 and 16 characters long and include at least 1 digit!",
        success: false
      })
    }

    const signInPromise = signInRequest(email, password);
    document.getElementById('loginForm').elements[0].disabled = true;
    document.getElementById('loginForm').elements[1].disabled = true;

    signInPromise.then(userResponse => {
      this.props.userFunctions.updateUser(userResponse.data.user);
      this.props.appStateFunctions.needsUpdateFunction(true);
      this.setState({
        success: true,
        successMessage: "Logged in succesfully!"
      }, () => {
        if (this.state.guestAction.hasOwnProperty('type')) {
          if (this.state.guestAction.type === "buy") {
            const itemToCart = this.state.guestAction.payload;
            document.querySelector('body').style.overflowY = 'auto';
            setTimeout(() => {
              this.setState({
                guestAction: {},
                isAddToCartClicked: true,
                itemToCart,
                modalOpen: false
              })
            }, 800)
          } 
          
          else if (this.state.guestAction.type === "rating") {
            let newRating = {
              name: this.state.guestAction.payload.id,
              rating: this.state.guestAction.payload.value
            };

            const newRatingPromise = newRatingRequest("new rating", '/', newRating);
            newRatingPromise.then(response => {
              this.props.userFunctions.updateRatings(response.data.userRatings);
              this.props.shopFunctions.updateItemRating({
                id: newRating.name,
                rating: response.data.itemRating,
                numberOfVotes: response.data.numberOfVotes
              });
              this.props.appStateFunctions.needsUpdateFunction(true);
              document.querySelector('body').style.overflowY = 'auto';
              setTimeout(() => {
                this.setState({
                  guestAction: {},
                  modalOpen: false
                })
              }, 800)
            }).catch(err => {
              this.setState({
                error: true,
                errorMessage: err.response.data || "Something went wrong!"
              })
            })
          }
        } 
        
        else {
          document.querySelector('body').style.overflowY = 'auto';
          setTimeout(() => {
            this.setState({
              modalOpen: false
            })
          }, 800)
        }
      })
    }).catch(err => {
      document.getElementById('loginForm').elements[0].disabled = false;
      document.getElementById('loginForm').elements[1].disabled = false;
      return this.setState({
        error: true,
        errorMessage: err.response.data || "Could not login at the moment!"
      })
    })
  }

  handleDiscount(items, filteredItems) {
    let sortedItems;
    if (this.props.appStates.usingFilter || this.props.appStates.sorts.price.length > 0 || this.props.appStates.sorts.gender.length > 0) {
      sortedItems = filteredItems.filter(item => {
        return item.discount;
      })
    }
    else {
      sortedItems = items.filter(item => {
        return item.discount;
      })
    }
    return sortedItems;
  }

  handleGender = (items, filteredItems) => {
    let sortedItems;
    let gender = this.props.appStates.sorts.gender[0];
    if (this.props.appStates.usingFilter || this.props.appStates.sorts.price.length > 0 || this.props.appStates.sorts.discount.length > 0) {
      if(gender !== "all"){
        sortedItems = filteredItems.filter(item => {
          return item.gender.toLowerCase() === gender;
        })
      } else{
        sortedItems = [...filteredItems]
      }

    } else {
      if(gender !== "all"){
        sortedItems = items.filter(item => {
          return item.gender.toLowerCase() === gender;
        })
      } else{
        sortedItems = [...items]
      }
    }
    return sortedItems;
  }

  handleFilter = (e, filterType, filterId) => {
    if(e){
      e.stopPropagation();
    }

    if(this.props.match.params.id === "all"){
      let newFilters = {
        brand: [],
        size: []
      };
      let newSorts = {}
      //Izbjegavanje Object is not extensible errora
      this.props.appStates.filters.brand.forEach(brand => {
        newFilters.brand.push(brand);
      })

      this.props.appStates.filters.size.forEach(size => {
        newFilters.size.push(size);
      })

      newSorts.price = [...this.props.appStates.sorts.price];
      newSorts.discount = this.props.appStates.sorts.discount;
      newSorts.gender = [...this.props.appStates.sorts.gender];
      let newUsingFilter;
      let newUsingSort;

      //Dodavanje i brisanje filtera
      if (filterType === "brand" || filterType === "size") {
        if (newFilters[filterType].indexOf(filterId) === -1) {
          newFilters[filterType].push(filterId)
        }
        else {
          let index = newFilters[filterType].indexOf(filterId);
          newFilters[filterType].splice(index, 1);
        }
      }

      else if (filterType === "discount") {
        if (e.target.checked) {
          newSorts[filterType] = filterId;
        } else{
          newSorts[filterType] = ""
        }
      }

      else {
        newSorts[filterType] = [filterId];
      }

      if (newFilters.brand.length !== 0 || newFilters.size.length !== 0) {
        newUsingFilter = true;
      }
      else {
        newUsingFilter = false;
      }

      if (newSorts.discount.length !== 0 || newSorts.price.length !== 0 || newSorts.gender.length !== 0) {
        newUsingSort = true;
      }
      else {
        newUsingSort = false;
      }
      this.props.appStateFunctions.setFilters(newFilters);
      this.props.appStateFunctions.setSorts(newSorts);
      this.props.appStateFunctions.usingFilterFunction(newUsingFilter);
      this.props.appStateFunctions.usingSortFunction(newUsingSort);
      this.props.appStateFunctions.needsUpdateFunction(true);
    }

    else{
      this.props.history.push({
        pathname:"/shop/all",
        state:{
          filterType,
          filterId
        }
      })
    }
  }

  handleModal = (e,item) => {
    if(this.props.user !== "guest" && this.props.user.hasOwnProperty('_id')){
      if(this.state.isAddToCartClicked && e.target.className === "buy_button"){
        this.setState({
          error:false,
          itemToCart: item
        })
      } else{
        let isOpen = !this.state.isAddToCartClicked;
        this.setState({
           error:false,
            isAddToCartClicked: isOpen, 
            itemToCart: item});
      }
    }

    else{
      if (e.target.id === "cartModal") {
        document.querySelector('body').style.overflowY = 'auto';
        this.setState({  error:false, modalOpen: false });
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
          error:false, 
          guestAction,
          modalOpen: true
        }, () => {
         document.querySelectorAll('.modal-cart')[0].style.top = `${window.pageYOffset}px`;
         document.querySelector('body').style.overflowY = 'hidden';
        })
      }
    }
  }

  handleMobileMenu = (e, type) => {
   if(e.target.nodeName === "I"){
    if (type === "close") {
      this.setState({ mobileMenuOpen: false })
    }

    else {
      this.setState({ mobileMenuOpen: true })
    }
   }
  }

  handleMount = (reDirect) => {
    switch(this.props.match.params.id){
      case "top-rated":
        this.setTopRated();
        break;

      case "kids":
      case "men":
      case "women":
        this.setGenderLine(this.props.match.params.id);
        break;

      case "popular":
        this.setPopular();
        break;

      case "budget":
        this.setBudget();
        break;

      case "discounts":
        this.setDiscounts();
        break;
      
      case "new-arrivals":
        this.setNewArrivals();
        break;

      case "brand":
        this.setBrand(this.props.location.pathname)
        break;

      case "all":
        this.setBrowseAll(reDirect);
        break;

      
      default:
        this.props.history.push('/')
    }
    this.setState({
      shopLoaded:true
    })
  }

  handlePrice(items, filteredItems) {
    let firstParameter, secondParameter;
    let id = this.props.appStates.sorts.price[0];
    switch (id) {
      case "-25$":
        firstParameter = 1;
        secondParameter = 25;
        break;

      case "25-50$":
        firstParameter = 25;
        secondParameter = 50;
        break;

      case "50-75$":
        firstParameter = 50;
        secondParameter = 75;
        break;

      case "75-99$":
        firstParameter = 75;
        secondParameter = 99;
        break;

      case "100-150$":
        firstParameter = 100;
        secondParameter = 150;
        break;

      case "150+$":
        firstParameter = 150;
        secondParameter = 1000;
        break;
      default:
        firstParameter = 1;
        secondParameter = 10000;
        break;
    }
    let sortedByPrice;
    if (this.props.appStates.usingFilter) {
      sortedByPrice = filteredItems.filter(item => {
        let newCost = item.cost;
        if(item.discount){
          let discountAmount = 5;
          for(let i = 0; i < this.props.adminData.discounts.length; i++){
            if(this.props.adminData.discounts[i].name === item.discountType){
              discountAmount = this.props.adminData.discounts[i].amount;
              break;
            }
          }
          newCost = item.cost - (item.cost * discountAmount / 100);
        }
        return newCost >= firstParameter && newCost < secondParameter;
      })
    }
    else {
      sortedByPrice = items.filter(item => {
        let newCost = item.cost;
        if(item.discount){
          let discountAmount = 5;
          for(let i = 0; i < this.props.adminData.discounts.length; i++){
            if(this.props.adminData.discounts[i].name === item.discountType){
              discountAmount = this.props.adminData.discounts[i].amount;
              break;
            }
          }
          newCost = item.cost - (item.cost * discountAmount / 100);
        }
        return newCost >= firstParameter && newCost < secondParameter;
      })
    }
    return sortedByPrice;
  }

  handlePagination = (e) =>  {
    this.props.appStateFunctions.setPage(e.target.innerHTML);
      window.scrollTo(0, 0)

  }

  handleSecondarySort = (sort, costType) => {
    this.props.appStateFunctions.setSecondarySort(sort);
    this.props.appStateFunctions.setCostType(costType);
    this.props.appStateFunctions.needsUpdateFunction(true);
  }

  handleSize(items, filteredItems) {
    if (this.props.appStates.filters.brand.length !== 0) {
      let newItems = [];
      this.props.appStates.filters.size.forEach(item => {
        let sizeItems = sizeFunction(filteredItems, item);
        newItems.push(...sizeItems);
      })
      let filtered = removeDuplicates(newItems);
      return filtered;
    }
    else {
      let newItems = [];
      this.props.appStates.filters.size.forEach(item => {
        let sizeItems = sizeFunction(items, item);
        newItems.push(...sizeItems);
      })
      let filtered = removeDuplicates(newItems);
      return filtered;
    }
  }

  handleSort = (e) => {
    this.props.appStateFunctions.setSecondarySortModalText(e.target.innerText);
    switch (e.target.innerText) {
      case "Price (low to high)":
        this.sortToggler();
        this.handleSecondarySort('cost', 0)
        break;

      case "Rating":
        this.sortToggler();
        this.handleSecondarySort('rating')
        break;

      case "Number of reviews":
        this.sortToggler();
        this.handleSecondarySort('numberOfVotes')
        break;

      case "Price (high to low)":
        this.sortToggler();
        this.handleSecondarySort('cost', 1)
        break;

      default:
        return false;
    }
  }

  reDirect = (path) => {
    this.props.history.push(path);
  }

  setBudget = () => {
    let newSorts = {
      price:["25-50$"],
      discount:[],
      gender: []
    }
    document.getElementById('price-25-50$').checked = true;
    this.props.appStateFunctions.setSorts(newSorts);
    this.props.appStateFunctions.usingSortFunction(true);
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(this.props.shop.budgetItems);
    this.props.appStateFunctions.setPage("1");
  }

  setBrand = (pathname) => {
    let brand = pathname.replace('/shop/brand/',"");
    const brandItems = this.props.shop.items.filter(item => item.brand.toLowerCase() === brand.toLowerCase());
    let newFilters = {
      brand: [],
      size: []
    };

    document.getElementById(`brand-${brand.toLowerCase()}`).checked = true;
    this.props.appStateFunctions.setFilters(newFilters);
    this.props.appStateFunctions.usingFilterFunction(true);
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(brandItems);
    this.props.appStateFunctions.setPage("1");
  }

  setBrowseAll = (reDirect) => {
    if(reDirect){
      this.handleFilter(null, this.props.location.state.filterType, this.props.location.state.filterId)
    }
  }

  setDiscounts = () => {
    let newSorts = {
      price:[],
      discount:['discount'],
      gender: []
    }
    document.getElementById('discount-discount').checked = true;
    this.props.appStateFunctions.setSorts(newSorts);
    this.props.appStateFunctions.usingSortFunction(true);
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(this.props.shop.saleItems);
    this.props.appStateFunctions.setPage("1");
  }

  setGenderLine = (gender) => {
    let items = this.props.shop.items.filter(item => item.gender.toLowerCase() === gender.toLowerCase())
    document.getElementById(`gender-${gender}`).checked = true;

    let newSorts = {
      price : [],
      discount: [],
      gender : [gender]
    }
    this.props.appStateFunctions.setSorts(newSorts);
    this.props.appStateFunctions.usingSortFunction(true);
    this.props.shopFunctions.setFilteredItems(items);
    this.props.appStateFunctions.setPage("1");
    this.props.appStateFunctions.isFilteredReady(true);
  }

  setNewArrivals = () => {
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(this.props.shop.newArrivals);
    this.props.appStateFunctions.setPage("1");
  }

  setPopular = () => {
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(this.props.shop.popularItems);
    this.props.appStateFunctions.setPage("1");
  }

  setTopRated = () => {
    const topRatedItems = this.props.shop.items.filter(item => item.rating > 4.25);
    this.props.appStateFunctions.isFilteredReady(true);
    this.props.shopFunctions.setFilteredItems(topRatedItems);
    this.props.appStateFunctions.setPage("1");
  }

  sortToggler = () => {
    let newValue = !this.props.appStates.secondarySortModal;
    this.props.appStateFunctions.setSecondarySortModal(newValue);
  }

  render() {
    const items = this.props.appStates.appLoaded ?
      <ShoppingItem
        addToCart={this.addToCart}
        className="shopping-item sh-item-full"
        currentPage={this.props.appStates.page}
        discounts={this.props.adminData.discounts}
        error={this.state.error}
        errorMessage={this.state.errorMessage}
        handleModal={this.handleModal}
        itemToCart={this.state.itemToCart}
        items={this.props.appStates.filteredReady ? this.props.shop.filteredItems : this.props.shop.items}
        isAddToCartClicked={this.state.isAddToCartClicked}
        location="home"
        user={this.props.user ? this.props.user : "Guest"}
      /> :null

      const override = css`
      display: block;
      margin: 40vh auto;
      border-color: blue;
    `;

    return (
      <div onClick={this.closeSort} >
        <div className="fx-basic fx-wrap fx-justify-around" id="home-container">
          {windowWidth(480) ? null : <div id="mobile-side-menu" className="fx-basic fx-justify-between fx-align-center" onClick={e => this.handleMobileMenu(e, this.state.mobileMenuOpen ? "close" : "open")}>
            <i className="fas fa-bars"></i>
            <SecondarySort
            handleSort={this.handleSort}
            sortToggler={this.sortToggler}
            secondarySortModal={this.props.appStates.secondarySortModal}
            secondarySortModalText={this.props.appStates.secondarySortModalText}
          />
            {<FilterMenu
              brands={this.props.adminData.brands}
              classMobile={this.state.mobileMenuOpen ? "mobile-open" : "mobile-closed"}
              handleFilter={this.handleFilter}
              id="mobile-filter-container" />}
          </div>}

          {windowWidth(480) ?
            this.props.appStates.appLoaded ? <FilterMenu
              brands={this.props.adminData.brands}
              handleFilter={this.handleFilter}
              id="filter-menu-container" /> : null : null}

      <div className="fx-column fx-align-start home-shopping-container">
      {this.props.appStates.appLoaded &&  windowWidth(480) ? 
          <SecondarySort
            handleSort={this.handleSort}
            sortToggler={this.sortToggler}
            secondarySortModal={this.props.appStates.secondarySortModal}
            secondarySortModalText={this.props.appStates.secondarySortModalText}
          />
       : null}
      <div id="home-holder" className={`fx-basic fx-wrap relative ${this.props.appStates.filteredReady && this.props.shop.filteredItems.length === 0 ? "fx-center-all" : "fx-justify-start fx-align-start"}`}>
            {items}
            {this.props.appStates.filteredReady && this.props.shop.filteredItems.length === 0 ? <div className="auth-message auth-error">No items meet your match!</div>
              : null}
            {this.props.appStates.appLoaded ? null : <ClipLoader loading={true} css={override} size={150} />}
          </div>
      </div>
        </div>
        {this.state.modalOpen ? <LoginModal
          auth={false}
          buttonText="Log in"
          clearError={this.clearError}
          error={this.state.error}
          errorMessage={this.state.errorMessage}
          handleCredentials={this.handleCredentials}
          handleModal={this.handleModal}
          klasa="account_modal"
          success={this.state.success}
          successMessage={this.state.successMessage}
          text="Please login first"
          type="both"
          user="guest"
        /> : null}
        {this.props.appStates.appLoaded ? 
        <Pagination 
        handlePagination={this.handlePagination}
        itemsLength={this.props.appStates.filteredReady ? this.props.shop.filteredItems.length : this.props.shop.items.length}
         /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    adminData:{
      brands: state.admin.brands,
      discounts: state.admin.discounts
    },
    appStates: {
      appLoaded: state.appStates.appLoaded,
      costType: state.appStates.costType,
      filteredReady: state.appStates.filteredReady,
      filters: state.appStates.filters,
      needsUpdate: state.appStates.needsUpdate,
      page: state.appStates.page,
      secondarySortModal: state.appStates.secondarySortModal,
      secondarySortModalText: state.appStates.secondarySortModalText,
      sorts: state.appStates.sorts,
      usingSort: state.appStates.usingSort,
      usingSecondarySort: state.appStates.usingSecondarySort,
      usingFilter: state.appStates.usingFilter
    },
    shop: state.shop,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appStateFunctions: {
      isFilteredReady: (bool) => {
        dispatch({ type: "appStates/isFilteredReady", payload: bool })
      },
      needsUpdateFunction: (bool) => {
        dispatch({ type: "appStates/needsUpdateFunction", payload: bool })
      },
      setCostType: (costType) => {
        dispatch({ type: "appStates/setCostType", payload: costType })
      },
      setFilters: (filters) => {
        dispatch({ type: "appStates/setFilters", payload: filters })
      },
      setPage: (page) => {
        dispatch({ type: "appStates/setPage", payload: page })
      },
      setSorts: (sorts) => {
        dispatch({ type: "appStates/setSorts", payload: sorts })
      },
      setSecondarySort: (bool) => {
        dispatch({ type: "appStates/setSecondarySort", payload: bool })
      },
      setSecondarySortModal: (bool) => {
        dispatch({ type: "appStates/setSecondarySortModal", payload: bool })
      },
      setSecondarySortModalText: (text) => {
        dispatch({ type: "appStates/setSecondarySortModalText", payload: text })
      },
      usingFilterFunction: (bool) => {
        dispatch({ type: "appStates/usingFilter", payload: bool })
      },
      usingSortFunction: (bool) => {
        dispatch({ type: "appStates/usingSort", payload: bool })
      }
    },
    shopFunctions: {
      setFilteredItems: (filteredItems) => {
        dispatch({ type: "shop/setFilteredItems", payload: filteredItems })
      },
      updateItemRating(rating){
        dispatch({type: "shop/updateItemRating", payload: rating})
      }
    },
    userFunctions: {
      updateCart: (cart) => {
        dispatch({type:"user/updateCart", payload:cart})
      },
      updateRatings(data){
        dispatch({type:"user/updateRatings", payload: data})
    },
      updateUser: (user) => {
        dispatch({type:"user/updateUser", payload:user})
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop);