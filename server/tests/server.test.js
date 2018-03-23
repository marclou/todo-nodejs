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

const users = [{
	_id: new ObjectId(),
	username: 'Marc',
	email: 'marc@gmail.com'
}, {
	_id: new ObjectId(),
	username: 'Wonji',
	email: 'wonjj@gmail.com'
}];

beforeEach((done) => {
	User
		.remove({})
		.then(() => {
			User.insertMany(users);
		})
		.then(() => done());
});

describe('POST /todos', () => {
	it('Should create a User document', (done) => {

		const user = {
			username: 'Wonji',
			email: 'wonji@gmail'
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
