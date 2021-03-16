import React from 'react';
import { connect } from 'react-redux';
import AdsAndContact from './AdsandContact/AdsAndContact';
import BudgetandSale from './BudgetandSale/BudgetandSale';
import BrowseAll from './BrowseAll/BrowseAll';
import HisandHers from './HisandHers/HisandHers';
import KidsShoes from './KidsShoes/KidsShoes';
import NewArrivals from './Categories/NewArrivals/NewArrivals';
import Newsletter from './Newsletter/Newsletter';
import Popular from './Categories/Popular/Popular';
import RandomBrand from './Categories/RandomBrand/RandomBrand';
import Scroller from './Scroller/Scroller';
import Spinner from '../../SharedComponents/Spinner';
import TopRated from './TopRated/TopRated';
import './styles.scss';

const Home = (props) => {

  return (
    <div className="home-container fx-basic fx-justify-center">
      {props.appStates.appLoaded ?
        <div className="home-holder fx-column">
          <TopRated />
          <Scroller />
          <KidsShoes />
          <HisandHers />
          <Popular items={props.popularItems} />
          <BudgetandSale budgetItems={props.budgetItems} discounts={props.adminData.discounts} saleItems={props.saleItems} />
          <Newsletter />
          <NewArrivals items={props.newArrivals} />
          <RandomBrand brands={props.adminData.brands} items={props.items} />
          <BrowseAll />
          <AdsAndContact />
        </div>
        :
        <Spinner />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    adminData: {
      brands: state.admin.brands,
      discounts: state.admin.discounts
    },
    appStates: {
      appLoaded: state.appStates.appLoaded,
    },
    budgetItems: state.shop.budgetItems,
    items: state.shop.items,
    newArrivals: state.shop.newArrivals,
    popularItems: state.shop.popularItems,
    saleItems: state.shop.saleItems,
    user: state.user,
  }
}

export default connect(mapStateToProps, null)(Home);