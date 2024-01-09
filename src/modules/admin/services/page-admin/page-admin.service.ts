import { Injectable, NotFoundException } from '@nestjs/common';
import { PageAdminRepository } from 'modules/admin/repositories/page-admin-repository/page-admin-repository';
import { Page } from 'modules/page/entities/page.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class PageAdminService {
  constructor(private pageAdminRepository: PageAdminRepository) {}

  /**
   * Retrieves a page based on its slug.
   * @param {string} slug - The unique identifier for the page.
   * @returns {Promise<Page>} - Promise resolved with the page matching the specified slug.
   * @throws {NotFoundException} - Thrown if the page with the specified slug is not found.
   */
  async findOneBySlug(slug: string): Promise<Page> {
    try {
      // Retrieve a page based on its slug from the repository
      const page: Page = await lastValueFrom(
        from(
          this.pageAdminRepository.findOne({
            where: {
              slug: slug,
            },
          }),
        ),
      );

      // Check if the page exists
      if (!page) {
        throw new NotFoundException(`Page with slug '${slug}' not found.`);
      }

      return page;
    } catch (error) {
      // Handle any potential errors during the process
      console.error(`Error while fetching page with slug '${slug}':`, error);
      throw new Error(`Failed to fetch page with slug '${slug}'.`);
    }
  }

  /**
   * Retrieves all pages.
   * @returns {Promise<Page[]>} - Promise resolved with an array of all pages.
   * @throws {NotFoundException} - Thrown if no pages are found.
   */
  async findAll(): Promise<Page[]> {
    try {
      // Retrieve all pages from the repository
      const pages: Page[] = await lastValueFrom(
        from(this.pageAdminRepository.find()),
      );

      // Check if any pages are found
      if (!pages || pages.length === 0) {
        throw new NotFoundException('No pages found.');
      }

      return pages;
    } catch (error) {
      // Handle any potential errors during the process
      console.error('Error while fetching all pages:', error);
      throw new Error('Failed to fetch all pages.');
    }
  }

  /**
   * Edits a page based on its slug.
   * @param {string} slug - The slug of the page to be edited.
   * @param {Partial<Page>} updateData - Partial data to update the page.
   * @returns {Promise<Page>} - Promise resolved with the edited page.
   * @throws {NotFoundException} - Thrown if the page with the specified slug is not found.
   */
  async updatePageBySlug(
    slug: string,
    updateData: Partial<Page>,
  ): Promise<Page> {
    try {
      // Retrieve the page based on its slug from the repository
      const existingPage: Page = await lastValueFrom(
        from(this.pageAdminRepository.findOne({ where: { slug } })),
      );

      // Check if the page exists
      if (!existingPage) {
        throw new NotFoundException(`Page with slug '${slug}' not found.`);
      }

      // Update the page data with the provided partial data
      Object.assign(existingPage, updateData);

      // Save the updated page to the repository
      const editedPage: Page = await lastValueFrom(
        from(this.pageAdminRepository.save(existingPage)),
      );

      return editedPage;
    } catch (error) {
      // Handle any potential errors during the process
      console.error(`Error while editing page with slug '${slug}':`, error);
      throw new Error(`Failed to edit page with slug '${slug}'.`);
    }
  }
}
