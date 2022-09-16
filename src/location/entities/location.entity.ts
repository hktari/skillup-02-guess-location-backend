import { UserEntity } from '../../user/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm'

@Entity()
export class LocationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => UserEntity, (user) => user.locations)
    user: UserEntity

    @Column()
    imageUrl: string

    @Column()
    lat: number

    @Column()
    lng: number

    @Column()
    address: string
}