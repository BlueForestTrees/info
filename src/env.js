const debug = require('debug')('api:info')
import {version, name} from './../package.json'

const throwit = message => {
    throw message
}

const ENV = {
    NAME: name,
    PORT: process.env.PORT || 80,

    REST_PATH: process.env.REST_PATH || "rest",

    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_NAME: process.env.DB_NAME || "BlueForestTreesDB",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT || 27017,
    DB_USER: process.env.DB_USER || "doudou",
    DB_PWD: process.env.DB_PWD || "masta",
    DB_COLLECTION: process.env.DB_COLLECTION || "info",

    NODE_ENV: process.env.NODE_ENV || null,
    VERSION: version
}

if (ENV.DB_CONNECTION_STRING) {
    delete ENV.DB_HOST
    delete ENV.DB_NAME
    delete ENV.DB_PORT
    delete ENV.DB_PWD
    delete ENV.DB_USER
}

if (debug.enabled) {
    debug({ENV})
} else {
    console.log(JSON.stringify(ENV))
}

export default ENV