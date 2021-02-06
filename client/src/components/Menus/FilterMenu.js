import React from 'react'
import '../../App.css';

const FilterMenu = (props) => {
    const filtersToGenerate = [
        {
            type: "radio",
            filterName: "price",
            menuLabel: "Filter by price",
            values: ["-25$", "25-50$", "50-75$", "75-99$", "100-150$", "150+$", "All prices"]
        },
        {
            type: "radio",
            filterName: "gender",
            menuLabel: "Filter by gender",
            values: ["Men", "Women", "Kids", "All"]
        },
        {
            type: "checkbox",
            filterName: "brand",
            menuLabel: "Filter by brand",
            values: props.brands
        },
        {
            type: "checkbox",
            filterName: "size",
            menuLabel: "Check size",
            values: ["25","26","27","28","29", "30", "31","32","33", "34", "35","36","37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]
        },
        {
            type: "checkbox",
            filterName: "discount",
            menuLabel: "Items on discount",
            values: ["Discount"]
        }
    ];

    const filterList = filtersToGenerate.map(item => {
        return (
            <section className={item.filterName === "size" ? "fx-basic fx-wrap fx-justify-between sizes-menu-section" : "filter-menu-section"} key={item.filterName}>
                <p>{item.menuLabel}</p>
                {item.values.map((filter) => {
                    return (
                        <div className={item.filterName === "size" ? "sizes-menu-box fx-basic fx-justify-center" : "filter-menu-box fx-basic fx-justify-between"} key={filter}>

                            <div>
                                <label id={`label-${item.filterName}-${filter}`} htmlFor={`${item.filterName}-${filter}`}>{filter}</label>
                            </div>

                            <div className="filter-input">
                                <input name={`${item.filterName}`} id={`${item.filterName}-${filter}`} type={item.type} value={filter} onClick={e => props.handleFilter(e, item.filterName, filter)} />
                            </div>
                        </div>
                    )
                })}
            </section>
        )
    })

    return (
        <div id="filter-menu" className={`${props.classMobile ? props.classMobile : "fixed-container"}`}>
            <div id={props.id} className={`fx-basic fx-wrap`} >
                {filterList}
            </div>
        </div>
    )



}

export default FilterMenu;