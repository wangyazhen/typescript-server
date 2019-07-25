import { JsonController, Get, Param, Post, Put, Delete, Body } from 'routing-controllers'
import { getRepository, getManager } from 'typeorm'
import { Role } from '../models/role'


@JsonController('/roles')
export class RoleController {

  private roleRepository

  constructor() {
    this.roleRepository = getRepository(Role)
  }

  @Get('/')
  getAll() {
    return getManager().find(Role)
  }

  @Post('/')
  async save(@Body() role: Role) {
    await this.roleRepository.save(role)
    return {
      message: '创建成功'
    }
  } 
  @Put('/:id')
  async update(@Param('id') roleId: number, @Body() role: Role) {
    const roleObj = await this.roleRepository.findOne(roleId)
    roleObj.name = role.name
    roleObj.property = role.property

    await this.roleRepository.save(roleObj)
    return {
      message: '修改成功'
    }
  }
  @Delete('/:id')
  async delete(@Param('id') roleId: number) {
    const roleObj = await this.roleRepository.findOne(roleId)
    await this.roleRepository.remove(roleObj)
    return {
      message: '删除成功'
    }
  }
}
