const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "MyPerson"
  },
  textone: {
    type: String,
    required: true
  },
  texttwo: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  upvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "MyPerson"
      }
    }
  ],
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "MyPersoon"
      },
      text: {
        type: String,
        require: true
      },
      name: {
        type: String,
        require: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  
});

module.exports=Question=mongoose.model('MyQuestion',QuestionSchema);