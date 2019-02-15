import api from "../src"
import ENV from "../src/env"
import {init, withError, withTest} from "test-api-express-mongo"
import {createStringObjectId, createObjectId} from "test-api-express-mongo"
import {authGod, authSimple, god} from "./database/users"

describe('info', function () {

    beforeEach(init(api, ENV, {INFO: ENV.DB_COLLECTION}))

    const selection = ()=>({
        trunkId: createObjectId(),
        quantity: {
            bqt: Math.random(),
            g: "Mass"
        },
        repeted: true,
        freq: {
            bqt: Math.random(),
            g: "Long"
        },
        duree: {
            bqt: Math.random(),
            g: "Dens"
        },
        name: "supername" + Math.random()
    })

    const info = {
        _id: createObjectId(),
        type: "alt",
        path: "banane",
        leftSelection: selection(),
        rightSelection: selection(),
        equivSelection: selection(),
        fragment: {
            type: "impactsTank",
            _id: createObjectId(),
            name: "super info",
        },
        description: "super info description",
        items: [createObjectId(), createObjectId()]
    }
    const infoWithOwner = {...info, oid: god._id}

    it('PUT info', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: infoWithOwner
            },
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: {...infoWithOwner, path: "other!"}
            }
        },
        req: {
            url: `/api/info`,
            method: "PUT",
            headers: authGod,
            body: {
                ...info,
                path: "other!"
            }
        },
        res: {
            body: {n: 1, nModified: 1, ok: 1}
        }
    }))

    it('POST info', withTest({
        req: {
            url: "/api/info",
            method: "POST",
            body: info,
            headers: authGod
        },
        res: {
            body: {n: 1, ok: 1}
        },
        db: {
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: infoWithOwner
            }
        }
    }))

    it('PUT info bad auth', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: infoWithOwner
            },
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: infoWithOwner
            }
        },
        req: {
            url: `/api/info`,
            method: "PUT",
            headers: authSimple,
            body: {
                ...info,
                path: "other path!"
            }
        },
        res: {
            code: 403,
            bodypath: [
                {path: "errorCode", value: 3},
                {path: "message", value: "Réservé au propriétaire ou au super-utilisateur."}
            ]
        }
    }))

    it('POST info no auth', withTest({
        req: {
            url: "/api/info",
            method: "POST",
            body: {
                _id: createStringObjectId(),
                path: "banane",
                leftSelectionId: createStringObjectId(),
                rightSelectionId: createStringObjectId(),
                equivId: createStringObjectId(),
                fragmentType: "impact",
                fragmentId: createStringObjectId(),
            }
        },
        res: {
            code: 401
        }
    }))

    it('POST bad info', withTest({
        req: {
            url: "/api/info",
            method: "POST",
            body: {},
            headers: authGod
        },
        res: {
            code: 400
        }
    }))

    it('POST info with existing path', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: {
                    path: "banane"
                }
            }
        },
        req: {
            url: "/api/info",
            method: "POST",
            body: {
                ...info,
            },
            headers: authGod
        },
        res: {
            code: 400,
            body: withError(5, "path allready exists")
        }
    }))

    it('GET info by path', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: info
            }
        },
        req: {
            url: `/api/info/path/${info.path}`
        },
        res: {
            body: info
        }
    }))

    it('GET info by _id', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: infoWithOwner
            }
        },
        req: {
            url: `/api/info/${info._id}`
        },
        res: {
            body: infoWithOwner
        }
    }))

})