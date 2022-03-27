import mongoose from 'mongoose';

const User = mongoose.model('Users', {
  password: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  profilePic: { type: String, required: true },
});

export default User;
