import { JsonController, Get, Post, Put, Delete, Body, Param, QueryParam, QueryParams } from 'routing-controllers'
import { getRepository, Repository, Not, MoreThan } from 'typeorm'
import { validate } from 'class-validator'

import { Article } from '../models/article'
import { Tag } from '../models/tag'

class ArticleQuery {
    start: number
    limit: number
}

@JsonController('/articles')
export class ArticleController {
    private articleRepository: Repository<Article>

    constructor() {
        this.articleRepository = getRepository(Article)
    }

    @Get('/')
    async queryArticle(@QueryParams() query: ArticleQuery) {
        const [data, count] = await this.articleRepository.findAndCount({
            // 大于 0 的过滤
            where: {
                status: Not(MoreThan(0)),
            },
            skip: query.start || 0,
            take: query.limit || 10,
            cache: true,
            order: {
                createTime: "DESC",
            },
        })
        return {
            data,
            size: query.limit,
            total: count,
        }
    }

    @Post('/')
    async createArticle(@Body() article: Article) {
        article.createTime = new Date()
        article.updateTime = new Date()
        const errors = await validate(article)
        if (errors.length > 0) {
            console.log('验证错误信息:', errors)
            return "验证失败"
        } else {
            // article.tags = await getRepository(Tag).findByIds(article.tagIds)
            await this.articleRepository.save(article)
            return article
        }
    }

    @Delete('/:id')
    async deleteOne(@Param('id') id: number) {
        // 状态改为 1
        const art = await this.articleRepository.findOne(id)
        art.status = 1
        await this.articleRepository.save(art)
        return {
            errno: 0,
            message: '删除成功',
        }
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        return this.articleRepository.createQueryBuilder()
            .whereInIds([id])
            .addSelect("Article.content")
            .getOne()
    }
}
