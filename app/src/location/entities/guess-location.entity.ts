import { UserEntity } from '../../user/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { LocationEntity } from './location.entity'


@Entity()
export class GuessLocationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => UserEntity, (user) => user.guesses, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: UserEntity

    @ManyToOne(() => LocationEntity, (location) => location.guesses, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    location: LocationEntity

    @Column({
        type: 'float'
    })
    lat: number

    @Column({
        type: 'float'
    })
    lng: number

    @Column()
    address: string

    @Column({
        type: 'float',
        nullable: false
    })
    errorInMeters: number

    @CreateDateColumn()
    createdDate: Date

}