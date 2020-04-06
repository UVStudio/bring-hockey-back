console.log('FE js working');

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement('th');
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

fetch('api/cdnData')
  .then((response) => {
    return response.json();
  })
  .then((rawData) => {
    console.log(rawData);

    //add active column
    // for (const el of rawData) {
    //   const activeCases = el.confirmed - el.deaths - el.recovered;
    //   el.active = activeCases;
    // }

    for (i = 0; i < rawData.length; i++) {
      //active cases
      const el = rawData[i];
      const activeCases = el.confirmed - el.deaths - el.recovered;
      el.active = activeCases;
      //new cases
      if (i === 0) {
        el.new = 0;
      } else {
        el.new = el.confirmed - rawData[i - 1].confirmed;
      }
      //% increase for confirmed
      const totalPerIncRaw = (el.new / el.confirmed) * 100;
      const totalPerInc = totalPerIncRaw.toFixed(2) + '%';
      el.totalPercentIncrease = totalPerInc;
    }

    //populate table head
    let table = document.querySelector('table');
    let data = Object.keys(rawData[0]);
    generateTable(table, rawData);
    generateTableHead(table, data);
  });
