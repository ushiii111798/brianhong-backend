//DB Setup
import mongoose from 'mongoose';

const APITokenSchema = new mongoose.Schema({
  name: String,
  email: String,
  token: String,
  isAuth: String,
});

export const APIToken = mongoose.model('APIToken', APITokenSchema, 'APIToken');
