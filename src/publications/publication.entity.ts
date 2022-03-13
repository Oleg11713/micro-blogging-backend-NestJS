import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Publication {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
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
