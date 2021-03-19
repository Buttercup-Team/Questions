psql;

CREATE DATABASE sdc;

\c sdc;

CREATE TABLE questions (
  question_id SERIAL,
  product_id INT NOT NULL,
  question_body TEXT,
  question_date DATE,
  asker_name VARCHAR(60),
  asker_email VARCHAR(60),
  question_reported BOOLEAN,
  question_helpfulness INT NOT NULL,
  PRIMARY KEY(question_id)
);

CREATE TABLE answers (
  answer_id SERIAL,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date DATE,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(60),
  reported BOOLEAN,
  helpfulness INT NOT NULL,
  PRIMARY KEY(answer_id),
  CONSTRAINT fk_question
    FOREIGN KEY(question_id)
      REFERENCES questions(question_id)
);

CREATE TABLE answers_photos (
  id SERIAL,
  answer_id INT NOT NULL,
  url TEXT[],
  PRIMARY KEY(id),
  CONSTRAINT fk_answer
    FOREIGN KEY(answer_id)
      REFERENCES answers(answer_id)
);

COPY questions(question_id,
  product_id,
  question_body,
  question_date,
  asker_name,
  asker_email,
  question_reported,
  question_helpfulness)
FROM '/home/alex/Desktop/galvanize/Questions/CSV/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(answer_id,
  question_id,
  body,
  date,
  answerer_name,
  answerer_email,
  reported,
  helpfulness)
FROM '/home/alex/Desktop/galvanize/Questions/CSV/answers.csv'
DELIMITER ','
CSV HEADER;

COPY answers_photos(id, answer_id, url)
FROM '/home/alex/Desktop/galvanize/Questions/CSV/answers_photos.csv'
DELIMITER ','
CSV HEADER;
