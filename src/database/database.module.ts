import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common/decorators/modules';
import RolesSeeder from '@core/seeders/roles.seeder';
import DepartamentSeeder from '@core/seeders/departament.seeder';

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

      dataSourceFactory: async (options) => {
        try {
          const dataSource: DataSource & SeederOptions = await new DataSource(
            options,
          ).initialize();
          await runSeeders(dataSource, {
            seeds: [RolesSeeder, DepartamentSeeder],
            factories: [],
          });
          return dataSource;
        } catch (error) {
          console.error('Error during seeding:', error);
          throw error; // Rethrow the error to prevent the application from starting with a potentially incomplete database state.
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
