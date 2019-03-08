import {PATH_IDX_NAME} from "./const"

export default err => {
    if (err.code === 11000) {
        err.status = 400
        if (err.errmsg && err.errmsg.indexOf(`${PATH_IDX_NAME} dup key`) > -1) {
            err.body = {errorCode: 5, message: "path allready exists"}
        } else {
            err.body = {errorCode: 1, message: "L'élément existe déjà"}
        }
    } else if (err.code === 'bf403') {
        err.status = 403
        err.body = {errorCode: 3, message: "Réservé au propriétaire ou au super-utilisateur."}
    } else if (err.code === 'bf401') {
        err.status = 401
        err.body = {errorCode: 4, message: "Authentification requise."}
    } else if (err.code === 'bf404') {
        err.status = 404
        err.body = {errorCode: 4, message: "Introuvable."}
    }
}