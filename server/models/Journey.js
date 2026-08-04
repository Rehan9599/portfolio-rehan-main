import mongoose from 'mongoose';

const JourneySchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  year: { type: String,required:true },
  x: { type: Number, required:true },
  y: { type: Number,required:true},
}, { timestamps: true });

const Journey = mongoose.model('Journey', JourneySchema);
export default Journey;

