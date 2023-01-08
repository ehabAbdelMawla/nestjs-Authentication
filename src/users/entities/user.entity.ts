import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: false })
  isActive: boolean;
}
