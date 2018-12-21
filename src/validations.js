import {check, body, param} from 'express-validator/check'
import {objectNoEx, object} from "mongo-registry"
import {run} from "express-blueforest"
import {decode} from "jsonwebtoken"

const debug = require('debug')(`api:info:validation`)

export const X_ACCESS_TOKEN = "x-access-token"
const axisTypes = ["facet", "impact", "root"]


export const validUser = run((o, req) => {
    let token = decode(req.headers[X_ACCESS_TOKEN])
    if (!token || !token.user) {
        throwErr("Pas authentifié", "bf401")
    }
    req.user = token.user
    req.user._id = object(req.user._id)
    if (debug.enabled) {
        debug({USER: req.user})
    }
    return o
})

export const setUserIdIn = field => (o, req) => {
    o[field] = req.user._id
    return o
}

export const validOwner = (col, field = "_id") => run(async (o, req) => {
    const doc = await col.findOne({_id: o[field]})
    if (doc) {
        if (req.user._id.equals(doc.oid)) {
            debug("valid owner user %o, doc %o", req.user._id, doc._id)
            return o
        } else {
            debug("invalid owner user %o, doc %o", req.user._id, doc._id)
            throwErr("invalid owner","bf403")
        }
    } else {
        debug("doc not found user %o, doc %o", req.user._id, doc._id)
        throwErr("doc not found","bf404")
    }
})

const mongoId = chain => chain.exists().isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)
export const validMongoId = field => mongoId(check(field))
export const optionalMongoId = field => validMongoId(field).optional()


export const validId = validMongoId("_id")
export const validOid = validMongoId("oid")
export const validPath = check("path").exists().isLength({min: 1, max: 20}).optional()
export const validLeftSelectionId = validMongoId("leftSelectionId").optional()
export const validRightSelectionId = validMongoId("rightSelectionId").optional()
export const validEquivId = validMongoId("equivId").optional()
export const validAxisType = check("axisType").exists().isIn(axisTypes).withMessage("should be facet, impact, root").optional()
export const validAxisId = validMongoId("axisId").optional()

const throwErr = (name, code) => {
    const e = new Error(name)
    e.code = code
    throw e
}
