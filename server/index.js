const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../db/helpers.js');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());

//* * Get Request * *//

app.get('/questions/:params', (req, res) => {
  const { params } = req.params;
  const values = [params];
  const query = 'SELECT questions.*, answers.*, answers_photos.* FROM questions INNER JOIN answers ON product_id=($1) AND answers.question_id=questions.question_id INNER JOIN answers_photos ON answers_photos.answer_id=answers.answer_id;';

  db.query(query, values, (err, data) => {
    if (err) {
      console.log('error in questions get query', err);
    } else {
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
              photos: [question.url],
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

app.post('/qa/questions/:questionId/answers', (req, res) => {
  const { questionId } = req.params;
  const values = [questionId, req.body.params.body, req.body.params.name, req.body.params.email, req.body.params.photos];
  const query = `WITH step AS (
    INSERT INTO answers(question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
    VALUES (($1), ($2), 'now', ($3), ($4), false, 0)
    RETURNING answer_id
  )
  INSERT INTO answers_photos(answer_id, url)
  SELECT answer_id, ($5) FROM step
  `;
  db.query(query, values, (err) => {
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

app.post('/qa/questions', (req, res) => {
  const values = [req.body.product_id, req.body.boody, req.body.name, req.body.email];
  const query = `INSERT INTO questions(product_id, question_body, question_date, asker_name, asker_email, question_reported, question_helpfulness) VALUES(($1), ($2), 'now', ($3), ($4), false, 0)`;
  db.query(query, values, (err) => {
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
  const values = [answerId];
  const query = 'UPDATE answers SET helpfulness=helpfulness +1 WHERE answer_id=($1)';

  db.query(query, values, (err) => {
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
app.put('/api/qa/questions/:questionId/helpful', (req, res) => {
  const { questionId } = req.params;
  const values = [questionId];
  const query = 'UPDATE questions SET question_helpfulness=question_helpfulness +1 WHERE question_id=($1)';

  db.query(query, values, (err) => {
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

app.put('/qa/answers/:answerId/report', (req, res) => {
  const { answerId } = req.params;
  const values = [answerId];
  const query = 'UPDATE answers SET reported=true WHERE answer_id=($1)';
  db.query(query, values, (err) => {
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
