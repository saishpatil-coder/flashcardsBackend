const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for connection settings
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flashcards_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) {
      console.error('Error fetching flashcards:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;
  const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
  db.query(sql, [question, answer], (err, result) => {
    if (err) {
      console.error('Error adding flashcard:', err);
      return res.status(500).send('Server error');
    }
    res.send({ id: result.insertId }); // Send back the id of the inserted row
  });
});

app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  
  if (!question || !answer) {
    return res.status(400).send('Question and Answer fields cannot be empty');
  }
  
  const query = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  
  db.query(query, [question, answer, id], (err, result) => {
    if (err) {
      console.error('Error updating flashcard:', err);
      return res.status(500).send('Server error');
    }
    res.send({ message: 'Flashcard updated successfully', id });
  });
});

app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM flashcards WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting flashcard:', err);
      return res.status(500).send('Server error');
    }
    res.sendStatus(200);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
