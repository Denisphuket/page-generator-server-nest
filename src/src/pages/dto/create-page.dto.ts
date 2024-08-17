import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  html: string;

  @IsOptional()
  @IsObject()
  images?: { [key: string]: string } | null;

  @IsOptional()
  @IsString()
  yandexMetrikaId?: string;
}
