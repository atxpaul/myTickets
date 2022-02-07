import mongoose from 'mongoose';

const User = mongoose.model('Users', {
  password: String,
  username: String,
  name: String,
  surname: String,
  address: String,
  age: Number,
  phone: String,
  profilePic: String,
});

export default User;
