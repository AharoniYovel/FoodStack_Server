const indexR = require("./index");
const donatesR = require("./donates");
const volunteersR = require("./volunteers");
const employeesR = require("./employees");
const pathsR = require("./paths");
const pointsR = require("./points");

exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/donates", donatesR);
    app.use("/volunteers", volunteersR);
    app.use("/employees", employeesR);
    app.use("/paths", pathsR);
    app.use("/points",pointsR);

    app.use((req, res) => {
        res.status(404).json({ msg_err: "url not found 404" })
    });

}


exports.corsAccessControl = (app) => {
    app.all('*', (req, res, next) => {
        if (!req.get('Origin')) return next();
        res.set('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
        res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,x-api-key');
        next();
    });
}