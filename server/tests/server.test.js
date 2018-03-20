const expect = require('expect');
const request = require('supertest');

const {
	app
} = require('./../server.js');
const {
	User
} = require('./../models/user');

const users = [{
	username: 'Marc',
	email: 'marc@gmail.com'
}, {
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
     it('should get all todos frm mongoDB', (done) =>{
          request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
               expect(res.body.todos.length).toBe(2);
          })
          .end(done);
     });
});
