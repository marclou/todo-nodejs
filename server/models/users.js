const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    username: {
         type: String,
         required: true,
         trim: true,
         minlength: 3,
         maxlength: 7
    },
    email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
         validate: {
             validator: validator.isEmail,
             message: '{VALUE} is not valid email'
         }
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['username', 'email', '_id']);
}

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toString(), access}, '123abc').toString();
    user.tokens.push(
        {
            access,
            token
        }
    );
    return user.save().then(() => token);
}

const User = mongoose.model('User', UserSchema);

module.exports = {
     User
};
