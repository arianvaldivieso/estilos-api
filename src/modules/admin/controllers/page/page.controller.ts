import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { AuthGuard } from 'modules/auth/auth.guard';
import { PageAdminService } from 'modules/admin/services/page-admin/page-admin.service';
import { Page } from 'modules/page/entities/page.entity';
import { UpdatePageDto } from 'modules/admin/dto/page/update-page.dto';

@Controller('admin/page')
@UseGuards(AuthGuard)
@UseInterceptors(StandardResponseInterceptor)
export class PageController {
  constructor(private pageAdminService: PageAdminService) {}

  /**
   * Retrieves all pages for administrators.
   * @returns {Promise<Page[]>} - Promise resolved with an array of all pages for administrators.
   */
  @Get()
  async findAll(): Promise<Page[]> {
    try {
      const pages: Page[] = await this.pageAdminService.findAll();
      return pages;
    } catch (error) {
      console.error(
        'Error while fetching all pages for administrators:',
        error,
      );
      throw new Error('Failed to fetch all pages for administrators.');
    }
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.pageAdminService.findOneBySlug(slug);
  }

  /**
   * Updates a page based on its slug.
   * @param {string} slug - The slug of the page to be updated.
   * @param {UpdatePageDto} updatePageDto - Partial data to update the page.
   * @returns {Promise<Page>} - Promise resolved with the updated page.
   */
  @Put(':slug')
  async updatePage(
    @Param('slug') slug: string,
    @Body() updatePageDto: UpdatePageDto,
  ): Promise<Page> {
    const updatedPage: Page = await this.pageAdminService.updatePageBySlug(
      slug,
      updatePageDto,
    );

    return updatedPage;
  }
}
