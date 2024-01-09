import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common/decorators/modules';
import RolesSeeder from 'core/seeders/roles.seeder';
import DepartamentSeeder from 'core/seeders/departament.seeder';
import PageSeeder from 'core/seeders/page-seeder';
import ConfigSeeder from 'core/seeders/config.seeder';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        name: 'default',
        dropSchema: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
