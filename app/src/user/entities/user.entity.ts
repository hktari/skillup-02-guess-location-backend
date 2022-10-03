import { LocationEntity } from '../../location/entities/location.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Exclude } from 'class-transformer';
import { GuessLocationEntity } from '../../location/entities/guess-location.entity';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => LocationEntity, (location) => location.user)
  locations: LocationEntity[];

  @OneToMany(() => GuessLocationEntity, (guessLocation) => guessLocation.user)
  guesses: GuessLocationEntity[];
}
