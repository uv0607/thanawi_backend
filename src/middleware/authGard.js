const Auth = require("../middleware/jwtToken");

async function AuthValidator(req, res, next) {
  try {
    let authBearer = req.headers["authorization"];
    if (!authBearer) {
      return res
        .status(403)
        .send({ status: "error", message: "Auth token not found" });
    }
    let authorization = authBearer.replace("Bearer ", "");
    if (!authorization) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    let [error, response] = await Auth.verifyToken(authorization)
      .then((decodedToken) => [null, decodedToken])
      .catch((error) => [error]);

    if (error) {
      return res.status(403).json({ status: "error", message: error.message });
    }

    req.user_id = response._id;

    next();
  } catch (err) {
    return res
      .status(500)
      .send({ status: "error", message: err.message || err });
  }
}

module.exports = {
  AuthValidator,
};
