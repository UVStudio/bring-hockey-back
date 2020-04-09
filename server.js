const express = require('express');
const path = require('path');
const app = express();

//Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//set static folder
app.use(express.static(path.join(__dirname, '/public')));

//data route
app.use('/api/cdnData', require('./routes/api/cdnData'));

//app.listen(3000, () => console.log('Example app listening on port 3000!'));

const port_number = process.env.PORT || 3000;
app.listen(port_number, () =>
  console.log(`App listening on port ${port_number}`)
);
