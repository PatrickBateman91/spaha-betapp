import React, { Component, Fragment } from 'react';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import { legendColor } from 'd3-svg-legend';
import {windowWidth} from '../dumbComponents/ReusableFunctions';

class Charts extends Component {
    state = {
        brands: ["All"],
        currentMonths: null,
        defaultChartsLoaded: false,
        genders: ["All", "Men", "Women", "Kids"],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        pageLoaded: false,
        selectedBrand: "All",
        selectedGender: "All",
        selectedMonth: null,
        selectedYear: 2020,
        statsData: {},
        years: [2017, 2018, 2019, 2020, 2021],
        yearIndex: 0,
        yearsData: []

    }

    componentDidMount() {
        window.scrollTo(0,0);
        if (this.props.chartsData.length > 0) {
            this.getCurrentData();
        }
    }

    componentDidUpdate() {
        if (this.props.chartsData.length > 0 && !this.state.pageLoaded) {
            this.getCurrentData();
        }
    }

    calculateItems = () => {
        let copyData = this.props.chartsData.filter(item => item.year === this.state.selectedYear);
        copyData = copyData[0].months;

        let allTimeStatsData = [];
        this.props.brands.forEach(brand => {
            allTimeStatsData.push({
                allTimeItemsSold: 0,
                allTimeMoneyEarned: 0,
                name: brand
            })
        })

        copyData.forEach((month, index) => {
            month.brands.forEach(brand => {
                allTimeStatsData.forEach(statItem => {
                    if (statItem.name === brand.type) {
                        statItem.allTimeItemsSold += brand.itemsSold;
                        statItem.allTimeMoneyEarned += brand.moneyEarned;
                    }
                })
            })
        })
        let newStateStatsData = { allTimeStatsData: allTimeStatsData };
        this.setState({ statsData: newStateStatsData }, () => {
            const isMobile = !windowWidth(480);
            let defaultWidth = 300;
            let defaultBox = "0 0 500 500";

            if(isMobile){
                defaultWidth = 300;
                defaultBox = "0 0 500 500"
            }

            this.createSVGs(this.state.statsData.allTimeStatsData, "allTimeItemsSold", "pairs sold", 6, "All time sold", 1, 'schemeSet1', false, "#charts-holder", defaultWidth, defaultWidth, defaultBox, "single-pie-chart", "single-pie-title");
            this.createSVGs(this.state.statsData.allTimeStatsData, "allTimeMoneyEarned", "$", 6, "All time earned", 2, 'schemeSet1', true, "#charts-holder",defaultWidth, defaultWidth, defaultBox, "single-pie-chart", "single-pie-title");
        })
    }

    changeMonth = (e) => {
        if (e.target.classList.contains("stats-select-item")) {
            let monthNames = [...this.state.monthNames];
            let newSelectedMonth;
            for (let i = 0; i < 12; i++) {
                if (monthNames[i] === e.target.innerHTML) {
                    newSelectedMonth = i;
                    break;
                }
            }
            document.getElementById('brand-month-chart-container').innerHTML = "";
            this.setState({
                selectedMonth: newSelectedMonth
            }, () => {
                this.getChartMenuItems();
            })
        }

    }

    changeBrand = (e) => {
        if (e.target.classList.contains("brand-stat-item")) {
            let brands = [...this.state.brands];
            let newSelectedBrand;
            for (let i = 0; i < brands.length; i++) {
                if (brands[i] === e.target.innerHTML) {
                    newSelectedBrand = e.target.innerHTML;
                    break;
                }
            }
            document.getElementById('brand-month-chart-container').innerHTML = "";
            this.setState({
                selectedBrand: newSelectedBrand
            }, () => {
                this.getChartMenuItems();
            })
        }
    }

    changeGender = (e) => {
        if (e.target.classList.contains("gender-stat-item")) {
            document.getElementById('brand-month-chart-container').innerHTML = "";
            this.setState({
                selectedGender: e.target.innerHTML
            }, () => {
                this.getChartMenuItems();
            })
        }
    }

    changeYear = (e) => {
        if (e.target.classList.contains("stats-select-item")) {
            document.getElementById('brand-month-chart-container').innerHTML = "";
            let selectedMonth = this.state.selectedMonth;
            if (parseInt(e.target.innerHTML) === new Date().getFullYear()) {
                selectedMonth = new Date().getMonth();
            }

            this.setState({
                selectedMonth,
                selectedYear: parseInt(e.target.innerHTML)
            }, () => {
                this.getChartMenuItems();
            })
        }
    }

