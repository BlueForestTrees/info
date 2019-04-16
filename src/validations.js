import {check, body} from 'express-validator/check'
import {objectNoEx, object} from "mongo-registry"
import {run} from "express-blueforest"
import {decode} from "jsonwebtoken"

const debug = require('debug')(`api:info:validation`)

export const X_ACCESS_TOKEN = "x-access-token"
const fragmentTypes = ["facet", "impactsTank", "tank"]
const types = ["eq", "alt", "comp", "gr"]
const grandeursKeys = ["NO", "D", "AL", "TU", "Ene1", "Ene2", "Dens", "Nomb", "Volu", "Duré", "Mass", "Surf", "Long", "Pri1", "Pri2", "Tran"]

const grandeur = chain => chain.isIn(grandeursKeys).withMessage("should be Mass, Dens, Long, Tran...")

export const validUser = (req, res, next) => {
    let token = decode(req.headers[X_ACCESS_TOKEN])
    if (!token || !token.user) {
        throwErr("Pas authentifié", "bf401")
    }
    req.user = token.user
    req.user._id = object(req.user._id)
    if (debug.enabled) {
        debug({USER: req.user})
    }
    next()
}

export const setUserIdIn = field => (o, req) => {
    o[field] = req.user && req.user._id
    return o
}

export const set = (field, clb) => o => {
    o[field] = clb()
    return o
}

export const validOwner = (col, field = "_id") => run(async (o, req) => {
    const doc = await col.findOne({_id: o[field]})
    const validOwner =
        (!doc && "no doc")
        ||
        (req.user._id.equals(doc.oid) && "owner")
        ||
        (req.user.rights && req.user.rights.charAt(0) === 'G' && "god")

    debug('{validOwner:{_id:"%s", oid:"%s", validity:"%s"}}', o[field], req.user._id, validOwner)

    validOwner || throwErr("Non autorisé", "bf403")

    return o
})

const number = chain => chain.exists().custom(v => !isNaN(Number.parseFloat(v))).withMessage("must be a valid number").customSanitizer(Number.parseFloat)
export const mongoId = chain => chain.exists().isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)

export const validMongoId = field => mongoId(check(field))

export const validId = validMongoId("_id")
export const validAidx = validMongoId("aidx").optional()
export const validADate = check("adate").optional().isISO8601()
export const validOid = validMongoId("oid")
export const validOptionalOid = validMongoId("oid").optional()
export const validOptionalQ = check('q').optional().exists().isLength({min: 1, max: 30})


export const validType = check("type").exists().isIn(types).withMessage("should be eq, alt, gr or comp")
export const validPath = check("path").exists().isLength({min: 1, max: 20})
export const optionalValidEquivId = validMongoId("equivId").optional()
export const optionalValidFragmentType = check("fragment.type").optional().exists().isIn(fragmentTypes).withMessage("should be facets, impactsTank, tank")
export const optionalValidFragmentId = validMongoId("fragment._id").optional()
export const optionalValidFragmentName = check("fragment.name").optional().exists().isLength({min: 1, max: 100})
export const optionalValidDescription = check("description").exists().optional()
export const optionalValidItemIds = validMongoId("items.*")


const throwErr = (name, code) => {
    const e = new Error(name)
    e.code = code
    throw e
}


export const optionalValidSelection = field => [
    mongoId(body(`${field}.trunkId`)).optional(),
    grandeur(check(`${field}.quantity.g`)).optional(),
    number(check(`${field}.quantity.bqt`)).optional(),
    check(`${field}.repeted`).exists().isBoolean().optional(),
    grandeur(check(`${field}.freq.g`)).optional(),
    number(check(`${field}.freq.bqt`)).optional(),
    grandeur(check(`${field}.duree.g`)).optional(),
    number(check(`${field}.duree.bqt`)).optional(),
    check(`${field}.name`).optional().exists().isLength({max: 30})
]

export const optionnalPageSize = [
    (req, res, next) => {
        if (!req.params.ps) {
            req.params.ps = 10
        }
        next()
    },
    check("ps").isInt({
        min: 1,
        max: 30
    }).withMessage(`must be an integer between 1 and 30 (default to ${10})`).toInt()
]