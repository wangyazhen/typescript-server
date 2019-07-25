import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { User } from './user'

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  property: string


  @ManyToOne(type => User, user => user.roles)
  user: User
}
