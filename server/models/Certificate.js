import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  image:{type: String},
  description: { type: String },
  category: { type: String },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: String },
  link: { type: String }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
