import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"
import {createSender} from "simple-rbmq"

import {
    setUserIdIn,
    validId,
    validPath,
    validUser,
    optionalValidFragmentType,
    optionalValidFragmentId, validOwner, optionalValidSelection, optionalValidDescription, optionalValidFragmentName, optionalIds, validMongoId, optionalValidItemIds, set
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
    run(set("date", () => new Date())),
    run(createSender(ENV.RB.exchange, ENV.RK_INFO_UPSERT))
)