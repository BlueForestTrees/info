import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"

import {setUserIdIn, optionalValidDescription, optionalValidEquivId, optionalValidFragmentId, optionalValidFragmentName, optionalValidFragmentType, validId, validPath, optionalValidSelection, validType, validUser, optionalIds, validMongoId, optionalValidItemIds} from "../validations"

const router = Router()

module.exports = router

router.post("/api/info",
    validUser,
    validId,
    validType,
    validPath,

    optionalValidSelection("leftSelection"),
    optionalValidSelection("rightSelection"),
    optionalValidSelection("equivSelection"),
    optionalValidFragmentType,
    optionalValidFragmentId,
    optionalValidFragmentName,
    optionalValidDescription,
    optionalValidItemIds,
    run(setUserIdIn("oid")),
    run(info => col(ENV.DB_COLLECTION).insertOne(info).then(resp => resp.result))
)
