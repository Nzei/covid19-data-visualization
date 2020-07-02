let dataSet = [];
let countries = [];
let frenchData = {
    name: "France",
    countryCodeTwo: "FR",
    countryCodeThree: "FRA"
};
let surroundingCountries = [{name: "Switzerland", countryCodeTwo: "CH", countryCodeThree: "CHE"}, {name: "Italy", countryCodeTwo: "IT", countryCodeThree: "ITA"},
    {name: "Spain", countryCodeTwo: "ES", countryCodeThree: "ESP"}, {name: "Germany", countryCodeTwo: "DE", countryCodeThree: "DEU"}];

$(document).ready(function () {
    (async () => {
        var data = await d3.csv("data-for-countries-updated.csv");

        readCountryData(data);
    })();

});

function readCountryData(data) {
    data.forEach((countryRow) => {
        countries.push({
            Country: countryRow.country_name,
            Continent: countryRow.continent,
            Mass: countryRow.land_mass,
            Population: parseInt(countryRow.population_size),
            CountryShortCode: countryRow.country_short_code,
            CountryTwoShortCode: countryRow.country_two_short_code

        });
    });

    (async () => {
        var data = await d3.csv("owid-covid-data.csv");

        readData(data);
    })();
}

function readData(data) {

    dataSet = data;
    let mapData = {};
    let coronaData = {};
    countries.forEach((country) => {
        mapData[country.CountryTwoShortCode] = country.Population;

        data.forEach((row) => {
            if (country.CountryShortCode === row.iso_code) {
                country.totalCases = parseInt(row.total_cases);
                country.TotalDeaths = parseInt(row.total_deaths);
                country.date = row.date;
                let infectionRate = ((row.total_cases / country.Population) * 100);
                country.infectionRate = infectionRate.toLocaleString();
                let mortalityRate = ((row.total_deaths / row.total_cases) * 100);
                country.mortalityRate = mortalityRate.toLocaleString();
                country.newDeath = parseInt(row.new_deaths);
                country.newCases = parseInt(row.new_cases);
                country.threeShortCodes = row.iso_code;


            }
        });

        coronaData[country.CountryTwoShortCode] = country.totalCases;
    });

    plotMap(coronaData);
    fetchAllCases(data);
    fetchAllDeathCases(data);
    // fetchAssociateCountries(data);



}

function plotMap(dataSet) {
    $('#world-map').vectorMap({
        map: 'world_mill',
        series: {
            regions: [{
                values: dataSet,
                scale: ['#5a5a5a', '#d36363'],
                normalizeFunction: 'polynomial',
                legend: {
                    vertical: true,
                }
            }]
        },
        onRegionTipShow: function (e, el, code) {
            el.html(el.html() + " <br> Population: " + numberWithCommas(getPopulationFromShortCode(code)) + "<br> Total Cases: "
                + numberWithCommas(getTotalCaseFromShortCode(code)) + "<br> Total Deaths: " + numberWithCommas(getTotalDeathsFromShortCode(code)) + "<br> Date of presentation: "
                + getDateFromShortCode(code) + "<br> Infection Rate: " + getInfectionRateFromShortCode(code) +"%" + "<br> Mortality Rate: " + getMortalityRateFromShortCode(code) +"%"+
                "<br> New Cases: " + numberWithCommas(getNewCasesFromShortCode(code)) + "<br> New Deaths: "
                + numberWithCommas(getNewDeathsFromShortCode(code)));
        }
    });


}

function getTotalCaseFromShortCode(shortCode) {
    let totalCases = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            totalCases = row.totalCases;
        }
    });
    return totalCases;
}

function getContinentFromShortCode(shortCode) {
    let continent = "";

    countries.forEach((row) => {
        if (row.threeShortCodes === shortCode) {
            continent = row.Continent;
        }
    });
    return continent;
}

function getPopulationFromShortCode(shortCode) {
    let population = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            population = row.Population;
        }
    });
    return population;
}

function getTotalDeathsFromShortCode(shortCode) {
    let totalDeaths = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            totalDeaths = row.TotalDeaths;
        }
    });
    return totalDeaths;
}

function getDateFromShortCode(shortCode) {
    let date = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            date = row.date;
        }
    });
    return date;
}

function getInfectionRateFromShortCode(shortCode) {
    let infectionRate = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            infectionRate = row.infectionRate;
        }
    });
    return infectionRate;
}

