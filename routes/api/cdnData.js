const express = require('express');
const router = express.Router();
const axios = require('axios');

//gets all members
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://pomber.github.io/covid19/timeseries.json'
    );
    const cdnData = response.data.Canada;
    //console.log(cdnData);
    res.json(cdnData);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
