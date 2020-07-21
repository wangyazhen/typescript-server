import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

// 管理员admin 和 操作员operator 和普通用户user
enum UserType {
  admin = "admin",
  operator = "operator",
  user = "user"
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  // 登录名
  @Column()
  username: string

  @Column()
  nickname: string

  @Column()
  password: string

  @Column()
  userType: string

  @Column()
  createTime: number

  // 最新登录时间
  @Column()
  lastLoginTime: number

}