    createSVGs = (whichStat = [], whichData, tipPart, innerR, titleText, chartOrder, colorScheme, last, id, dimsWidth, dimsHeight, viewBoxSettings, pieClass, titleClass) => {
        const handleMouseOut = (d, i, n) => {
            d3.select(n[i])
                .attr('fill', colour(d.data.name));
        }

        const handleMouseOver = (d, i, n) => {
            return d3.select(n[i])
                .attr('fill', "white");
        }
        const tip = d3Tip()
            .attr('class', 'd3-tip linear-chart-tip')
            .html(d => `${Math.round(d.data[whichData])} ${tipPart}`);


        const dims = { height: dimsHeight, width: dimsWidth, radius: 150};
        const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) }

        const arcTweenEnter = (d) => {
            let i = d3.interpolate(d.endAngle, d.startAngle)

            return function (t) {
                d.startAngle = i(t);
                return arcPath(d);
            }
        };


        const svg = d3.select(id)
            .append('div')
            .attr('class', pieClass)
            .append('svg')
            .attr('overflow',"visible")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `${viewBoxSettings}`);
        const graph = svg.append('g')
            .attr('transform', `translate(${cent.x}, ${cent.y})`);

        const pie = d3.pie()
            .sort(null)
            .value(d => d[whichData])

        const arcPath = d3.arc()
            .outerRadius(dims.radius)
            .innerRadius(dims.radius / innerR);


        const colour = d3.scaleOrdinal(d3[colorScheme]);

        let legendGroup = svg.append('g')
            .attr('transform', `translate(${dims.width + 60}, 40)`);


        const legend = legendColor()
            .shape('circle')
            .scale(colour);

        const paths = graph.selectAll('path')
            .data(pie(whichStat));


        paths.enter()
            .append('path')
            .attr('class', 'arc')
            .attr('d', arcPath)
            .attr('stroke', "#fff")
            .attr('stroke-width', 2)
            .attr('fill', d => colour(d.data.name))
            .transition().duration(750)
            .attrTween('d', arcTweenEnter);

        legendGroup.call(legend)
        legendGroup.selectAll('text').attr('fill', 'white');


        graph.selectAll('path')
            .on('mouseover', (d, i, n) => {
                tip.show(d, n[i])
                handleMouseOver(d, i, n);
            })
            .on('mouseout', (d, i, n) => {
                tip.hide();
                handleMouseOut(d, i, n)
            });
        graph.call(tip);

        if (id !== "#brand-month-chart-container") {
            const newDiv = document.createElement("DIV");
            newDiv.innerHTML = titleText;
            newDiv.className = titleClass;
            document.querySelector(id).childNodes[chartOrder + 1].appendChild(newDiv);
        }
        else {
            const newDiv = document.createElement("DIV");
            newDiv.innerHTML = titleText;
            newDiv.className = titleClass;
            document.querySelector(id).childNodes[chartOrder].appendChild(newDiv);
        }
        if (last) {
            this.getChartMenuItems();
        }
    }

    getCurrentData = () => {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let selectedYear = currentDate.getFullYear();
        let monthsThisYear = [];
        for (let i = 0; i <= currentMonth; i++) {
            monthsThisYear.push(i);
        }
        let newBrands = ["All", ...this.props.brands]

        this.setState({
            brands: newBrands,
            currentMonths: monthsThisYear,
            selectedYear,
            selectedMonth: currentMonth,
            pageLoaded: true
        }, () => {
            //Pozvati funkcije
            this.linearBars("chart-one", "totalItemsSold", "orange", "white", "Sold", "red", "pairs sold", "Total items sold by month", -1);
            this.linearBars("chart-two", "totalEarned", "red", "white", "$", "orange", "$", "Total earned by month", 0);
            this.calculateItems();
        })

    }

    getChartMenuItems() {
        let yearsMenu, monthsMenu, brandsMenu, genderMenu;

        if (this.state.selectedYear !== new Date().getFullYear()) {
            monthsMenu = this.state.monthNames.map((month, idx) => {
                return (
                    <div key={month} className={`${"stats-select-item"} ${this.state.selectedMonth === idx ? "selected-stat-item" : ""}`} >
                        {month}
                    </div>
                )
            })
        } else {
            monthsMenu = this.state.currentMonths.map(month => {
                return (
                    <div key={month} className={`${"stats-select-item"} ${this.state.selectedMonth === month ? "selected-stat-item" : ""}`}>
                        {this.state.monthNames[month]}
                    </div>
                )
            })
        }


        brandsMenu = this.state.brands.map(brand => {
            return (
                <div key={brand} className={`${"brand-stat-item"} ${this.state.selectedBrand === brand ? "selected-stat-item" : ""}`}>
                    {brand}
                </div>
            )
        })

        yearsMenu = this.state.years.map(year => {
            if (new Date().getFullYear() >= year) {
                return (
                    <div key={year} className={`${"stats-select-item"} ${this.state.selectedYear === year ? "selected-stat-item" : ""}`}>
                        {year}
                    </div>
                )
            } else return false;

        })

        genderMenu = this.state.genders.map(gender => {
            return (
                <div key={gender} className={`${"gender-stat-item"} ${this.state.selectedGender === gender ? "selected-stat-item" : ""}`}>
                    {gender}
                </div>
            )
        })


        this.setState({
            defaultChartsLoaded: true,
            brandsMenuToRender: brandsMenu,
            genderMenuToRender: genderMenu,
            monthsMenuToRender: monthsMenu,
            yearsMenuToRender: yearsMenu
        }, () => {
            this.getOtherCharts(this.state.selectedMonth, this.state.selectedBrand, this.state.selectedGender)
        })
    }

    getOtherCharts = (month, brand, gender) => {

        let selectedData = [];
        this.props.brands.forEach(brand => {
            selectedData.push({
                sold: 0,
                earned: 0,
                name: brand
            })
        })


        let selectedYear = this.props.chartsData.filter(item => item.year === this.state.selectedYear);
        let selectedMonth = selectedYear[0].months[month];

        if (brand === "All") {
            if (gender === "All") {
                selectedMonth.brands.forEach((oneBrand, brandIndex) => {
                    selectedData[brandIndex].sold += oneBrand.itemsSold;
                    selectedData[brandIndex].earned += oneBrand.moneyEarned;
                })
            } else {
                selectedMonth.brands.forEach((oneBrand, brandIndex) => {
                    oneBrand.individualItems.forEach(item => {
                        if (item.gender === gender) {
                            selectedData[brandIndex].sold += item.sold;
                            selectedData[brandIndex].earned += item.earned;
                        }
                    })
                })
            }

            const isMobile = !windowWidth(480);
            let defaultWidth = 300;
            let defaultBox = "0 0 500 500";

            if(isMobile){
                defaultWidth = 300;
                defaultBox = "0 0 600 600"
            }

            this.createSVGs(selectedData, "sold", "pairs sold", 4, `${this.state.monthNames[month]}, ${this.state.selectedYear} - ${gender === "All" ? "" : gender} total sold`, 0, 'schemeCategory10', false, "#brand-month-chart-container", defaultWidth, defaultWidth, defaultBox, "single-pie-chart", "single-pie-title");
            this.createSVGs(selectedData, "earned", "$", 4, `${this.state.monthNames[month]}, ${this.state.selectedYear} - ${gender === "All" ? "" : gender} total earned`, 1, 'schemeCategory10', false, "#brand-month-chart-container", defaultWidth, defaultWidth, defaultBox, "single-pie-chart", "single-pie-title");
        }
        else {
            let selectedBrand;
            if (gender === "All") {

                selectedMonth.brands.forEach(oneBrand => {
                    if (oneBrand.type === brand) {
                        selectedBrand = oneBrand.individualItems;
                    }
                })
            } else {
                selectedMonth.brands.forEach(oneBrand => {
                    if (oneBrand.type === brand) {
                        selectedBrand = oneBrand.individualItems.filter(item => {
                            if (item.gender === gender) {
                                return true;
                            } else return false;
                        })
                    }
                })
            }

            const isMobile = !windowWidth(480);
            let defaultWidth = 300;
            let defaultBox = "0 0 450 450";

            if(isMobile){
                defaultWidth = 300;
                defaultBox = "0 0 600 600"
            }

            this.createSVGs(selectedBrand, "sold", "pairs sold", 2, `${this.state.monthNames[month]}, ${this.state.selectedYear} - ${brand} ${gender === "All" ? "" : gender} sold`, 0, "schemeDark2", false, "#brand-month-chart-container",defaultWidth,defaultWidth, defaultBox, "other-pie-chart", "other-pie-title")
            this.createSVGs(selectedBrand, "earned", "$", 2, `${this.state.monthNames[month]}, ${this.state.selectedYear} - ${brand} ${gender === "All" ? "" : gender} earned`, 1, "schemeDark2", false, "#brand-month-chart-container",defaultWidth,defaultWidth, defaultBox, "other-pie-chart", "other-pie-title")
        }

    }

    linearBars(divId, measure, mainColor, secondaryColor, tickValue, changeColor, tipPart, titleText, chartOrder) {
        const newChart = document.createElement("DIV");
        newChart.id = divId;
        document.getElementById("charts-holder").appendChild(newChart);

        const isMobile = !windowWidth(480);
            let chartWidth = 400;
            let chartHeight = 400
            let viewBoxSettings = "0 0 400 400";

            if(isMobile){
                chartWidth = 250;
                chartHeight = 250;
            }

            if(window.screen.width > 468 && window.screen.width < 1150){
                chartWidth = 300;
                chartHeight = 300;
            }

        const svgChartOne = d3.select(`#${divId}`)
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `${viewBoxSettings}`);

        const handleMouseOut = (d, i, n) => {
            return d3.select(n[i])
                .attr('fill', mainColor);
        }

        const handleMouseOver = (d, i, n) => {
            return d3.select((n[i]))
                .attr('fill', changeColor);
        }

        const tip = d3Tip()
            .attr('class', 'd3-tip linear-chart-tip')
            .html(d => `${d[measure]} ${tipPart}`);

  

        let margin = { top: 20, right: 10, bottom: 50, left: 70 };
          
        const graphWidth = chartWidth - margin.left - margin.right;
        const graphHeight = chartHeight - margin.top - margin.bottom;

        const graphChartOne = svgChartOne.append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xAxisGroup = graphChartOne.append('g')
            .attr('transform', `translate(0,${graphHeight})`)
        const yAxisGroup = graphChartOne.append('g');

        let data = this.props.chartsData.filter(item => item.year === this.state.selectedYear);
        data = data[0].months;
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[measure])])
            .range([graphHeight, 0]);

        const x = d3.scaleBand()
            .domain(data.map(item => item.name))
            .range([0, 300])
            .paddingInner(0.2)
            .paddingOuter(0.2);

        const rects = graphChartOne.selectAll('rect').data(data);

        rects.attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d[measure]))
            .attr('fill', mainColor)
            .attr('x', d => x(d.name)
            )
            .attr('y', d => y(d[measure]));

        rects.enter()
            .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d[measure]))
            .attr('fill', mainColor)
            .attr('x', d => x(d.name))
            .attr('y', d => y(d[measure]))
            .on('mouseover', (d, i, n) => {
                tip.show(d, n[i]);
                handleMouseOver(d, i, n);
            })
            .on('mouseout', (d, i, n) => {
                tip.hide(d, n[i]);
                handleMouseOut(d, i, n)
            });

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .ticks(4)
            .tickFormat(d => `${d} ${tickValue}`);

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        xAxisGroup.selectAll('text')
            .attr('transform', "rotate(-40)")
            .attr('text-anchor', 'end')
            .attr('fill', secondaryColor);
        graphChartOne.call(tip);

        const newDiv = document.createElement("DIV");
        newDiv.innerHTML = titleText;
        newDiv.className = "single-pie-title";
        document.getElementById('charts-holder').childNodes[chartOrder + 1].appendChild(newDiv);

    }

    render() {

        return (
            <Fragment>
                <div id="charts-holder">

                </div>
                <div id="other-charts-holder">
                    <div className="stats-select-container" onClick={this.changeYear}>
                        {this.state.defaultChartsLoaded ? this.state.yearsMenuToRender : null}
                    </div>
                    <div className="stats-select-container" onClick={this.changeMonth}>
                        {this.state.defaultChartsLoaded ? this.state.monthsMenuToRender : null}
                    </div>
                    <div className="stats-select-container" onClick={this.changeGender}>
                        {this.state.defaultChartsLoaded ? this.state.genderMenuToRender : null}
                    </div>
                    <div className="stats-select-container" onClick={this.changeBrand}>
                        {this.state.defaultChartsLoaded ? this.state.brandsMenuToRender : null}
                    </div>
                    <div id="brand-month-chart-container">
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Charts;