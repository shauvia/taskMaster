import { getUserById } from "#db/queries/qUsers";
import { verifyToken } from "#utils/jwt";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  //frontend
  const token = req.cookies.token;
  console.log("getUserFromToken, token", token);
  if (!token) return next();

  // no frontend
  // const authorization = req.get("authorization");
  // if (!authorization || !authorization.startsWith("Bearer ")) return next();
  // const token = authorization.split(" ")[1];
  // console.log("getUserFromToken, token", token);

  try {
    const { id } = verifyToken(token);
    console.log("getUserFromToken, id", id);
    const user = await getUserById(id);
    if (!user) {
      res.clearCookie("token");
      return next();
    }
    console.log("getUserFromToken, user", user);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.clearCookie("token");
    next();
  }
}
