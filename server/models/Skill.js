import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String}
});

const skillSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  items: [itemSchema]
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;

