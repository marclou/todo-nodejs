const expect = require('expect');
const request = require('supertest');
const {
	ObjectId
} = require('mongodb');

const {
	app
} = require('./../server.js');
const {
	User
} = require('./../models/users');
const { users, populateUsers } = require('./seeds/seed');


beforeEach(populateUsers);

describe('GET /todos', () => {
	it('should get all todos frm mongoDB', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.users.length).toBe(2);
			})
			.end(done);
	});
});

describe('POST /todos', () => {
	it('Should create a User document', (done) => {

		const user = {
			username: 'Wonji',
			email: 'test@gmail.fr',
			password: '123123Z'
		};

		request(app)
			.post('/todos')
			.send(user)
			.expect(200)
			.expect((res) => {
				expect(res.body.username).toBe(user.username);
				expect(res.body.email).toBe(user.email);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.find().then((users) => {
					expect(users.length).toBe(3);
					done();
				}).catch((err) => done(err));
			})

	});

	it('Should not create Todo with invalid data', (done) => {

		const user = {
			username: 'Wonji',
			email: 'wonji@gmail'
		};

		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.find()
					.then((users) => {
						expect(users.length).toBe(2);
						done();
					}).catch((err) => {
						done(err);
					});
			});
	});
});

describe('GET /todos/:id', () => {
	it('Should return todo doc', (done) => {
		request(app)
			.get(`/todos/${users[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.user.username).toBe(users[0].username);
			})
			.end(done);

	});

	it('Should return 404 if todo not found', (done) => {
		const randomId = new ObjectId();

		request(app)
			.get(`/todos/${randomId.toHexString()}`)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('Should delete a user', (done) => {
		const hexId = users[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.user._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(hexId).then((user) => {
					expect(user).toNotExist();
					done();
				}).catch((err) => {
					done(err);
				});
			});
	});

	it('Should return 404 status if ObjectID is invalid', (done) => {
		const invalidID = '1234';

		request(app)
			.delete(`/todos/${invalidID}`)
			.expect(404)
			.end(done);
	});

	it('Should return 404 if User not found ', (done) => {
		const notFoundID = new ObjectId().toHexString();

		request(app)
			.delete(`/todos/${notFoundID}`)
			.expect(404)
			.end(done);
	});
});

describe('GET /user/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/user/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.user._id).toBe(users[0]._id.toString());
			})
			.end(done);
	});

	it('should 401 if not authenticated', (done) => {
		request(app)
			.get('/user/me')
			.expect(401)
			.end(done);
	});
});

describe('POST /user', () => {
	it('Should create a user', (done) => {
		const user = {
			username: "wonji",
			email: "wonji@marc.com",
			password: "123123"
		};
		request(app)
			.post('/user')
			.send(user)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.findOne({ email: user.email }).then((user) => {
					expect(user).toExist();
					done();
				}).catch((e) => {
					done(e);
				});
			});
	});
});
