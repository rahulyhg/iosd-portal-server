import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const UserSchema = new mongoose.Schema({
  name: String,
  isAdmin: Boolean,
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10,(err, salt) => {
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) {
        return next(err);
      }
      user.password = hash;
      next();
    }); 
  });
});

UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

export default mongoose.model('User', UserSchema);
