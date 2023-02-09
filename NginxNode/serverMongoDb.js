const express = require("express")
const {engine: exphbs} = require("express-handlebars")
const session = require("express-session")
const {config} = require("./src/config/index")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const auth  = require("./src/routes/authRouter")
const MongoStore = require("connect-mongo")
const { fork } = require("child_process")
const compression = require("compression")
const Logger = require("./src/utils/logger")
const logger = new Logger()


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
        mongoUrl: config.DATABASE.mongo.mongoUrl,
        dbName: config.DATABASE.mongo.mongoDbName,
        mongoOptions,
        ttl: 60,
        collectionName: config.DATABASE.mongo.mongoCollectionName
    }),
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized: false,
    rolling:true,
    cookie: {
        maxAge:60000
    }
}
app.use(session(sessionConfig))

app.use(session({
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser("secrett"))

app.use(express.static('./public'))


/* Routes */
app.use("/", auth)

app.get("/info", (req,res)=>{
    const data = INFO
    logger.info(JSON.stringify(data))
    res.render("info", {data})
})
app.get("/infozip",compression(), (req,res)=>{
    const data = INFO
    res.render("info", {data})
})

app.get("/randoms",(req,res)=>{
    const cant = req.query.cant || 10000
    const subProcess = fork("randomNumbers.js")
    const PORT = parseInt(process.argv[2]) || 8080
    const PROCESSID = process.pid
    subProcess.send(cant)
    logger.info(`port: ${PORT} -> Fyh: ${Date.now()}`)
    subProcess.on("message",(cant)=>{
        res.render("randoms", { data: cant , PORT, PROCESSID})
    })
})
app.all("*",(req,res)=>{
    const {method, url} = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.render("404")
})

/* Server Listen */

const server = app.listen(config.SERVER.PORT, () => {
    logger.info(`Escuchando en el puerto ${config.SERVER.PORT}`)
});
server.on("error", (error) => logger.error(`Error en servidor ${error}`));

/* const os = require('os')
const cluster = require("cluster")

if (config.SERVER.MODE === 'CLUSTER' && cluster.isPrimary) {        
    const numCPUs = os.cpus().length
    logger.info(`CLUSTER corriendo en nodo primario ${process.pid} - Puerto ${config.SERVER.PORT}`)
    logger.info(`Número de procesadores: ${numCPUs}`)
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${worker.process.pid} finalizado`)
        cluster.fork()
    });
        
} else {
    const server = app.listen(config.SERVER.PORT, () => {
        logger.info(`Proceso #${process.pid} escuchando en el puerto ${config.SERVER.PORT}`)
    });
    server.on("error", (error) => logger.error(`Error en servidor ${error}`));
}
 */
