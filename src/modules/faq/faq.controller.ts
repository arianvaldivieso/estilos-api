import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';

@Controller('faq')
@UseInterceptors(StandardResponseInterceptor)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  /**
   * Endpoint to create a new FAQ.
   * @param createFaqDto Data for creating the new FAQ.
   * @returns The newly created FAQ.
   */
  @Post()
  create(@Body() createFaqDto: CreateFaqDto): Promise<Faq> {
    return this.faqService.create(createFaqDto);
  }

  /**
   * Endpoint to retrieve all FAQs.
   * @returns List of all FAQs.
   */
  @Get()
  findAll(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

  /**
   * Endpoint to retrieve all FAQs grouped by category.
   * @returns An object where keys are categories, and values are arrays of FAQs associated with that category.
   */
  @Get('group')
  async findAllGroupedByCategory(): Promise<{ [key: string]: Faq[] }> {
    return this.faqService.findAllGroupedByCategory();
  }

  /**
   * Endpoint to retrieve a specific FAQ by its ID.
   * @param id ID of the FAQ to retrieve.
   * @returns The found FAQ.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Faq> {
    return this.faqService.findOne(+id);
  }

  /**
   * Endpoint to update a specific FAQ by its ID.
   * @param id ID of the FAQ to update.
   * @param updateFaqDto Data to update the FAQ.
   * @returns The updated FAQ.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ): Promise<Faq> {
    return this.faqService.update(+id, updateFaqDto);
  }

  /**
   * Endpoint to remove a specific FAQ by its ID.
   * @param id ID of the FAQ to remove.
   * @returns A message indicating that the FAQ has been deleted.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.faqService.remove(+id);
  }
}
