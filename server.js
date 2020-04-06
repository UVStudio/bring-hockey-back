const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cdnData = require('./routes/api/cdnData');
const jsdom = require('jsdom');
const logger = require('./middleware/logger');

const app = express();

//init middleware
//app.use(logger);

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//axios
async function getData() {
  try {
    const response = await axios.get(
      'https://pomber.github.io/covid19/timeseries.json'
    );
    const cdnData = response.data.Canada;
    console.log(cdnData);
    return cdnData;
  } catch (error) {
    console.error(error);
  }
}

//Homepage route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Bring hockey back!',
  });
});

//set static folder
app.use(express.static(path.join(__dirname, '/public')));

//data route
app.use('/api/cdnData', require('./routes/api/cdnData'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
