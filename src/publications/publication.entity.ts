import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  images?: string;

  @Column()
  userId: number;
}
