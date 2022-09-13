import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send("Access denied.No token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
}

export default auth;
