const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
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
     age: {
          type: Number,
          default: undefined
     },
     password: {
         type: String,
         required: true,
         minlength: 5
     },
     tokens: [{
         acces: {
             type: String,
             required: true
         },
         token: {
             type: String,
             required: true
         }
     }]
});

module.exports = {
     User
};
