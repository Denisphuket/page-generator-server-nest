import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { Page } from './page.model';
import { CreatePageDto } from './dto/create-page.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/api/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllPages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Убедитесь, что page и limit корректные числа
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Page and limit query parameters must be valid numbers.');
    }

    const { count, rows } = await this.pagesService.findAll(
      pageNumber,
      limitNumber,
    );

    const pages = rows;

    return {
      pages,
      total: count,
      page: pageNumber,
      pagesCount: Math.ceil(count / limitNumber),
    };
  }

  @Get(':path')
  async findOne(@Param('path') path: string) {
    return this.pagesService.findOne(path);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrUpdatePage(@Body() createPageDto: CreatePageDto) {
    const page = await this.pagesService.createOrUpdate(createPageDto);
    return page instanceof Page ? page?.toJSON() : {}; // Преобразуем модель в простой объект перед возвратом
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: number) {
    return this.pagesService.delete(id);
  }
}
