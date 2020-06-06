const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//load person model
const Person = require("../../model/Person");
//load question model
const Question = require("../../model/Question");
//load profile model
const Profile = require("../../model/Profile");

//Type  GET
//@route    /api/question
//@desc     route for getting all question
//@access   Privete

router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(question => res.json({ question }))
    .catch(err => console.log(err));
});

//Type  [post]
//@route    /api/question``
//@desc     route for submiting Question
//@access   Privete

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json({ question }))
      .catch(err => console.log(err));
  }
);

//Type  [post]
//@route    /api/answers/:id
//@desc     route for submiting ansewers to Question
//@access   Privete

router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text
        };
        question.answers.unshift(newAnswer);

        question
          .save()
          .then(question => res.json({ question }))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//Type  [post]
//@route    /api/question/upvote/:id
//@desc     route for upvoting
//@access   Privete

router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              res.status(400).json({ noupvote: "Already upvoted" });
            }
            question.upvotes.unshift({ user: req.user.id });
            question
              .save()
              .then(question => res.json({ question }))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
module.exports = router;
