import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Contains, Max, Min, IsInt, Length, IsDate } from 'class-validator'

@Entity('article')
export class Article {
  @Column()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(3, 80)
  title: string

  @Column()
  description: string

  // 文章状态 0 是正常 1 是已删除 2 是草稿箱
  @Column({ default: 0 })
  @IsInt()
  status: number

  @Column()
  tags: string

  @Column()
  @IsInt()
  createTime: number

  @Column({ nullable: true })
  @IsInt()
  updateTime?: number

  @Column({ type: 'mediumtext', select: false })
  content: string

  @Column({ default: 1 })
  @Min(0)
  @IsInt()
  viewCount: number

  @Column({ default: 1 })
  @IsInt()
  @Min(0)
  commentCount: number

  // 点赞次数
  @Column({ default: 1 })
  @IsInt()
  @Min(0)
  likeCount: number

}

