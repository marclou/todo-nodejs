const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server.js');
const { User } = require('./../models/user');

beforeEach((done) => {
     User.remove({}).then(() => {
          done();
     });
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
                    expect(users.length).toBe(1);
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
						expect(users.length).toBe(0);
						done();
					}).catch((err) => {
						done(err);
					});
                    });
	});
});
