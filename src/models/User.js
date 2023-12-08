const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

// Method to check the entered password against the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);