import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"
import {validId, validOid, validPath} from "../validations"


const router = Router()

module.exports = router

router.get("/api/info/:_id",
    validId,
    run(filter => col(ENV.DB_COLLECTION).findOne(filter))
)

router.get("/api/info/path/:path",
    validPath,
    run(filter => col(ENV.DB_COLLECTION).findOne(filter))
)

router.get("/api/info/owner/:oid",
    validOid,
    run(filter => col(ENV.DB_COLLECTION).find(filter).toArray())
)