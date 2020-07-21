import { JsonController, Param, Body, Get, Post, Put, Delete, Authorized, CurrentUser, HeaderParam } from "routing-controllers"
import * as jwt from 'jsonwebtoken'
import { secretKey } from '../config'
import { getRepository } from 'typeorm'
import {User} from '../models/user'
import { Token } from '../models/token'

@JsonController('/users')
export class UserController {
  private readonly userRepository

  constructor() {
    this.userRepository = getRepository(User)
  }

  @Authorized()
  @Get('/')
  getAll() {
    return this.userRepository.find()
  }

  @Authorized()
  @Get('/:id')
  getOne(@Param('id') id: number) {    
    return this.userRepository.findOne(id)
  }

  @Authorized()
  @Get('/profile')
  userProfile(@CurrentUser() user: User) {
    return user
  }

  @Post('/login')
  async loginUser(@Body() user: any) {
    console.log('登录：', user)
    const userObj = await this.userRepository.findOne({ username: user.username })
    if (!userObj) {
      return {
        code: 1,
        message: '用户不存在'
      }
    }
    if (userObj.password !== user.password) {
      return {
        code: 1,
        message: '用户或密码错误🙅'
      }
    }

    const tokenObj = {
      username: user.username
    }

    const token = jwt.sign(tokenObj, secretKey, {
      expiresIn: 60 * 60 * 24 // 授权时效24小时
    })
    const tokenModel = new Token()
    tokenModel.userId = userObj.id
    tokenModel.token = token
    await getRepository(Token).save(tokenModel)

    return {
      code: 0,
      message: '登录成功',
      data: {
        id: userObj.id,
        username: tokenObj.username,
        nickname: userObj.nickname,
        userType: userObj.userType,
        token,
      }
    }
  }

  @Post('/logout')
  async logout(@HeaderParam('token') token: string) {
    const dbToken = await getRepository(Token).find({token})
    console.log('退出：', token)
    await getRepository(Token).remove(dbToken)
    // dbToken
    return {
      code: 0,
      message: '退出成功'
    }
  }

  @Post('/')
  async create(@Body() user: User) {
    const time = Math.floor(Date.now() / 1000)
    user.createTime = time
    user.lastLoginTime = time
    user.password = '123456'
    await this.userRepository.save(user)
    return {
      message: '创建成功'
    }
  }

  @Put('/:id')
  async update(@Param('id') id:number, @Body() user: User) {
    const userObj = await this.userRepository.findOne(id)
    userObj.nickname = user.nickname
    userObj.userType = user.userType

    return this.userRepository.save(userObj)
  }

  @Delete('/:id')
  async delete(@Param('id') id: number ) {
    const userObj = await this.userRepository.findOne(id)
    await this.userRepository.remove(userObj)
    return {
      code: 0,
      message: "删除成功",
    }
  }
}