function getMortalityRateFromShortCode(shortCode) {
    let mortalityRate = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            mortalityRate = row.mortalityRate;
        }
    });
    return mortalityRate;
}

function getNewDeathsFromShortCode(shortCode) {
    let newDeaths = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            newDeaths = row.newDeath;
        }
    });
    return newDeaths;
}

function getNewCasesFromShortCode(shortCode) {
    let newCases = 0;

    countries.forEach((row) => {
        if (row.CountryTwoShortCode === shortCode) {
            newCases = row.newCases;
        }
    });
    return newCases;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function  formatDate(date) {
    let type = "%Y-%m-%d";
    const formattedDate = d3.timeParse(type);
    return formattedDate(date);
}

function fetchEuropeanData(stringDate) {
    let noOfCases = 0;
    dataSet.forEach((row) => {
        if(getContinentFromShortCode(row.iso_code) == "EU" && row.date == stringDate) {
            noOfCases = noOfCases + parseInt(row.total_cases);
        }
    });
    return {label: formatDate(stringDate), value: noOfCases};
}

function fetchEuropeanDeathData(stringDate) {
    let noOfCases = 0;
    dataSet.forEach((row) => {
        if(getContinentFromShortCode(row.iso_code) == "EU" && row.date == stringDate) {
            noOfCases = noOfCases + parseInt(row.total_deaths);
        }
    });
    return {label: formatDate(stringDate), value: noOfCases};
}

function fetchWorldData(stringDate) {
    let noOfCases = 0;
    dataSet.forEach((row) => {
        if(row.date == stringDate && row.location == "World") {
            noOfCases = noOfCases + parseInt(row.total_cases);
        }
    });
    return {label: formatDate(stringDate) , value: noOfCases};
}

function fetchWorldDeathData(stringDate) {
    let noOfCases = 0;
    dataSet.forEach((row) => {
        if(row.date == stringDate && row.location == "World") {
            noOfCases = noOfCases + parseInt(row.total_deaths);
        }
    });
    return {label: formatDate(stringDate) , value: noOfCases};
}

function fetchAllCases(data) {
    let dateData = [];
    data.forEach((row) => {
        if (row.location == "France") {
            dateData.push({label: formatDate(row.date), value: parseInt(row.total_cases)});
        }
    });

    let associateSwitzerlandData = [];
    let associateSpainData = [];
    let associateItalyData = [];
    let associateGermanyData = [];
    let worldCases = [];
    let europeanCases = [];
    let everyDate = [];

    data.forEach((row) => {
        if (row.location == "Switzerland") {
            associateSwitzerlandData.push({label: formatDate(row.date), value: parseInt(row.total_cases)});
        }
        if (row.location == "Spain") {
            associateSpainData.push({label: formatDate(row.date), value: parseInt(row.total_cases)});
        }
        if (row.location == "Italy") {
            associateItalyData.push({label: formatDate(row.date), value: parseInt(row.total_cases)});
        }
        if (row.location == "Germany") {
            associateGermanyData.push({label: formatDate(row.date), value: parseInt(row.total_cases)});
        }
        if(!everyDate.includes(row.date)) {
            everyDate.push(row.date);
        }
    });

    everyDate.forEach((row) =>  {
        europeanCases.push(fetchEuropeanData(row));
        worldCases.push(fetchWorldData(row));
    });

    europeanCases.sort((a,b) => b.label - a.label);
    worldCases.sort((a,b) => b.label - a.label);



    const option2 = {
        format: "d",
        ylabel: "Quantity",
        title: "World vs Europe Infection Chart Rate"
    };


    drawLineChart2({
        data: worldCases,
        data2: europeanCases,
        selector: "#time-series-french-chart svg",
        option: option2
    });



    const option = {
        format: "d",
        ylabel: "Quantity",
        title: "Infection Rate Cumulative Chart"
    };


    drawLineChart({
        data: associateItalyData,
        data2: associateSwitzerlandData,
        data3: associateSpainData,
        data4: dateData,
        data5: associateGermanyData,
        selector: "#cumulative-french-chart svg",
        option: option
    });


    console.log(dateData);
}

function fetchAllDeathCases(data) {
    let dateData = [];
    data.forEach((row) => {
        if (row.location == "France") {
            dateData.push({label: formatDate(row.date), value: parseInt(row.total_deaths)});
        }
    });

    let associateSwitzerlandData = [];
    let associateSpainData = [];
    let associateItalyData = [];
    let associateGermanyData = [];
    let worldCases = [];
    let europeanCases = [];
    let everyDate = [];

    data.forEach((row) => {
        if (row.location == "Switzerland") {
            associateSwitzerlandData.push({label: formatDate(row.date), value: parseInt(row.total_deaths)});
        }
        if (row.location == "Spain") {
            associateSpainData.push({label: formatDate(row.date), value: parseInt(row.total_deaths)});
        }
        if (row.location == "Italy") {
            associateItalyData.push({label: formatDate(row.date), value: parseInt(row.total_deaths)});
        }
        if (row.location == "Germany") {
            associateGermanyData.push({label: formatDate(row.date), value: parseInt(row.total_deaths)});
        }
        if(!everyDate.includes(row.date)) {
            everyDate.push(row.date);
        }
    });

    everyDate.forEach((row) =>  {
        europeanCases.push(fetchEuropeanDeathData(row));
        worldCases.push(fetchWorldDeathData(row));
    });

    europeanCases.sort((a,b) => b.label - a.label);
    worldCases.sort((a,b) => b.label - a.label);



    const option2 = {
        format: "d",
        ylabel: "Quantity",
        title: "World vs Europe Death Rate Chart"
    };


    drawLineChart2({
        data: worldCases,
        data2: europeanCases,
        selector: "#death-rate-world-europe-chart svg",
        option: option2
    });



    const option = {
        format: "d",
        ylabel: "Quantity",
        title: "Death Rate Cumulative Chart"
    };


    drawLineChart({
        data: associateItalyData,
        data2: associateSwitzerlandData,
        data3: associateSpainData,
        data4: dateData,
        data5: associateGermanyData,
        selector: "#mortality-french-chart svg",
        option: option
    });


    console.log(dateData);
}

const drawLineChart = ({data, data2, data3, data4, data5, selector, option}) => {
    $(selector).html("");

    const margin = {top: 80, right: 20, bottom: 20, left: 60},
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;

    const svg = d3.select(selector).attr('viewBox', [0, 0, width, height]);

    const line = d3
        .line()
        .defined((d) => !isNaN(d.value))
        .x((d) => x(d.label))
        .y((d) => y(d.value));

    const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.label))
        .range([margin.left, width - margin.right]);
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
            d3
                .axisBottom(x)
                .ticks(width / 80)
                .tickSizeOuter(0)
        );
    const yAxis = (g) =>
        g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call((g) =>
                g
                    .select('.tick:last-of-type text')
                    .clone()
                    .attr('x', -20)
                    .attr('y', -20)
                    .attr('text-anchor', 'start')
                    .attr('font-weight', 'bold')
                    .attr('fill', 'currentColor')
                    .text(option.yLabel)
            );

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', "#9400D3")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('path')
        .datum(data2)
        .attr('fill', 'none')
        .attr('stroke', "#d31e2d")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('path')
        .datum(data3)
        .attr('fill', 'none')
        .attr('stroke', "#18d321")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('path')
        .datum(data4)
        .attr('fill', 'none')
        .attr('stroke', "#08100d")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('path')
        .datum(data5)
        .attr('fill', 'none')
        .attr('stroke', "#a0a118")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);
    svg
        .append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', margin.top / 4)
        .attr('text-anchor', 'middle')
        .text(option.title);
};

const drawLineChart2 = ({data, data2, selector, option}) => {
    $(selector).html("");

    const margin = {top: 80, right: 20, bottom: 20, left: 60},
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;

    const svg = d3.select(selector).attr('viewBox', [0, 0, width, height]);

    const line = d3
        .line()
        .defined((d) => !isNaN(d.value))
        .x((d) => x(d.label))
        .y((d) => y(d.value));

    const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.label))
        .range([margin.left, width - margin.right]);
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
            d3
                .axisBottom(x)
                .ticks(width / 80)
                .tickSizeOuter(0)
        );
    const yAxis = (g) =>
        g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call((g) =>
                g
                    .select('.tick:last-of-type text')
                    .clone()
                    .attr('x', -20)
                    .attr('y', -20)
                    .attr('text-anchor', 'start')
                    .attr('font-weight', 'bold')
                    .attr('fill', 'currentColor')
                    .text(option.yLabel)
            );

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', "#9400D3")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('path')
        .datum(data2)
        .attr('fill', 'none')
        .attr('stroke', "#d31e2d")
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    svg
        .append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', margin.top / 4)
        .attr('text-anchor', 'middle')
        .text(option.title);
};

