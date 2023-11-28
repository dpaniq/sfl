import {Generated, PrimaryGeneratedColumn} from 'typeorm';

export abstract class BaseUUIDEntity {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  public id: number;
}
