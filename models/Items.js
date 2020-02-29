const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const ItemSchema = new Schema({
  weathers: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  },
  showMore: {
    type: Boolean,
    default: false
  },
  newID: { type: String },
  name: {
    type: String
  }
});
module.exports = Item = mongoose.model("item", ItemSchema);
