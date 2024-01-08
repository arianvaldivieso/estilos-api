import { Controller, Get, Param } from '@nestjs/common';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get(':slug')
  page(@Param('slug') slug: string) {
    return this.pageService.getPage(slug);
  }
}
