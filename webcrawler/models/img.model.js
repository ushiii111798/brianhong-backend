//DB Setup
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
autoIncrement.initialize(mongoose.connection);

const ImagesSchema = new mongoose.Schema({
  img: String,
  name: Number,
  seq: { type: Number, default: 1 },
});
ImagesSchema.plugin(autoIncrement.plugin, {
  model: 'Images',
  field: 'seq',
  startAt: 1,
  increment: 1,
});

export const Images = mongoose.model('Images', ImagesSchema, 'Images');
