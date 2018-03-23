const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const  { User } = require('./models/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
     res.send('<h1> Hey there ;) </h1>');
});

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
               users: users
          });
     }).catch((err) => {
          res.status(400).send(err);
     });
});

app.get('/todos/:id', (req, res) => {
     const id = req.params.id;

     if (!ObjectId.isValid(id)) {
          return res.status(404).send({error: 'Invalid ObjectId'});
     }

     User.findById(id).then((user) => {
          if (user) {
               return res.status(200).send({user});
          }
          res.status(404).send({error: 'User doesn\'t exist'});
     }).catch((e) => {
          res.status(400).send({e});
     });

});

app.delete('/todos/:id', (req, res) => {
     const userToDelete = req.params.id;

     if (!ObjectId.isValid(userToDelete)) {
          return res.status(404).send({ error : 'Invalid user ID'});
     }

     User.findByIdAndRemove(userToDelete).then((user) => {
          if (user) {
               return res.status(200).send({ user : user });
          }
          res.status(404).send({error: 'User doesn\'t exist'});
     }).catch((err) => {
          res.status(400).send({ error : err });
     });

});

app.listen(port, () => {
     console.log('Listen on port '+port);
})

module.exports = {
     app
};
