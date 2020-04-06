const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');

const app = express();

//init middleware
//app.use(logger);

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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