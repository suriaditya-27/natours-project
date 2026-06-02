const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name'], //validators
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  //we arent mentionaing required because this wont be set byv the developer--reviws will be given by the users
  //👇👇👇👇👇👇👇👇👇👇👇
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsReviews: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, //schema type for string is TRIm --- will remove all the whitespaces
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, //name of thie iamge as a refferenve
    required: [true, 'A tour must have a COver image'],
  },
  //here i have mutilple inmages and i want to save them as an array of string
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date], //so differennt dates of the same tour
});
//now after schema making a model out of it
//...convention is that it that name of model must be first letter->Capital
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
