import ENV from "./env"
import {dbInit} from "mongo-registry"
import {registry} from "./dbRegistry"
import startExpress from "express-blueforest"
import errorMapper from "./errorMapper"

export default dbInit(ENV, registry)
    .then(startExpress(ENV, errorMapper))
    .catch(e => console.error("BOOT ERROR\n", e))
