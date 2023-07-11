  const express = require('express');
  const mysql = require('mysql');

  const app = express();

  // Create a connection to the MySQL database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my_database',
  });

  connection.connect(function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('Connected to MySQL database');
  });

  // Create a simple route that returns all the records from the `users` table
  app.get('/users', function(req, res) {
    connection.query('SELECT * FROM users', function(err, results) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  });

  // Create a route that creates a new user
  app.post('/users', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const email = req.body.email;

    const sql = `INSERT INTO users (username, password, fullname, email) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [username, password, fullname, email], function(err, results) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json({ message: 'User created successfully' });
      }
    });
  });

  // Create a route that updates an existing user
  app.put('/users/:id', function(req, res) {
    const id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const email = req.body.email;

    const sql = `UPDATE users SET username=?, password=?, fullname=?, email=? WHERE id=?`;
    connection.query(sql, [username, password, fullname, email, id], function(err, results) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json({ message: 'User updated successfully' });
      }
    });
  });

  // Create a route that deletes a user
  app.delete('/users/:id', function(req, res) {
    const id = req.params.id;

    const sql = `DELETE FROM users WHERE id=?`;
    connection.query(sql, [id], function(err, results) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    });
  });

  // Listen on port 3000
  app.listen(3000, function() {
    console.log('Express server listening on port 3000');
  });
