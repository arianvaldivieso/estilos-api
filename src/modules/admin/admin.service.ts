import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { from, lastValueFrom } from 'rxjs';

/**
 * Service for handling administrative tasks.
 */
@Injectable()
export class AdminService {
  /**
   * Constructor of the AdminService.
   * @param {Repository<Page>} pageRepository - Repository for the Page entity.
   */
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  /**
   * Retrieves a page based on its slug.
   * @param {string} slug - Slug of the page.
   * @returns {Promise<Page>} - Promise resolved with the Page entity.
   */
  async getPage(slug: string): Promise<Page> {
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
