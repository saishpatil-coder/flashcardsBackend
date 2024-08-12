const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sai1234@@',
  database: 'flashcards_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/flashcards', (req, res) => {
    const { question, answer } = req.body;
    const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
    db.query(sql, [question, answer], (err, result) => {
      if (err) throw err;
      res.send({ id: result.insertId }); // Send back the id of the inserted row
    });
  });
  

// app.put('/flashcards/:id', (req, res) => {
//   const { id } = req.params;
//   const { question, answer } = req.body;
//   db.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, id], (err) => {
//     if (err) throw err;
//     res.sendStatus(200);
//   });
// });
// server.js (Express backend)
app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  
  if (!question || !answer) {
    return res.status(400).send('Question and Answer fields cannot be empty');
  }
  
  const query = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  
  db.query(query, [question, answer, id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Flashcard updated successfully', id });
  });
});


app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM flashcards WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
