require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const  { User } = require('./models/users');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
     res.send('<h1> Hey there ;) </h1>');
});

app.post('/todos', (req, res) => {
     const { username, email, password } = req.body;
     const user = new User({
          username: username,
          email: email,
          password: password
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

app.post('/user', (req, res) => {
	const userToRegister = _.pick(req.body, ['username', 'email', 'password', 'age', 'token']);
	const user = new User(userToRegister);

	user.save()
		.then((user) => {
			return user.generateAuthToken();
		})
		.then((token) => {
			res
				.status(200)
				.header('x-auth', token)
				.send(user.toJSON());
		})
		.catch((e) => {
			res.status(400).send({
				error: e
			});
		});
});

app.get('/user/me', authenticate, (req, res) => {
    res.send({ user: req.user });
});

app.listen(port, () => {
     console.log('Listen on port '+port);
     console.log('Environement : '+process.env.MONGODB_URI);
})

module.exports = {
     app
};
