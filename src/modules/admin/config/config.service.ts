import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConfigDto } from '../dto/config/create-config.dto';
import { from, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalConfig } from '../entities/global-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(GlobalConfig)
    private configRepository: Repository<GlobalConfig>,
  ) {}

  async create(createConfigDto: CreateConfigDto) {
    const globalConfig = await this.finOneByKeyAndModule(
      createConfigDto.key,
      createConfigDto.module,
    );

    if (globalConfig) {
      throw new BadRequestException('The Config exist');
    }

    return await lastValueFrom(
      from(this.configRepository.save(createConfigDto)),
    );
  }

  async finOneByKeyAndModule(key: string, module: string) {
    const globalConfig = await lastValueFrom(
      from(
        this.configRepository.findOne({
          where: {
            key: key,
            module: module,
          },
        }),
      ),
    );

    return globalConfig;
  }

  async findAll(module: string) {
    return await lastValueFrom(
      from(
        this.configRepository.find({
          where: {
            module: module,
          },
        }),
      ),
    );
  }
}
