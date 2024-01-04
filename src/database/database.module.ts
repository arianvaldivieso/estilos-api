import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common/decorators/modules';
import RolesSeeder from '@core/seeders/roles.seeder';

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
        dropSchema: true,
      }),
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource: DataSource & SeederOptions = await new DataSource(
          options,
        ).initialize();
        await runSeeders(dataSource, {
          seeds: [RolesSeeder],
          factories: [],
        });
        return dataSource;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
