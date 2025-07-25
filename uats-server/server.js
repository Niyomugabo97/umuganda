// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Atlas URI
// const mongoURI = 'mongodb+srv://claudeniyomugabo2022:HsiLKCnYW3ikTy2H@cluster0.kqp4cne.mongodb.net/uats?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(mongoURI)
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Shared Schema
// const personSchema = new mongoose.Schema({
//   name: String,
//   district: String,
//   sector: String,
//   village: String,
//   cell: String,
//   amount: Number // used only for absentees
// });

// // Models
// const Attendee = mongoose.model('Attendee', personSchema);
// const Absentee = mongoose.model('Absentee', personSchema);

// // Routes for Attendees
// app.route('/attendees')
//   .get(async (req, res) => {
//     const attendees = await Attendee.find();
//     res.json(attendees);
//   })
//   .post(async (req, res) => {
//     const newPerson = new Attendee(req.body);
//     await newPerson.save();
//     res.json(newPerson);
//   });

// app.delete('/attendees/:id', async (req, res) => {
//   await Attendee.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// });

// // Routes for Absentees
// app.route('/absentees')
//   .get(async (req, res) => {
//     const absentees = await Absentee.find();
//     res.json(absentees);
//   })
//   .post(async (req, res) => {
//     const newPerson = new Absentee(req.body);
//     await newPerson.save();
//     res.json(newPerson);
//   });

// app.delete('/absentees/:id', async (req, res) => {
//   await Absentee.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// });

// // Start Server
// app.listen(4000, () => console.log('🚀 Server running on http://localhost:4000'));
