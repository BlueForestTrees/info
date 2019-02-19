import ENV from "./env"
import {col} from "mongo-registry"
import {PATH_IDX_NAME} from "./const"

export const registry = [
    {
        version: "0.0.3",
        log: "Info.path: index unique",
        script: () => col(ENV.DB_COLLECTION).createIndex({"path": 1}, {unique: true, name: PATH_IDX_NAME})
    },
    {
        version: "0.0.9",
        log: "search (path, description, names) IDX",
        script: () => col(ENV.DB_COLLECTION).createIndex({
            path: 1, description: 1, "fragment.name": 1,
            "leftSelection.name": 1,
            "rightSelection.name": 1,
            "equivSelection.name": 1,
        }, {name: "searchIDX"})
    }
]