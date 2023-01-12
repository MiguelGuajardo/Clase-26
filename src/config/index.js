const dotenv = require("dotenv")
dotenv.config()

const config = {
    SERVER: {
        PORT: process.env.PORT || 8080,
    }
}

module.exports = {config}