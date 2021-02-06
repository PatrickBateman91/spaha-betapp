import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

import NavigationBar from './components/navigation/NavigationBar';
import Footer from './components/view/Footer';

import Home from './components/view/Home';
import SearchComponent from './components/view/SearchComponent';
import MainProfile from './components/profile/MainProfile';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import LogOutPage from './components/navigation/LogOutPage';
import Contact from './components/view/Contact';

import AdminDashboard from './components/admin/AdminDashboard';
import EditItem from './components/admin/EditItem';
import SingleItemPage from './components/view/SingleItemPage';
import FinalizePurchase from './components/Cart/FinalizePurchase';
import Page404 from './components/view/Page404';

import './App.scss';


class App extends Component {

  render() {
    return (
      
        <Fragment>
<BrowserRouter>
          <NavigationBar/>
         
          <div className="main-container">
          <Switch>
            <Route exact path='/' render={(props) => <Home {...props}/>} />
      
            <Route {...this.props} path='/sign-in' component={Login} />
            <Route {...this.props} path='/sign-up' component={SignUp} />
            <Route {...this.props} path='/log-out' component={LogOutPage} />

            <Route {...this.props} exact path='/admin-dashboard' component={AdminDashboard} />
            <Route {...this.props} path='/admin/edit-item/:id' component={EditItem}/>

            <Route {...this.props} path='/profile/:id' component={MainProfile}/>
            <Route path='/checkout/finalize-purchase' component={FinalizePurchase} />

            <Route path='/item/:id' render={(props) => <SingleItemPage {...props} />} />
            <Route path='/search/:keywords' render={(props) => <SearchComponent {...props}/> } />

            <Route path='/contact-us' render={props => <Contact {...props}  />} />
            <Route path='/' component={Page404} />
            </Switch>
          </div>
 
          <Footer />
          </BrowserRouter>
          </Fragment>
        
    );
  }
}

export default App;
