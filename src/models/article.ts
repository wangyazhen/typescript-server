import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Contains, Max, Min, IsInt, Length, IsDate } from 'class-validator'

import { Tag } from '../models/tag'


@Entity('article')
export class Article {
  @Column()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(3, 50)
  title: string

  @Column()
  description: string

  @Column()
  // @IsDate()
  createTime: Date

  // @Column({ nullable: true, type: "numeric", array: true })
  @Column("simple-array")
  tagIds?: number[]

  @ManyToMany(type => Tag, tag => tag.articles)
  @JoinTable()
  tags: Tag[]

  @Column({ nullable: true })
  // @IsDate()
  updateTime?: Date

  @Column({ nullable: true })
  authorId?: number

  @Column({ nullable: true })
  authorName?: string

  @Column({ type: 'mediumtext' })
  content: string

  @Column({ default: 1 })
  @Min(0)
  @IsInt()
  viewCount: number

  @Column({ default: 1 })
  @IsInt()
  @Min(0)
  commentCount: number

  @Column({ default: 1 })
  @IsInt()
  @Min(0)
  commentLikeCount: number


}
