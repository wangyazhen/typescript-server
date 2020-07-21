import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  property: string
}
