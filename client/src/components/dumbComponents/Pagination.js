import React from 'react';

  const Pagination = (props) => {
  let numberOfPages;
    numberOfPages = Math.ceil(props.itemsLength / 24) 
    let pagination = [];

  for(let i = 1; i <= numberOfPages; i++){
    pagination.push(
      <div onClick={props.handlePagination} className="pagination-number" key={i}>
          {i}
      </div>
  )
  }
      return (
          <div id="pagination-container">
{pagination.length === 1 ? null : pagination}
</div>
      );
  };
  
  export default Pagination;