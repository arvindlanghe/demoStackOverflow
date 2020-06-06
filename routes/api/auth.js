const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/mongoURL");

//Type  Get
//@route    /api/auth
//@desc just for testing
//@access   public

router.get("/", (req, res) => {
  res.json({ test: "Auth is Sucess" });
});

//import schema for person to resister
const Person = require("../../model/Person");
//Type  Post
//@route    /api/auth/resister
//@desc foe new user Resister
//@access   public

router.post("/resister", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res.status(400).json({ emailerror: "Email already resisterd" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});
//Type  Post
//@route    /api/auth/login
//@desc login to system
//@access   private

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.status(400).json({ emailnotfound: "Email id not found" });
      }
      if (person) {
        bcrypt
          .compare(password, person.password)
          .then(isCorrect => {
            if (isCorrect) {
              // res.json({ Sucess: "User login sucesfully" });
              //   use paylod and create token for user
              const payload = {
                id: person.id,
                name: person.name,
                email: person.email
              };
              jsonwt.sign(
                payload,
                key.secret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    sucess: true,
                    token: token
                  });
                }
              );
            } else {
              res.status(400).json({ passworderror: "Password is incorrect" });
            }
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});
//Type  Get
//@route    /api/auth/profile
//@desc login to system
//@access   private

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;
