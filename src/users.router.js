import User from "./user.model.js";
import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

const usersRouter = express.Router();

usersRouter.post("/signup", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .send(`User with email ${req.body.email} already exists.`);
  }
  const newUser = new User(req.body);
  newUser.password = await bcrypt.hash(req.body.password, 10);

  await newUser.save();

  return res.status(201).send(_.pick(newUser, ["name", "email"]));
});

usersRouter.post("/auth", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send(`Email and/or password incorrect.`);
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(404).send(`Email and/or password incorrect.`);
  }

  const token = user.generateAuthToken();

  return res.send({
    access_token: token,
  });
});

export default usersRouter;
