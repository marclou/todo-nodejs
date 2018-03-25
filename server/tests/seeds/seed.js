const { User } = require('./../../models/users.js');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
	_id: userOneId,
	username: 'Marc',
	email: 'marc@gmail.com',
	password: '123123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth' }, '123abc').toString()
    }]
}, {
	_id: userTwoId,
	username: 'Wonji',
	email: 'wonjj@gmail.com',
	password: '123123'
}];

const populateUsers = (done) => {
	User.remove({}).then(() => {
		const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
	}).then(() => {
        done();
    });
};

module.exports = {
    users,
    populateUsers
}
