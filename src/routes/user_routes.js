import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize"
// pull in error types and the logic to handle them and set status codes
import { BadParamsError } from "../lib/custom_errors";

import models from "./../db/models";

const tokenAuth = passport.authenticate("jwt", { session: false });
const localAuth = passport.authenticate("local", { session: false });
const User = models.User;
const Skills = models.Skill;
const userskills = models.userskills;
const Op = Sequelize.Op;
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
router.get("/user-info/:id", (req, res, next) => {
  //console.log("get user- user-info " + req.params.email);

  User.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(user => {
      res.status(200).json({ user: user });
    })
    .catch(next);

});
router.get("/user-id/:email", (req, res, next) => {


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
  console.log("\n\n\\n\ skill")

  userskills.create({
    level: req.body.data.level,
    skill_id: req.body.data.id,
    user_id: req.params.id
  })
    .then(user => {
      res.status(200).json({ success: true, user });
    })
    .catch(e => console.log(e));

})
router.delete("/user/:id/skill", (req, res, next) => {
  console.log("ddeeeeellllleeeeete")

  userskills.destroy({
    where: {
      [Op.and]: {
        user_id: req.params.id,
        skill_id: req.body.skill_id
      }
    }
  }).then(() => {
    res.status(200).json({ success: true });
  }).catch(e => res.status(404).json({ success: false }))

});

router.get("/user/:id/skills", (req, res, next) => {
  User.findOne({
    attributes: ["id"],
    where: {
      id: req.params.id
    },
    include: [{ model: userskills, as: "Skill", attributes: ["level", "user_id", "skill_id"], include: [{ model: Skills, attributes: ["name", "id"], }] }]
  }).then(user => {

    // TODO : change it from the frontend 
    const format = user.Skill.map(user => {
      return {
        id: user.Skill.id,
        name: user.Skill.name,
        userskills: {
          user_id: user.user_id,
          skill_id: user.skill_id,
          level: user.level
        }
      }
    })
    res.status(200).json({ skill: format });
  }).catch(next);

});



router.get('/users', (req, res) => {
  User.findAll()
    .then(users => {
      res.status(200).json({
        users: users
      });
    })
    .catch(e => console.log(e));

});


router.get('/search/users', (req, res) => {
  let userResults = [];

  User.findAll({
    include: [{ model: userskills, as: "Skill" }],
    where: {
      [Op.and]: {
        "$Skill.skill_id$": req.query.id,
        "$Skill.level$": { [Op.gte]: req.query.level }
      }
    }
  })
    .then(s => {
      console.log(s)
      res.status(200).json({
        users: s
      });
    })

    .catch(e => console.log(e));

});
export default router;
