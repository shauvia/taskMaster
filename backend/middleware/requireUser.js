/** Requires a logged-in user */
export default async function requireUser(req, res, next) {
  console.log("requireUser,  req.user,", req.user);
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}
