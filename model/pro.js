const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proschema = new Schema({
  username: {
    type: String
  },
  website: {
    type: String
  },
})

module.exports = pro = mongoose.model("Pro", proschema);