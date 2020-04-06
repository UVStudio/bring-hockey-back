console.log('FE js working');

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

// function generateTableHead(table, data) {
//   let thead = table.createTHead();
//   let row = thead.insertRow();
//   for (let key of data) {
//     let th = document.createElement('th');
//     let text = document.createTextNode(key);
//     th.appendChild(text);
//     row.appendChild(th);
//   }
// }

fetch('api/cdnData')
  .then((response) => {
    return response.json();
  })
  .then((rawData) => {
    //console.log(rawData);
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
        incOverTotal = (newCases / rawData[i - 1].confirmed) * 100;
        incOverTotalPerc = incOverTotal.toFixed(2) + '%';
      }

      //% increase over active
      let incOverActive;
      let incOverActivePerc;
      if (activeCases === 0) {
        incOverActivePerc = 0;
      } else {
        incOverActive = (newCases / activeCases) * 100;
        incOverActivePerc = incOverActive.toFixed(2) + '%';
      }

      //7 day rolling average over total cases
    }
  });
