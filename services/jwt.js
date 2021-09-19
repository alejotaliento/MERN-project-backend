const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "A56asvft6345TEF5v4g3";

exports.createAccessToken = (user) => {
  //token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = (user) => {
  const payload = {
    id: user._id,
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.decodeToken = (token) => {
  return jwt.decode(token, SECRET_KEY, true);
};
