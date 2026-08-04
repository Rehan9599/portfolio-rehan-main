import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  featured: { type: Boolean, default: false },
  image:{type: String},
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
