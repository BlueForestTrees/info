import {Router, run} from "express-blueforest"
import ENV from "./../env"
import {createSender} from "simple-rbmq"

import {set, setUserIdIn, optionalValidDescription, optionalValidFragmentId, optionalValidFragmentName, optionalValidFragmentType, validId, validPath, optionalValidSelection, validType, validUser, optionalValidItemIds} from "../validations"

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
    run(set("date", () => new Date())),
    run(createSender(ENV.RB.exchange, ENV.RK_INFO_UPSERT))
)
