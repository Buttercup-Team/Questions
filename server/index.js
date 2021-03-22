const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const axios = require('axios');
const querystring = require('querystring');
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

//* * Get Request * *//

app.get('/questions/:params', (req, res) => {
  const { params } = req.params;
  const query = `SELECT questions.*, answers.*, answers_photos.* FROM questions INNER JOIN answers ON product_id=${params} AND answers.question_id=questions.question_id INNER JOIN answers_photos ON answers_photos.answer_id=answers.answer_id;`;
  // const query = `
  // SELECT * FROM questions WHERE product_id=${params};
  // SELECT answers.*, answers_photos.* FROM answers WHERE (answers.question_id=(SELECT question_id FROM questions WHERE product_id=${params}) THEN INNER JOIN answers_photos ON answers_photos.answer_id=answers.answer_id;
  // `;

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

//* * Post Request To Add An Answer To A Question * *//

app.post('/api/qa/questions/:questionId/answers', (req, res) => {
  const { questionId } = req.params;
  const date = new Date().toISOString();
  const query = `INSERT INTO answers(question_id, body, date, answerer_name, answerer_email, reported, helpfulness) VALUES(${questionId}, '${req.body.params.body}', 'now', '${req.body.params.name}', '${req.body.params.email}', false, 0);
  INSERT INTO answers_photos(answer_id, url) VALUES((SELECT answer_id FROM answers WHERE question_id=${questionId} AND body='${req.body.params.body}'), '${req.body.params.photos}')
  `;
  db.query(query, (err) => {
    if (err) {
      console.log('error posting answer to db', err);
      res.sendStatus(500);
    } else {
      console.log('Successfully posted to db');
      res.sendStatus(201);
    }
  });
});

//* * API request to post a new question * *//

app.post('/api/qa/questions', (req, res) => {
  const query = `INSERT INTO questions(product_id, question_body, question_date, asker_name, asker_email, question_reported, question_helpfulness) VALUES(${req.body.product_id}, '${req.body.body}', 'now', '${req.body.name}', '${req.body.email}', false, 0)`;
  db.query(query, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

//* * Put requests * *//

//* * Answers Helpfulness * *//
app.put('/api/qa/answers/:answerId/helpful', (req, res) => {
  const { answerId } = req.params;
  const query = `UPDATE answers SET helpfulness=helpfulness +1 WHERE answer_id=${answerId}`;

  db.query(query, (err) => {
    if (err) {
      console.log('error with question helpfulness', err);
      res.sendStatus(500);
    } else {
      console.log('successful put request');
      res.sendStatus(201);
    }
  });
});

//* * Questions Helpfullness * *//
app.put('/api/qa/questions/:questionId/helpful', (req,res) => {
  const { questionId } = req.params;
  const query = `UPDATE questions SET question_helpfulness=question_helpfulness + 1 WHERE question_id=${questionId}`;

  db.query(query, (err) => {
    if (err) {
      console.log('err with questions helpful', err);
      res.sendStatus(500);
    } else {
      console.log('successful questions helpful press');
      res.sendStatus(201);
    }
  });
});

//* * Answers Reported * *//

app.put('/api/qa/answers/:answerId/report', (req, res) => {
  const { answerId } = req.params;
  const query = `UPDATE answers SET reported=true WHERE answer_id=${answerId}`;

  db.query(query, (err) => {
    if (err) {
      console.log('err updating reported in answers', err);
      res.sendStatus(500);
    } else {
      console.log('successfully updated reported in answers');
      res.sendStatus(201);
    }
  });
});

app.listen(PORT, () => {
  console.log(`server listening on localhost: ${PORT}`);
});
