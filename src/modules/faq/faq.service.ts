import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { Repository } from 'typeorm';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqsRepository: Repository<Faq>,
  ) {}

  /**
   * Creates a new FAQ.
   * @param createFaqDto Data to create the new FAQ.
   * @returns The newly created FAQ.
   */
  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    return await lastValueFrom(from(this.faqsRepository.save(createFaqDto)));
  }

  /**
   * Retrieves all FAQs.
   * @returns List of all FAQs.
   */
  async findAll(): Promise<Faq[]> {
    return await lastValueFrom(from(this.faqsRepository.find()));
  }

  /**
   * Retrieves all FAQs grouped by category.
   * @returns An object where keys are categories, and values are arrays of FAQs associated with that category.
   */
  async findAllGroupedByCategory(): Promise<{ [key: string]: Faq[] }> {
    const faqs = await this.findAll();
    const groupedByCategory = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});
    return groupedByCategory;
  }

  /**
   * Retrieves a FAQ by its ID.
   * @param id ID of the FAQ to retrieve.
   * @returns The found FAQ.
   */
  async findOne(id: number): Promise<Faq> {
    return await lastValueFrom(
      from(this.faqsRepository.findOne({ where: { id: id } })),
    );
  }

  /**
   * Updates a FAQ by its ID.
   * @param id ID of the FAQ to update.
   * @param updateFaqDto Data to update the FAQ.
   * @returns The updated FAQ.
   * @throws NotFoundException if the FAQ is not found.
   */
  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const existingFAQ = await this.findOne(id);

    if (!existingFAQ) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    const updatedFAQ = { ...existingFAQ, ...updateFaqDto };

    await this.faqsRepository.update(id, updatedFAQ);

    return await this.findOne(id);
  }

  /**
   * Removes a FAQ by its ID.
   * @param id ID of the FAQ to remove.
   * @returns A message indicating that the FAQ has been deleted.
   * @throws NotFoundException if the FAQ is not found.
   */
  async remove(id: number): Promise<boolean> {
    const deletedFAQ = await this.findOne(id);

    if (!deletedFAQ) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    await this.faqsRepository.delete(id);

    return true;
  }
}
