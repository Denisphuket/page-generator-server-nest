import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Page extends Model<Page> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  path!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  html!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  images!: { [key: string]: string } | null;

  @Column(DataType.STRING)
  yandexMetrikaId!: string;
}
