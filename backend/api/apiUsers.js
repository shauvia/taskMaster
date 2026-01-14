import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import {
  createUser,
  getUserByUsernameAndPassword,
  checkIsUsername,
  deleteUser,
} from "../db/queries/qUsers.js";

import requireUser from "#middleware/requireUser";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const isUsernameTaken = await checkIsUsername(username);
    if (isUsernameTaken === false) {
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } else {
      return res.status(409).send("Provided username is taken.");
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");
    const token = createToken({ id: user.id });
    res.send(token);
  }
);

router.use(requireUser);

router.delete("/delete", async (req, res) => {
  const userId = req.user.id;
  const user = await deleteUser(userId);
  console.log("I need a username. What is inside user", user);
  return res.status(201).send(`Account has been deleted.`);
});
