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
    validAxisId, validOwner
} from "../validations"

const router = Router()

module.exports = router

router.put("/api/info",
    validId,
    validPath,
    validLeftSelectionId,
    validRightSelectionId,
    validEquivId,
    validAxisType,
    validAxisId,
    validUser,
    validOwner(col(ENV.DB_COLLECTION)),
    run(setUserIdIn("oid")),
    run(info => col(ENV.DB_COLLECTION).updateOne({_id: info._id}, {$set: info}).then(resp => resp.result))
)