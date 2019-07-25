import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import { Role } from './role'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  nickname: string

  @Column()
  password: string

  @Column()
  roleId: string

  @Column()
  userType: string

  @Column()
  createTime: Date

  @OneToMany(type => Role, role => role.user)
  roles: Role[]
}
