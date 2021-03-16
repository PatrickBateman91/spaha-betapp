import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import NavigationBar from './components/Parts/Navigation/NavigationBar';
import Footer from './components/Parts/Footer/Footer';

import Home from './components/Pages/Home/Home';
import Shop from './components/Pages/Shop/Shop';
import SearchComponent from './components/Pages/Search/SearchComponent';
import MainProfile from './components/Pages/Profile/MainProfile';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import LogOutPage from './components/Auth/LogOutPage';
import Contact from './components/Pages/Contact/Contact';

import AdminDashboard from './components/Admin/Dashboard/Dashboard';
import EditItem from './components/Admin/AddEditItems/EditItem';
import SingleItemPage from './components/Pages/SingleItem/SingleItem';
import FinalizePurchase from './components/Pages/Purchase/FinalizePurchase';
import Page404 from './components/Pages/Page404/Page404';

import './assets/Sass/App.scss';

const App = (props) => {

  return (
    <BrowserRouter>
      <NavigationBar {...props} />

      <div className="main-container">
        <Switch>
          <Route exact path='/' render={(props) => <Home {...props} />} />
          <Route path = {'/shop/:id'} render={props => <Shop {...props} />} />

          <Route {...props} path='/sign-in' component={Login} />
          <Route {...props} path='/sign-up' component={SignUp} />
          <Route {...props} path='/log-out' component={LogOutPage} />

          <Route {...props} exact path='/admin-dashboard' component={AdminDashboard} />
          <Route {...props} path='/admin/edit-item/:id' component={EditItem} />

          <Route {...props} path='/profile/:id' component={MainProfile} />
          <Route path='/checkout/finalize-purchase' component={FinalizePurchase} />

          <Route path='/item/:id' render={(props) => <SingleItemPage {...props} />} />
          <Route path='/search/:keywords' render={(props) => <SearchComponent {...props} />} />

          <Route path='/contact-us' render={props => <Contact {...props} />} />
          <Route path='/' component={Page404} />
        </Switch>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
