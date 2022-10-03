import { UserEntity } from '../../user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GuessLocationEntity } from './guess-location.entity';

@Entity()
export class LocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.locations)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(
    () => GuessLocationEntity,
    (guessLocation) => guessLocation.location,
    {
      cascade: true,
    },
  )
  guesses: GuessLocationEntity[];

  @Column()
  imageUrl: string;

  @Column({
    type: 'float',
  })
  lat: number;

  @Column({
    type: 'float',
  })
  lng: number;

  @Column()
  address: string;

  @CreateDateColumn()
  createdDate: Date;
}
