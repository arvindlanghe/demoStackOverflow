const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Person = require("../../model/Person");

const Profile = require("../../model/Profile");

const pro = require("../../model/pro");

//Type  Get
//@route    /api/profile
//@desc ROute for personal user profile
//@access   private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res
            .status(404)
            .json({ noprofilefound: "No such Profile found" });
        }
      })
      .catch(err => console.log(err));
  }
);


router.get("/drop", (req, res) => {
 pro.findOne()
    .then(prof => {
      console.log(prof)
      res.send(prof)
    })
    .catch(err => console.log(err));
})
//Type  POST
//@route    /api/profile/
//@desc ROute for Saving/Updating personal Info
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profilevalues = {};
    profilevalues.user = req.user.id;
    if (req.body.username) profilevalues.username = req.body.username;
    if (req.body.website) profilevalues.website = req.body.website;
    if (req.body.country) profilevalues.country = req.body.country;
    if (req.body.portfolio) profilevalues.portfolio = req.portfolio;

    if (typeof req.body.languges !== undefined) {
      profilevalues.languges = req.body.languges.split(",");
    }
    profilevalues.social = {};
    if (req.body.youtube) profilevalues.social.youtube = req.body.youtube;
    if (req.body.facebook) profilevalues.social.facebook = req.body.facebook;
    if (req.body.instagram) profilevalues.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profilevalues },
            { new: true }
          )
            .then(profile => res.json({ profile }))
            .catch(err => console.log(err));
        } else {
          Profile.findOne({ username: profilevalues.username })
            .then(profile => {
              if (profile) {
                return res
                  .status(400)
                  .json({ Username: "username already exixst" });
              }
              new Profile(profilevalues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
);
//Type  Get
//@route    /api/profile/
//@desc     Route for gettinf User Profile
//@access   Public

router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .then(profile => {
      if (!profile) {
        res.status.json({ usernotfound: "user not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("Errer in fetching username" + err));
});
//Type  Get
//@route    /api/profile/everyone
//@desc     Route for gettinf User Profile
//@access   Public

router.get("/find/everyone", (req, res) => {
  profile.find()
    .then(profile => {
      if (!profile) {
        res.status.json({ usernotfound: "user not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("Errer in fetching username" + err));
});
//Type  POST
//@route    /api/profile/workrole
//@desc     Route for posting work role
//@access   Private

router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newWork = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details
        };
        profile.workrole.unshift(newWork);
        profile
          .save()
          .then(profile => {
            return res.json(profile);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log("Error in getting profile" + err));
  }
);

//Type  Delete
//@route    /api/profile/workrol/:W_id
//@desc     Route for Deleting the Workrole
//@access   private

router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removethis = profile.workrole
          .map(item => item.id)
          .indexOf(req.params.w_id);
        profile.workrole.splice(removethis, 1);
        profile
          .save()
          .then(profile => res.json({ profile }))
          .catch(err => console.log(err));
      }
      )
      .catch(err => console.log(err));
  }
);
module.exports = router;
