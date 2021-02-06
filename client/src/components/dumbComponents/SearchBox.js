import React from 'react';

const SearchBox = (props) => {

        return (
            <li className="search-box">
            <form className="fx-basic fx-center-all" onSubmit={e => props.handleSearch(e)} id="searchForm" name="searchForm">
                <input  type="text"></input>
                <button type="submit" form="searchForm" value="submit">Search</button>
            </form>
            </li>
        );
    
}

export default SearchBox;