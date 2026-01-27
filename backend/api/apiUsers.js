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
      // only backend
      // res.status(201).send(token);
      // frontend
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24,
        })
        .status(201)
        .json({
          success: true,
          user: { id: user.id, username: user.username },
        });
    } else {
      return res.status(409).json({ error: "Provided username is taken." });
    }
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user)
      return res.status(401).json({ error: "Invalid username or password." });
    const token = createToken({ id: user.id });

    // only backend
    // res.status(201).send(token);
    // frontend

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({ success: true, user: { id: user.id, username: user.username } });
  },
);

router.use(requireUser);

router.get("/me", (req, res) => {
  const user = req.user;
  console.log("me, user", user);
  res.json({ user: { id: user.id, username: user.username } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true });
});

router.delete("/delete", async (req, res) => {
  const userId = req.user.id;
  const user = await deleteUser(userId);
  console.log("I need a username. What is inside user", user);
  return res.status(201).json({ success: `Account has been deleted.` });
});
