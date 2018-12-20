const debug = require('debug')('api:info')
import {version} from './../package.json'

const ENV = {
    PORT: process.env.PORT || 80,
    
    REST_PATH: process.env.REST_PATH || "rest",
    
    DB_NAME: process.env.DB_NAME || "BlueForestTreesDB",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT || 27017,
    DB_USER: process.env.DB_USER || "doudou",
    DB_PWD: process.env.DB_PWD || "masta",
    DB_COLLECTION: process.env.DB_COLLECTION || "info",
    
    NODE_ENV: process.env.NODE_ENV || null,
    VERSION: version
}

debug({ENV})

export default ENV