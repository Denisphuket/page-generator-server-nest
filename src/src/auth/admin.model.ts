import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Admin extends Model<Admin> {
  @Column({ unique: true })
  username: string;

  @Column
  password: string;
}
