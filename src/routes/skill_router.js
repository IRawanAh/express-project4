import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// pull in error types and the logic to handle them and set status codes
import { BadParamsError } from "../lib/custom_errors";

import models from "./../db/models";



// instantiate a router (mini app that only handles routes)
const router = express.Router();
const Skill = models.Skill;
router.get("/skills", (req, res, next) => {
    console.log("getting skills");
    Skill.findAll()
        .then(skills => {
            res.status(200).json({
                skills: skills
            });
        })
        .catch(e => console.log(e));
});
export default router;