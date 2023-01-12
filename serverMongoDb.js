const express = require("express")
const {engine: exphbs} = require("express-handlebars")
const session = require("express-session")
const {config} = require("./src/config/index")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const auth  = require("./src/routes/index")
const MongoStore = require("connect-mongo")


const app = express()


require("./src/database")
require("./src/passport/local-auth")

/* Config hbs */
app.engine("hbs", exphbs({extname: ".hbs", defaultLayout: "main.hbs"}))
app.set("view engine", ".hbs")

/* middlewares */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const sessionConfig ={
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://MiguelG:UfI7qc6DpKVVGHJG@cluster0.9ejc0ij.mongodb.net/Test",
        dbName: "Backend_Test",
        mongoOptions,
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: `secret2584565`,
    resave: false,
    saveUninitialized: false,
    rolling:true,
    cookie: {
        maxAge:60000
    }
}
app.use(session(sessionConfig))

app.use(session({
    secret: process.env.CODE_SECRET,
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser("secrett"))

app.use(express.static('./public'))


/* Routes */
app.use("/", auth)


/* Server Listen */


const server = app.listen(config.SERVER.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));