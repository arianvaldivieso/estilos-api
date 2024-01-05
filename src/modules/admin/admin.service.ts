import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  async getPage(slug: string) {
    return await lastValueFrom(
      from(
        this.pageRepository.findOne({
          where: {
            slug: slug,
          },
        }),
      ),
    );
  }
}
