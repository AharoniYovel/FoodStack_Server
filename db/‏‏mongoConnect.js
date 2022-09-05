// download "mongoose" model in terminal
// npm i mongoose
const mongoose = require('mongoose');
const { infConect } = require("../config/secret");

main().catch(err => console.log(err));


//                                    insted of 'test' wright your DB name
async function main() {

    //                        <<<<<<<<< connect to local DB >>>>>>>
    // await mongoose.connect('mongodb://localhost:27017/foodStack');

    //                        <<<<<< connect to my ATLAS DB >>>>>>>>
    await mongoose.connect(`mongodb+srv://${infConect.name}:${infConect.password}@cluster0.i9y4f.mongodb.net/foodStack`);

    console.log("mongo connect....to foodStack");
}

// GO TO APP.JS AND ADD THIS >>>>>>>>>>>> require("./db/mongoConnect");

//                           !DONE!