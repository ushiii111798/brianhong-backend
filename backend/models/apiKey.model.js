//DB Setup
import mongoose from 'mongoose';

const APIKeySchema = new mongoose.Schema({
  name: String,
  email: String,
});

export const APIKey = mongoose.model('APIKey', APIKeySchema, 'APIKey');
