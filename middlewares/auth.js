const jwt = require("jsonwebtoken");
const { infConect } = require("../config/secret");

//* cheack if user have token
exports.auth = async (req, res, next) => {
    let token = req.header("x-api-key");

    if (!token) {
        return res.status(401).json({ msg: "need to send token to this url" });
    }

    try {
        let decodeToken = jwt.verify(token, infConect.secretToken);
        req.tokenData = decodeToken;
        next();
    }

    catch (err) {
        res.status(401).json({ msg: "Token invalid or expired" })
    }
}

//* cheack if user is employee
exports.authEmployee = async (req, res, next) => {
    let token = req.header("x-api-key");

    if (!token) {
        return res.status(401).json({ msg: "need to send token to this url" });
    }

    try {

        let decodeToken = jwt.verify(token, infConect.secretToken);
        if (decodeToken.role == "employee" || decodeToken.role == "superAdmin") {
            req.tokenData = decodeToken;
            next();
        }

        else { return res.status(401).json({ msg: "You need to send token of employee to be here" }); }
    }

    catch (err) {
        res.status(401).json({ msg: "Token invalid (if you are a hacker) or expired!" });
    }
}

//* cheack if user is superAdmin
exports.authSuperAdmin = async (req, res, next) => {
    let token = req.header("x-api-key");

    if (!token) {
        return res.status(401).json({ msg: "need to send token to this url" });
    }

    try {
        let decodeToken = jwt.verify(token, infConect.secretToken);
        if (decodeToken.role == "superAdmin") {
            req.tokenData = decodeToken;
            next();
        }

        else { return res.status(401).json({ msg: "You need to send token of super Admin to be here" }); }
    }

    catch (err) {
        res.status(401).json({ msg: "Token invalid (if you are a hacker) or expired!" });
    }
}