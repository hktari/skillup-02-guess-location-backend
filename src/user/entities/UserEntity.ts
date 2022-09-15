import { LocationEntity } from 'src/location/entities/LocationEntity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => LocationEntity, (location) => location.user)
    locations: LocationEntity[]
}