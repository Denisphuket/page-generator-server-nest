import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {PagesService} from "./pages.service";
import {Page} from "./page.model";
import {PagesController} from "./pages.controller";


@Module({
  imports: [SequelizeModule.forFeature([Page])],
  providers: [PagesService],
  controllers: [PagesController],
})
export class PagesModule {}
