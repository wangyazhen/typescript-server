import { JsonController, Param, Body, Get, Post, Put, Delete, Authorized, CurrentUser, HeaderParam } from "routing-controllers"
import * as jwt from 'jsonwebtoken'
import { secretKey } from '../config'
import { getManager, getConnection, getRepository } from 'typeorm'
import {User} from '../models/user'
import { Role } from '../models/role'
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
    // return getConnection().manager.find(User)
    // return getManager().find(User)
    return this.userRepository.find({ relations: ["roles"] })
  }

  @Authorized()
  @Get('/:id')
  getOne(@Param('id') id: number) {    
    return this.userRepository.findOne(id, { relations: ['roles'] })
  }

  @Authorized()
  @Get('/profile')
  userProfile(@CurrentUser() user: any) {
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
      expiresIn: 60 // 授权时效24小时
    })
    const tokenModel = new Token()
    tokenModel.userId = userObj.id
    tokenModel.token = token
    await getRepository(Token).save(tokenModel)

    return {
      code: 0,
      message: '登录成功',
      data: {
        username: tokenObj.username,
        token,
      }
    }
  }

  @Post('/logout')
  async logout(@HeaderParam('token') token: string) {
    const dbToken = getRepository(Token).find({token})
    console.log('退出：', token)
    return dbToken
  }

  @Post('/')
  async create(@Body() user: User) {
    const roleRepository = getRepository(Role)
    const roleObj = await roleRepository.findOne(user.roleId)
    user.roles = [roleObj]
    user.userType = roleObj.property
    user.createTime = new Date()
    await this.userRepository.save(user)
    return {
      message: '创建成功'
    }
  }

  @Put('/:id')
  async update(@Param('id') id:number, @Body() user: any) {
    const userObj = await this.userRepository.findOne(id)
    userObj.name = user.name

    await this.userRepository.save(userObj)
    return await this.userRepository.findOne(id)
  }

  @Delete('/:id')
  async delete(@Param('id') id: number ) {
    const userObj = await this.userRepository.findOne(id)
    await this.userRepository.remove(userObj)
    return "删除成功"
  }
}
