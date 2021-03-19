const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const axios = require('axios');
const config = require('../config.js');
const db = require('../db/helpers.js');

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

app.get('/questions/:params', (req, res) => {
  const { params } = req.params;
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea/qa/questions/?product_id=${params}`, options)
    .then((data) => res.send(data.data))
    .catch((err) => console.log('error getting questions', err.response.data));
});

app.get('/qa/questions/:productId', (req, res) => {
  const params = req.params.productId;
  const query = `SELECT questions.*, answers.*, answers_photos.* FROM questions INNER JOIN answers ON product_id=${params} AND answers.question_id=questions.question_id INNER JOIN answers_photos ON answers_photos.answer_id=answers.answer_id;`;
  // const query = `
  // SELECT * FROM questions WHERE product_id=${params};
  // SELECT questions.product_id, questions.question_id answers.* FROM answers WHERE questions.product_id=${params} AND answers.question_id=questions.question_id;`;

  // const response = {
  //   product_id: null,
  //   results: [
  //     {
  //       question_id: null,
  //       question_body: null,
  //       question_date: null,
  //       asker_name: null,
  //       question_helpfulness: null,
  //       reported: null,
  //       answers: {
  //         [answerId]: {
  //           id: 1259621,
  //           body: null,
  //           date: null,
  //           answerer_name: null,
  //           helpfulness: null,
  //           photos: null
  //         },
  //       },
  //     },
  //   ],
  // };

  db.query(query, (err, data) => {
    if (err) {
      console.log('error in questions get query', err);
    } else {
      console.log(data);
      const response = {
        product_id: data.rows[0].product_id,
        results: [],
      };

      data.rows.map((question) => {
        const responseObj = {
          question_id: question.question_id,
          question_body: question.question_body,
          question_date: question.question_date,
          asker_name: question.asker_name,
          question_helpfulness: question.question_helpfulness,
          reported: question.question_helpfulness,
          answers: {
            [question.answer_id]: {
              id: question.answer_id,
              body: question.body,
              date: question.date,
              answerer_name: question.answerer_name,
              helpfulness: question.helpfulness,
              photos: question.url,
            },
          },
        };
        response.results.push(responseObj);
      });
      res.send(response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`server listening on localhost: ${PORT}`);
});
