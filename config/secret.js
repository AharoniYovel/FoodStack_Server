require("dotenv").config();


exports.infConect = {
    name: process.env.NAME,
    password: process.env.PASSWORD,
    secretToken: process.env.SECRET_TOKEN,
    superAdminId: process.env.SUPER_ADMIN_ID
}
