import { JsonController, Get, Post, Put, Delete, Body, Param, QueryParam, QueryParams } from 'routing-controllers'
import { getRepository, Repository } from 'typeorm'
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
            skip: query.start || 0,
            take: query.limit || 10,
            // relations: ["tags"]
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
            // article.tagIds
            // const tags =
            // article.tags = await getRepository(Tag).findByIds(article.tagIds)
            await this.articleRepository.save(article)
            return article
        }
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        // return this.articleRepository.findOne(id)
        return this.articleRepository.createQueryBuilder()
            .whereInIds([id])
            .addSelect("Article.content")
            .getOne()
    }
}
