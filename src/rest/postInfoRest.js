import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"

import {
    setUserIdIn,
    validId,
    validPath,
    validLeftSelectionId,
    validRightSelectionId,
    validEquivId,
    validUser,
    validAxisType,
    validAxisId
} from "../validations"

const router = Router()

module.exports = router

router.post("/api/info",
    validId,
    validPath,
    validLeftSelectionId,
    validRightSelectionId,
    validEquivId,
    validAxisType,
    validAxisId,
    validUser,
    run(setUserIdIn("oid")),
    run(info => col(ENV.DB_COLLECTION).insertOne(info).then(resp => resp.result))
)