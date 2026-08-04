import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  terminalUser: { type: String },
  role: { type: String },
  location: { type: String },
  university: { type: String },
  github: { type: String },
  linkedin: { type: String },
  email: { type: String },
  quote: { type: String },
  journeyText: { type: String },
  currentFocus: {type: String},
  stats: {
    projectsShipped: { type: String },
    mernExperience: { type: String },
    mlAccuracy: { type: String },
    skillAreas: { type: String },
    dsaSolved: { type: String },
    dsaStreak: { type: String }
  }
}, { timestamps: true });

const PersonalInfo = mongoose.model('PersonalInfo', personalInfoSchema);
export default PersonalInfo;
