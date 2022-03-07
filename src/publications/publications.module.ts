import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsRepository } from './publications.repository';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicationsRepository]),
    AuthModule,
    FilesModule,
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
