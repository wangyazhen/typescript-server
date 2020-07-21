import {JsonController, Get, Post, Put, Delete, Body, Param, QueryParams, Authorized} from 'routing-controllers'
import { getRepository, Repository, Equal, Not, MoreThan, Like } from 'typeorm'
import { validate } from 'class-validator'
import showdown from 'showdown'
const showdown = require('showdown')
import { Article } from '../models/article'
const converter = new showdown.Converter()

class ArticleQuery {
    start: number
    limit: number
    title?: string
    status?: number
}

@Authorized()
@JsonController('/articles')
export class ArticleController {
    private articleRepository: Repository<Article>

    constructor() {
        this.articleRepository = getRepository(Article)
    }

    @Get('/')
    async queryArticle(@QueryParams() query: ArticleQuery) {
        console.log('参数：', query)
        const [data, count] = await this.articleRepository.findAndCount({
            where: query.title ? {
                status: Equal(query.status),
                title: Like(query.title)
            } : {
                status: Equal(query.status),
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
        const errors = await validate(article)
        if (errors.length > 0) {
            console.log('验证错误信息:', errors)
            return "验证失败"
        } else {
            await this.articleRepository.save(article)
            return article
        }
    }

    @Put('/:id')
    async updateOne(@Param('id') id: number, @Body() articleDto: Article) {
        const article = await this.articleRepository.findOne(id)
        return await this.articleRepository.save({...article, ...articleDto})
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

    @Get('/:id/html')
    async getOneHtml(@Param('id') id: number) {
        const article = await this.articleRepository.createQueryBuilder()
            .whereInIds([id])
            .addSelect("Article.content")
            .getOne()
        const html = converter.makeHtml(article.content)
        return {
            ...article,
            html
        }
    }
}
