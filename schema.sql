psql;

CREATE DATABASE sdc;

\c sdc;

CREATE TABLE questions (
  id SERIAL,
  product_id INT NOT NULL,
  body TEXT,
  date_written DATE,
  asker_name VARCHAR(60),
  asker_email VARCHAR(60),
  reported INT NOT NULL,
  helpful INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE answers (
  id SERIAL,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written DATE,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(60),
  reported INT NOT NULL,
  helpful INT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_question
    FOREIGN KEY(question_id)
      REFERENCES questions(id)
);

CREATE TABLE answers_photos (
  id SERIAL,
  answer_id INT NOT NULL,
  url TEXT,
  PRIMARY KEY(id),
  CONSTRAINT fk_answer
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);

COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/home/alex/Desktop/galvanize/Questions/CSV/answers_photos.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/home/alex/Desktop/galvanize/Questions/CSV/answers_photos.csv'
DELIMITER ','
CSV HEADER;

COPY answers_photos(id, answer_id, url)
FROM './CSV/answers_photos.csv'
DELIMITER ','
CSV HEADER;
