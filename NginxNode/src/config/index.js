const dotenv = require("dotenv")
const parseArgs = require("minimist")
dotenv.config()

const argv = parseArgs(process.argv.slice(2), {
    alias: {
        p: 'port',
        m: 'mode',
    },
    default: {
        port: 8080,
        mode: 'FORK',
    }
})
const config = {
    SERVER: {
        HOST:process.env.HOST,
        PORT: argv.port,
        MODE: argv.mode
    },
    DATABASE:{
        mongo: {
            mongoUrl:process.env.MONGO_URL,
            mongoDbName:process.env.MONGO_DB_NAME,
            mongoCollectionName: process.env.MONGO_COLLECTION_NAME,
            mongoSecret: process.env.CODE_SECRET
        }
    },
    LOGGER:{
        WINSTON: process.env.NODE_ENV
    }
}

module.exports = {config}