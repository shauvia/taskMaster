import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { sendEmail } from "#utils/mailer";
import {
  createUser,
  getUserByUsernameAndPassword,
  checkIsUsername,
  softDeleteUser,
  getAllUsers,
  verifyUserByToken,
} from "../db/queries/qUsers.js";
import { randomBytes } from "node:crypto";

import requireUser from "#middleware/requireUser";

function isValidEmail(value) {
  // This function checks whether a string looks like a valid email address
  // using a simple regular expression (regex). It ensures the email has some characters,
  // followed by an '@', followed by more characters, a dot, and then some more characters.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

router.post(
  "/register",
  requireBody(["username", "password", "email"]),
  async (req, res, next) => {
    try {
      const username = req.body.username.trim();
      const password = req.body.password;
      const email = req.body.email.trim();

      if (!username || !password || !email) {
        return res.status(400).json({
          error: "Fields 'username', 'password', and 'email' are required.",
        });
      }
      let isValidEmailAddress = isValidEmail(email);
      if (!isValidEmailAddress) {
        return res.status(400).json({
          error: "Field 'email' must be a valid email address.",
        });
      }

      const isUsernameTaken = await checkIsUsername(username);
      if (isUsernameTaken) {
        return res.status(409).json({ error: "Provided username is taken." });
      }

      const verificationToken = randomBytes(32).toString("hex");
      const user = await createUser(
        username,
        password,
        email,
        verificationToken,
      );

      const backendBaseUrl =
        process.env.BACKEND_URL ||
        `http://localhost:${process.env.PORT ?? 3001}`;
      const verificationLink = `${backendBaseUrl}/api/users/verify/${verificationToken}`;
      await sendEmail({
        to: email,
        subject: "TaskMaster - Verify Your Email",
        text: `Welcome to TaskMaster, ${username}! Verify your email: ${verificationLink}`,
        html: `<p>Welcome to TaskMaster, <strong>${username}</strong>!</p><p>Click to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
      });

      return res.status(201).json({
        success: true,
        message: "Account created. Please verify your email.",
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/verify/:acctoken", async (req, res, next) => {
  try {
    const accToken = req.params.acctoken;
    if (
      !accToken ||
      typeof accToken !== "string" ||
      accToken.trim() === "" ||
      accToken.length !== 64 ||
      !/^[a-f0-9]+$/.test(accToken)
    ) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=0`);
    }
    const user = await verifyUserByToken(accToken);
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=0`);
    }
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=1`);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    console.log("Login route, backend: I'm in");
    const { username, password } = req.body;

    const user = await getUserByUsernameAndPassword(username, password);
    if (!user)
      return res.status(401).json({
        error: "Invalid username or password or account no longer exists.",
      });

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
      });
    }

    const token = createToken({ id: user.id });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })
    .json({ success: true });
}); // reliably deletes it because it matches the original cookie settings.

router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

router.post(
  "/test-email",
  requireBody(["to", "subject", "message"]),
  async (req, res, next) => {
    try {
      const to = req.body.to?.trim();
      const subject = req.body.subject?.trim();
      const message = req.body.message?.trim();

      if (!to || !subject || !message) {
        return res.status(400).json({
          error: "Fields 'to', 'subject', and 'message' cannot be empty.",
        });
      }

      if (!isValidEmail(to)) {
        return res.status(400).json({
          error: "Field 'to' must be a valid email address.",
        });
      }

      const result = await sendEmail({
        to,
        subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await softDeleteUser(userId);
  console.log("I need a username. What is inside user", user);
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });
  return res.status(201).json({
    success: true,
    message: `Account ${user.username} has been deleted.`,
  });
});
