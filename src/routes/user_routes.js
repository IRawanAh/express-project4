import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// pull in error types and the logic to handle them and set status codes
import { BadParamsError } from "../lib/custom_errors";

import models from "./../db/models";

const tokenAuth = passport.authenticate("jwt", { session: false });
const localAuth = passport.authenticate("local", { session: false });
const User = models.User;
const Skills = models.Skill;
const userskills = models.userskills;

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.post("/sign-up", (req, res, next) => {
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(req.body.credentials)
    .then(credentials => {
      if (
        !credentials ||
        !credentials.password ||
        credentials.password !== credentials.password_confirmation
      ) {
        throw new BadParamsError();
      } else {
        return User.create({
          email: credentials.email,
          hashedPassword: credentials.password
        });
      }
    })
    .then(user => {
      const payload = {
        id: user.id,
        email: user.email,
        expires: process.env.JWT_EXPIRATION_D + "d"
      };

      // assigns payload to req.user
      req.login(payload, { session: false }, error => {
        if (error) {
          next();
        }

        // generate a signed json web token and return it in the response
        const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

        // assign our jwt to the cookie
        res
          .cookie("jwt", token, { httpOnly: true, secure: false })
          .status(201)
          .json({ id: req.user.id, email: req.user.email });
      });
    })
    // pass any errors along to the error handler
    .catch(next);
});

router.post("/sign-in", localAuth, (req, res, next) => {
  if (req.user) {
    // This is what ends up in our JWT
    const payload = {
      id: req.user.id,
      email: req.user.email,
      expires: process.env.JWT_EXPIRATION_D + "d"
    };

    // assigns payload to req.user
    req.login(payload, { session: false }, error => {
      if (error) {
        next();
      }

      // generate a signed json web token and return it in the response
      const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

      // assign our jwt to the cookie
      res
        .cookie("jwt", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ id: req.user.id, email: req.user.email });
    });
  }
});

router.patch("/change-password", tokenAuth, (req, res, next) => {
  if (!req.body.passwords.new) throw new BadParamsError();

  User.findOne({
    where: {
      email: req.user.email
    }
  })
    .then(user => {
      if (user != null) {
        if (user.validPassword(req.body.passwords.old)) {
          user.bcrypt(req.body.passwords.new);

          res.status(200).json({ msg: "success" });
        } else {
          throw new BadParamsError();
        }
      } else {
        throw new BadParamsError();
      }
    })
    .catch(next);
});

router.patch("/user-info", (req, res, next) => {
  console.log("patch user- user-info " + req.body.email + "/n/n/n/n/n end");

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      user.update({
        name: req.body.data.name,
        github: req.body.data.github,
        linkedin: req.body.data.linkedin,
        twitter: req.body.data.twitter,
        location: req.body.data.location
      })
    })
    .catch(next);

});
router.get("/user-info/:email", (req, res, next) => {
  console.log("get user- user-info " + req.params.email);

  User.findOne({
    where: {
      email: req.params.email
    }
  })
    .then(user => {
      res.status(200).json({ user: user });
    })
    .catch(next);

});
router.post("/user/:id/skill", (req, res, next) => {
  console.log("poooooossssstttt skiiiiil")
  Skills.findOne({ where: { id: req.body.data.id } }).then(skill => {

    User.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(user => {
        user.addSkill(skill, { through: { level: req.body.data.level } })
          .then(sc => { sc: sc })
      });
  })

  router.get("/user/skills", (req, res, next) => {
    userskills.findAll({
      where: {
        user_id: 1
      }
    })
      .then(user => {
        res.status(200).json({ user: user });
      })
      .catch(next);

  });

});

export default router;
