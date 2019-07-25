import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'


@Entity('token')
export class Token {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    token: string
}
