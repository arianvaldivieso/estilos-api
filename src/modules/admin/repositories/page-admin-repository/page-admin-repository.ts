import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'modules/page/entities/page.entity';
import { Repository } from 'typeorm';

export class PageAdminRepository extends Repository<Page> {
  constructor(
    @InjectRepository(Page)
    private repository: Repository<Page>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
