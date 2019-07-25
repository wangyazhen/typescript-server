import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'

import { Article } from '../models/article'


@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(type => Article, article => article.tags)
  @JoinTable()
  articles: Article[]

}
