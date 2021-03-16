import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getAdminData, changeDiscountsRequest, deleteDiscountRequest, newDiscountRequest } from '../../../services/axios/AdminRequests';
import AddItem from '../AddEditItems/AddItem';
import Charts from '../Charts/Charts';
import DiscountAdmin from '../Discounts/Discounts';
import ManageFeedback from '../Feedback/ManageFeedback';
import SendNewsletter from '../Newsletter/Newsletter';
import './styles.scss';

class Dashboard extends Component {

  state = {
    chartsData: [],
    discountEdit: false,
    discountSelected: "",
    listItems: [
      { name: "purchasestatistics", shown: true, label: "Purchase statistics" },
      { name: "addnewitem", shown: false, label: "Add new item to store" },
      { name: "usercomments", shown: false, label: "Manage feedback" },
      { name: "adddiscounts", shown: false, label: "Manage discounts" },
      { name: "sendnewsletter", shown: false, label: "Send newsletter" }
    ],
    pageLoaded: false,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAdminData();
  }

  changeDiscounts = () => {
    const newDiscounts = [];
    let errorTrigger = false;
    for (let i = 0; i < this.props.discounts.length; i++) {
      if (this.props.discounts[i].name === this.state.discountSelected) {
        const newName = document.getElementById(`contact-name-${this.props.discounts[i].name}`).value;
        const newAmount = document.getElementById(`contact-amount-${this.props.discounts[i].amount}`).value;
        if (parseInt(newAmount) < 1 || newName === "") {
          errorTrigger = true;
          break;
        } else {
          const changedDiscount = {
            name: newName,
            amount: parseInt(newAmount),
            _id: this.props.discounts[i]._id
          }
          newDiscounts.push(changedDiscount);
        }

      } else {
        newDiscounts.push(this.props.discounts[i]);
      }
    }


    if (errorTrigger) {
      return this.setState({
        error: true,
        errorMessage: "Amount can't be blank!"
      })
    }

    const changeDiscountsPromise = changeDiscountsRequest('change discounts', newDiscounts);
    changeDiscountsPromise.then(res => {
      this.props.changeDiscounts(res.data);
      this.setState({
        discountEdit: false,
        discountSelected: ""
      })
    }).catch(err => {
      this.setState({
        error: true,
        errorMessage: err.response.data || "Could not change discounts!"
      })
    })
  }

  deleteDiscount = (name) => {
    const deleteDiscountPromise = deleteDiscountRequest('delete discount', name);
    deleteDiscountPromise.then(res => {
      this.props.deleteDiscount(name);
    }).catch(err => {
      this.setState({
        error: true,
        errorMessage: err.response.data || "Could not delete discount!"
      })
    })
  }

  getAdminData() {
    const getAdminDataPromise = getAdminData('get admin data');
    getAdminDataPromise.then(res => {
      let copyData = {
        brands: res.data.brands,
        emails: res.data.emails,
        discounts: res.data.discounts
      }
      this.props.setAdminData(copyData);
      this.setState({
        chartsData: res.data.stats,
        pageLoaded: true
      })
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/sign-in')
      } else {
        this.setState({
          error: true,
          errorMessage: err.response.data || "Could not get admin data!"
        })
      }
    })
  }

  handleEdit = (name) => {
    this.setState({
      discountEdit: true,
      discountSelected: name
    })
  }

  handleListChange(arg) {
    let copyList = [...this.state.listItems];
    copyList.forEach(item => {
      if (item.name === arg) {
        item.shown = true
      }
      else {
        item.shown = false;
      }
    })
    this.setState({ listItems: copyList });
  }

  submitNewDiscount = (e) => {
    e.preventDefault();

    let name = e.target.elements[0].value;
    let amount = parseInt(e.target.elements[1].value);

    if (name !== "" && amount && (typeof amount === "number")) {
      const newDiscountObject = { amount, name };
      const newDiscountPromise = newDiscountRequest('new discount', newDiscountObject)
      newDiscountPromise.then(res => {
        this.props.addNewDiscount(res.data);
        document.getElementById('add-new-discount').elements[0].value = "";
        document.getElementById('add-new-discount').elements[1].value = "";
        this.setState({
          discountEdit: false,
          discountSelected: ""
        })
      }).catch(err => {
        this.setState({
          error: true,
          errorMessage: err.response.data || "Could not add discount!"
        })
      })
    }
  }

  render() {
    const listToRender = this.state.listItems.map(item => {
      return (
        <li key={item.name} onClick={() => this.handleListChange(item.name)}>{item.label}</li>
      )
    })
    return (
      <Fragment>
        {this.state.pageLoaded ? <div id="admin-container" className="profile-container fx-basic fx-wrap fx-justify-around fx-align-start">
          <div className="profile-left fx-basic">
            <ul>
              {listToRender}
            </ul>
          </div>
          {this.state.pageLoaded ? <div className={`profile-right fx-basic ${this.state.listItems[1].shown ? "fx-justify-center" : this.state.listItems[4].shown ? "fx-align-center" : ""}`}>
            {this.state.listItems[0].shown ? <Charts brands={this.props.brands} chartsData={this.state.chartsData} itemsToQuery={this.props.items} /> : null}
            {this.state.listItems[1].shown ? <AddItem {...this.props} /> : null}
            {this.state.listItems[2].shown ? <ManageFeedback type="admin" /> : null}
            {this.state.listItems[3].shown ? <DiscountAdmin
              changeDiscounts={this.changeDiscounts}
              discounts={this.props.discounts}
              discountEdit={this.state.discountEdit}
              discountSelected={this.state.discountSelected}
              deleteDiscount={this.deleteDiscount}
              handleEdit={this.handleEdit}
              submitNewDiscount={this.submitNewDiscount} /> : null}
            {this.state.listItems[4].shown ? < SendNewsletter /> : null}
          </div> : null}


        </div> : null}
      </Fragment>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    brands: state.admin.brands,
    items: state.shop.items,
    discounts: state.admin.discounts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewDiscount(discount) {
      dispatch({ type: "admin/addNewDiscount", payload: discount })
    },
    changeDiscounts(discounts) {
      dispatch({ type: "admin/changeDiscounts", payload: discounts })
    },
    deleteDiscount(name) {
      dispatch({ type: "admin/deleteDiscount", payload: name })
    },
    setAdminData(data) {
      dispatch({ type: "admin/setAdminData", payload: data })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
