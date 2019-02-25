import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"

import {
    setUserIdIn,
    validId,
    validPath,
    validUser,
    optionalValidFragmentType,
    optionalValidFragmentId, validOwner, optionalValidSelection, optionalValidDescription, optionalValidFragmentName, optionalIds, validMongoId, optionalValidItemIds
} from "../validations"

const router = Router()

module.exports = router

router.put("/api/info",
    validId,
    validPath.optional(),
    optionalValidSelection("leftSelection"),
    optionalValidSelection("rightSelection"),
    optionalValidSelection("equivSelection"),
    optionalValidFragmentType,
    optionalValidFragmentId,
    optionalValidFragmentName,
    optionalValidDescription,
    optionalValidItemIds,
    validUser,
    validOwner(col(ENV.DB_COLLECTION)),
    run(setUserIdIn("oid")),
    run(info => col(ENV.DB_COLLECTION).updateOne({_id: info._id}, {$set: info}).then(resp => resp.result))
)