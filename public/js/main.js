console.log('FE js working');

fetch('api/cdnData')
  .then((response) => {
    return response.json();
  })
  .then((rawData) => {
    //console.log(rawData);
    const incOverTotalArray = [];
    const incOverActiveArray = [];
    const rowDataArray = [];

    // calculate values for fields
    for (i = 0; i < rawData.length; i++) {
      //date
      const date = rawData[i].date;

      //new cases
      let newCases;
      if (rawData[i].confirmed === 0) {
        newCases = 0;
      } else {
        newCases = rawData[i].confirmed - rawData[i - 1].confirmed;
      }

      //total cases
      const cases = rawData[i].confirmed;

      //new deaths
      let newDeaths;
      if (rawData[i].deaths === 0) {
        newDeaths = 0;
      } else {
        newDeaths = rawData[i].deaths - rawData[i - 1].deaths;
      }

      //total deaths
      const deaths = rawData[i].deaths;

      //total recovered
      const recovered = rawData[i].recovered;

      //active cases
      const activeCases = cases - deaths - recovered;

      //% increase over total
      let incOverTotal;
      let incOverTotalPerc;
      if (rawData[i].confirmed === 0) {
        incOverTotalPerc = 0;
      } else {
        incOverTotal = ((newCases / rawData[i - 1].confirmed) * 100).toFixed(2);
        incOverTotalPerc = incOverTotal + '%';
      }
      //console.log(incOverTotalPerc);

      //% increase over active
      let incOverActive;
      let incOverActivePerc;
      if (activeCases === 0) {
        incOverActivePerc = 0;
      } else {
        incOverActive = ((newCases / (activeCases - newCases)) * 100).toFixed(
          2
        );
        incOverActivePerc = incOverActive + '%';
      }

      //7 day rolling average over total cases
      //push all incOverTotalPerc in this array, then do the math
      let sevenRollingTotal;
      incOverTotalArray.push(parseFloat(incOverTotal));

      if (i < 7) {
        sevenRollingTotal = 0;
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
      //console.log(sevenRollingTotal);
      //console.log(incOverTotalArray);

      //7 day rolling average over active cases
      let sevenRollingActive;
      incOverActiveArray.push(parseFloat(incOverActive));

      if (i < 7) {
        sevenRollingActive = 0;
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
      //console.log(sevenRollingActive);

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
      rowData.activeCases = activeCases;
      rowData.cases = cases;
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
    console.log(rowDataArray);
  });

// function generateTable(table, data) {
//   for (let element of data) {
//     let row = table.insertRow();
//     for (key in element) {
//       let cell = row.insertCell();
//       let text = document.createTextNode(element[key]);
//       cell.appendChild(text);
//     }
//   }
// }
