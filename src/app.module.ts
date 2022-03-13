import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { PublicationsModule } from './publications/publications.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { Publication } from './publications/publication.entity';
import { User } from './auth/user.entity';
import { Comment } from './comments/comment.entity';

@Module({
  imports: [
    PublicationsModule,
    CommentsModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get('DB_URL'),
          synchronize: true,
          useUnifiedTopology: true,
          entities: [User, Publication, Comment],
        };
      },
    }),
  ],
})
export class AppModule {}
