import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"

import {validUser, validId, validOwner} from "../validations"

const router = Router()

module.exports = router

router.delete("/api/info/:_id",
    validUser,
    validId,
    validOwner(col(ENV.DB_COLLECTION)),
    run(info => col(ENV.DB_COLLECTION).deleteOne(info).then(resp => resp.result))
)
