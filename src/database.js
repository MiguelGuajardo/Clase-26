const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
.then(db => console.log("Base de Datos mongoDB conectada"))
.catch(err => console.error(err))