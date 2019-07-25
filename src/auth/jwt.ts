import * as expressJwt from 'express-jwt'
import { secretKey as secret } from '../config'

const jwtAuth = expressJwt({
    secret,
    credentialsRequired: true,
}).unless({
    path: [
        '/login',
        '/register',
    ]
})

export default jwtAuth
