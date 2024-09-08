import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
import { StoryModule } from './Story/story.module';
import { StoryEntity } from './entities/story.entity';
import { UsersModule } from './Users/user.module';
import { AssigneeHistory } from './entities/assignee.entity';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    entities: [UserEntity, StoryEntity, AssigneeHistory],
    synchronize: true
  }),AuthModule, StoryModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
