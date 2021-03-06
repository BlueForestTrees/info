import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"
import {mongoId, optionnalPageSize, validADate, validAidx, validId, validOptionalOid, validOptionalQ, validPath} from "../validations"
import regexEscape from "regex-escape"

const searchMixin = {projection: {date:1, path: 1, type: 1, "fragment.name": 1, "leftSelection.name": 1, "rightSelection.name": 1, "equivSelection.name": 1}}

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
    validADate,
    optionnalPageSize,
    run(({oid, q, adate, ps}) => {

        const filter = {}

        if (oid !== undefined) filter.oid = oid
        if (q !== undefined) {
            const termFilter = {$regex: new RegExp(`^.*${regexEscape(q)}.*`, "i")}
            filter.$or = [
                {path: termFilter},
                {description: termFilter},
                {"fragment.name": termFilter},
                {"leftSelection.name": termFilter},
                {"rightSelection.name": termFilter},
                {"equivSelection.name": termFilter}
            ]
        }
        if (adate !== undefined) filter.date = {$lt: new Date(adate)}

        return col(ENV.DB_COLLECTION)
            .find(filter, searchMixin)
            .sort({date: -1})
            .limit(ps)
            .toArray()
    }),
)