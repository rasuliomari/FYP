const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['customer', 'courier', 'admin'], default: 'available', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);