import 'reflect-metadata'
import { createExpressServer, Action } from 'routing-controllers'
import {createConnection, Connection, getManager, getRepository} from 'typeorm'
import { Token } from './models/token'
import { secretKey } from './config'
import * as jwt from 'jsonwebtoken'
import { User } from './models/user'

(async () => {
  const connection: Connection = await createConnection()
  console.log('database 连接成功')
})()


const app = createExpressServer({
  controllers: [`${__dirname}/controllers/**/*{.js,.ts}`],
  authorizationChecker: async (action: Action, roles: string[]) => {
    const token = action.request.headers['token']
    try {
      const decoded = jwt.verify(token, secretKey)
      console.log('token 正常：', decoded)
      return true
    } catch (err) {
      console.log('token 错误:', err.message)
      return false
    }
  },
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers['token']
    const dbToken = await getRepository(Token).findOne({ token })
    console.log('current user:', token)
    return await getRepository(User).findOne(dbToken.userId)
  }
})

export default app
