import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Page } from './page.model';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page)
    private readonly pageModel: typeof Page,
  ) {}

  async findAll(page: number, limit) {
    return this.pageModel.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
  }

  async findOne(path: string) {
    const page = await this.pageModel.findOne({ where: { path } });
    return {
      id: page.id,
      title: page.title,
      path: page.path,
      html: page.html,
      images: page.images,
      yandexMetrikaId: page.yandexMetrikaId,
    };
  }

  async createOrUpdate(createPageDto: CreatePageDto): Promise<Page> {
    const { title, path, html, images, yandexMetrikaId } = createPageDto;

    let page = await this.pageModel.findOne({ where: { path } });

    if (page) {
      // Обновление существующей страницы
      page.title = title;
      page.html = html;
      page.yandexMetrikaId = yandexMetrikaId;

      // Проверка на пустое значение images
      // if (images !== {}) {
      //   page.images = images;
      // }

      await page.save();
    } else {
      // Создание новой страницы
      page = await this.pageModel.create({
        title,
        path,
        html,
        images,
        yandexMetrikaId,
      });
    }

    return page;
  }

  async delete(id: number) {
    return this.pageModel.destroy({ where: { id } });
  }
}
