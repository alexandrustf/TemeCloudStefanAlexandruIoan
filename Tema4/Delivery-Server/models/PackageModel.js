"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
  sender: {
    lat: Number,
    lng: Number,
    phone: String,
    firstName: String,
    lastName: String,
    adress: String,
  },
  receiver: {
    lat: Number,
    lng: Number,
    phone: String,
    firstName: String,
    lastName: String,
    adress: String,
  },
  date: Date,
  details: String,
  weight: Number,
});

module.exports = mongoose.model("package", PackageSchema);
