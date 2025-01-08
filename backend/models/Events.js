// const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required']
//   },
//   content: {
//     type: String,
//     required: [true, 'Content is required']
//   },
//   date: {
//     type: String,
//     required: [true, 'Date is required']
//   },
//   time: {
//     type: String,
//     required: [true, 'Time is required']
//   },
//   venue: {
//     type: String,
//     required: [true, 'Venue is required']
//   },
//   image: {
//     type: String
//   }
// });

// const Event = mongoose.model('Event', eventSchema);

// module.exports = Event;


const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required']
  },
  image: {
    type: String
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
