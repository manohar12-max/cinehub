import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    minLength:4
  },
  favorites: {
    type: [{ type: Number }],
    default:[]
  },
});

const User=mongoose.models.User || mongoose.model('User',UserSchema);

export default User;