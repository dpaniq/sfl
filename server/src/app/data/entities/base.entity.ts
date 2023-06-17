import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  // @PrimaryGeneratedColumn()
  @PrimaryGeneratedColumn()
  public id: number;
}
