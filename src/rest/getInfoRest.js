import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"
import {validId, validOptionalOid, validOptionalQ, validPath} from "../validations"
import regexEscape from "regex-escape"

const searchMixin = {projection: {path: 1, type: 1, "fragment.name": 1, "leftSelection.name": 1, "rightSelection.name": 1, "equivSelection.name": 1}}

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

router.get("/api/info/check/:path",
    validPath,
    run(filter => col(ENV.DB_COLLECTION).countDocuments(filter, {limit: 1})),
    run(count => ({available: count === 0}))
)

router.get("/api/info",
    validOptionalOid,
    validOptionalQ,

    run(({oid, q}) => {

        const filter = {}

        if (oid !== undefined) filter.oid = oid
        if (q !== undefined) {
            filter.$text = {$search: q}
        }

        return col(ENV.DB_COLLECTION)
            .find(filter, searchMixin)
            .sort({_id: -1})
            .toArray()
    }),
)