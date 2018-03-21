const mongoose = require('mongoose');

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
          trim: true
     },
     age: {
          type: Number,
          default: undefined
     }
});

module.exports = {
     User
};
