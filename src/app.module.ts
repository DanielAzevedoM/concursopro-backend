import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { CategoriesModule } from './modules/categories.module';
import { QuestionsModule } from './modules/questions.module';
import { MockExamsModule } from './modules/mock-exams.module';
import { DashboardModule } from './modules/dashboard.module';
import { ReviewModule } from './modules/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrationsRun: true, // Run migrations automatically
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false, // Don't synchronize since we manage schema via migrations
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    QuestionsModule,
    MockExamsModule,
    DashboardModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
