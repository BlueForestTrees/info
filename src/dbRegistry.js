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
        version: "0.0.7",
        log: "text index on names & description",
        script: () => col(ENV.DB_COLLECTION).createIndex(
            {
                description: "text",
                path: "text",
                "fragment.name": "text",
                "leftSelection.name": "text",
                "rightSelection.name": "text",
                "equivSelection.name": "text"
            },
            {name: "searchInfoIdx"}
        )
    }
]