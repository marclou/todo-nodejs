const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const  { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
     const { username, email } = req.body;
     const user = new User({
          username: username,
          email: email
     });

     user.save().then((doc) => {
          res.send(doc);
     }, (e) => {
          res.status(400).send(e);
     })
});

app.get('/todos', (req, res) => {
     User.find().then((users) => {
          res.send({
               todos: users
          });
     }).catch((err) => {
          res.status(400).send(err);
     });
});

app.listen('3000', () => {
     console.log('Listen on port 3000 \n');
})

module.exports = {
     app
};
