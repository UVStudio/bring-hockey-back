//console.log('FE js working');
const tbody = document.querySelector('tbody');

fetch('api/cdnData')
  .then((response) => {
    return response.json();
  })
  .then((rawData) => {
    //arrays for table calculations
    const incOverTotalArray = [];
    const incOverActiveArray = [];
    const rowDataArray = [];

    //arrays for chart(s)
    const dateChartArray = [];
    const sevenRATotalChartArray = [];
    const sevenRAActiveChartArray = [];
    const activeCasesBarArray = [];
    const deathsBarArray = [];
    const recoveredBarArray = [];
    const totalCasesBarArray = [];

    // calculate values for fields
    for (i = 0; i < rawData.length; i++) {
      //date
      const date = rawData[i].date;
      dateChartArray.push(date);

      //new cases
      let newCases;
      if (rawData[i].confirmed === 0) {
        newCases = 0;
      } else {
        newCases = rawData[i].confirmed - rawData[i - 1].confirmed;
      }

      //total cases
      const cases = rawData[i].confirmed;
      totalCasesBarArray.push(cases);

      //new deaths
      let newDeaths;
      if (rawData[i].deaths === 0) {
        newDeaths = 0;
      } else {
        newDeaths = rawData[i].deaths - rawData[i - 1].deaths;
      }

      //total deaths
      const deaths = rawData[i].deaths;
      deathsBarArray.push(deaths);

      //total recovered
      const recovered = rawData[i].recovered;
      recoveredBarArray.push(recovered);

      //active cases
      const activeCases = cases - deaths - recovered;
      activeCasesBarArray.push(activeCases);

      //% increase over total
      let incOverTotal;
      let incOverTotalPerc;
      if (rawData[i].confirmed === 0) {
        incOverTotalPerc = 0;
      } else {
        incOverTotal = ((newCases / rawData[i - 1].confirmed) * 100).toFixed(2);
        if (incOverTotal === 'Infinity') {
          incOverTotal = 100;
        }
        incOverTotalPerc = incOverTotal + '%';
      }

      //% increase over active
      let incOverActive;
      let incOverActivePerc;
      if (activeCases === 0) {
        incOverActivePerc = 0;
      } else {
        incOverActive = ((newCases / (activeCases - newCases)) * 100).toFixed(
          2
        );
        if (incOverActive === 'Infinity') {
          incOverActive = 100;
        }
        incOverActivePerc = incOverActive + '%';
      }

      //7 day rolling average over total cases
      //push all incOverTotalPerc in this array, then do the math
      let sevenRollingTotal;
      incOverTotalArray.push(parseFloat(incOverTotal));

      if (i < 7) {
        sevenRollingTotal = 'n/a';
      } else {
        sevenRollingTotalPreFix =
          (incOverTotalArray[i] +
            incOverTotalArray[i - 1] +
            incOverTotalArray[i - 2] +
            incOverTotalArray[i - 3] +
            incOverTotalArray[i - 4] +
            incOverTotalArray[i - 5] +
            incOverTotalArray[i - 6]) /
          7;
        sevenRollingTotal = sevenRollingTotalPreFix.toFixed(2) + '%';
      }
      if (sevenRollingTotal == 'NaN%') {
        sevenRollingTotal = 'n/a';
      }
      sevenRollingTotalNumber = parseFloat(sevenRollingTotal);
      sevenRATotalChartArray.push(sevenRollingTotalNumber);

      //7 day rolling average over active cases
      let sevenRollingActive;
      incOverActiveArray.push(parseFloat(incOverActive));

      if (i < 7) {
        sevenRollingActive = 'n/a';
      } else {
        sevenRollingActivePreFix =
          (incOverActiveArray[i] +
            incOverActiveArray[i - 1] +
            incOverActiveArray[i - 2] +
            incOverActiveArray[i - 3] +
            incOverActiveArray[i - 4] +
            incOverActiveArray[i - 5] +
            incOverActiveArray[i - 6]) /
          7;
        sevenRollingActive = sevenRollingActivePreFix.toFixed(2) + '%';
      }
      if (sevenRollingActive == 'NaN%') {
        sevenRollingActive = 'n/a';
      }
      sevenRollingActiveNumber = parseFloat(sevenRollingActive);
      sevenRAActiveChartArray.push(sevenRollingActiveNumber);

      //create row object for each date
      const dataObj = {
        date,
        activeCases,
        cases,
        newCases,
        incOverTotalPerc,
        incOverActivePerc,
        sevenRollingTotal,
        sevenRollingActive,
        newDeaths,
        deaths,
        recovered,
      };
      const rowData = Object.create(dataObj);
      rowData.date = date;
      rowData.cases = cases;
      rowData.activeCases = activeCases;
      rowData.newCases = newCases;
      rowData.incOverTotalPerc = incOverTotalPerc;
      rowData.incOverActivePerc = incOverActivePerc;
      rowData.sevenRollingTotal = sevenRollingTotal;
      rowData.sevenRollingActive = sevenRollingActive;
      rowData.newDeaths = newDeaths;
      rowData.deaths = deaths;
      rowData.recovered = recovered;

      rowDataArray.push(rowData);
    }

    const rowDataArrayReversed = rowDataArray.reverse();

    //create table and populate array rows and cells
    generateTable(tbody, rowDataArrayReversed);

    //crop out meaningless data at the beginning
    const cropAmount = 23;

    const dateChartArrayCropped = dateChartArray.splice(
      cropAmount,
      dateChartArray.length
    );

    const sevenRATotalChartArrayCropped = sevenRATotalChartArray.splice(
      cropAmount,
      sevenRATotalChartArray.length
    );
    const sevenRAActiveChartArrayCropped = sevenRAActiveChartArray.splice(
      cropAmount,
      sevenRAActiveChartArray.length
    );

    const deathsBarArrayCropped = deathsBarArray.splice(
      cropAmount,
      deathsBarArray.length
    );
    const recoveredBarArrayCropped = recoveredBarArray.splice(
      cropAmount,
      recoveredBarArray.length
    );
    const activeCasesBarArrayCropped = activeCasesBarArray.splice(
      cropAmount,
      activeCasesBarArray.length
    );
    const totalCasesBarArrayCropped = totalCasesBarArray.splice(
      cropAmount,
      totalCasesBarArray.length
    );

    //line chart building
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateChartArrayCropped,
        datasets: [
          {
            label: 'Total Cases',
            data: sevenRATotalChartArrayCropped,
            backgroundColor: ['rgba(255, 99, 132, 0)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
          {
            label: 'Active Cases',
            data: sevenRAActiveChartArrayCropped,
            backgroundColor: ['rgba(153, 102, 255, 0)'],
            borderColor: ['#316395'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    //bar chart building
    const ctxBar = document.getElementById('myChart-bar');
    const chart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: dateChartArrayCropped, // responsible for how many bars are gonna show on the chart
        // create 12 datasets, since we have 12 items
        // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
        // put 0, if there is no data for the particular bar
        datasets: [
          {
            label: 'Total Deaths',
            data: deathsBarArrayCropped,
            backgroundColor: '#22aa99',
          },
          {
            label: 'Total Recoveries',
            data: recoveredBarArrayCropped,
            backgroundColor: '#994499',
          },
          {
            label: 'Total Cases',
            data: totalCasesBarArrayCropped,
            backgroundColor: '#316395',
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'top', // place legend on the right side of chart
        },
        scales: {
          xAxes: [
            {
              stacked: true, // this should be set to make the bars stacked
            },
          ],
          yAxes: [
            {
              stacked: false, // this also..
            },
          ],
        },
      },
    });
  });

function generateTable(tbody, data) {
  for (let element of data) {
    let row = tbody.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}
