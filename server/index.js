const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const axios = require('axios');
const config = require('../config.js');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());

const options = {
  headers: {
    Authorization: config.TOKEN,
  },
};

app.get('/qa/questions/:productId', (req, res) => {
  const { productId } = req.params;

  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea/qa/questions/?product_id=${productId}`, options)
    .then(({ data }) => {
      res.status(200).send(data);
    }).catch((err) => {
      console.log('there was an error getting questions based on product id', err);
    });
});

app.listen(PORT, () => {
  console.log(`server listening on localhost: ${PORT}`);
});
