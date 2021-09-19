const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "A56asvft6345TEF5v4g3";

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "The petition don't have authentication header" });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);

        if (payload.exp <= moment.unix()) { //moment.unix() es la hora actual
            return res.status(404).send({ message: "Token expired" });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({ message: "Token invalid" });
    }

    req.user = payload;
    next();
};
