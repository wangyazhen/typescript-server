import { JsonController, Get, Param, Post, Put, Delete, Body } from 'routing-controllers'
import { getRepository, getManager } from 'typeorm'
import { Tag } from '../models/tag'


@JsonController('/tags')
export class TController {

  private tagRepository

  constructor() {
    this.tagRepository = getRepository(Tag)
  }

  @Get('/')
  getAll() {
    return getManager().find(Tag)
  }

  @Post('/')
  async save(@Body() tag: Tag) {
    await this.tagRepository.save(tag)
    return {
      message: '创建成功'
    }
  } 
  @Put('/:id')
  async update(@Param('id') tagId: number, @Body() tag: Tag) {
    const tagObj = await this.tagRepository.findOne(tagId)
    tagObj.name = tag.name

    await this.tagRepository.save(tagObj)
    return {
      message: '修改成功'
    }
  }
  @Delete('/:id')
  async delete(@Param('id') tagId: number) {
    const tagObj = await this.tagRepository.findOne(tagId)
    await this.tagRepository.remove(tagObj)
    return {
      message: '删除成功'
    }
  }
}
