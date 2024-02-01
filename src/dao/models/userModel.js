import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true, required: true }, // Hacer que el campo sea obligatorio
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' },
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.serializeUser = function () {
  return {
    _id: this._id,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
    age: this.age,
    role: this.role,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
