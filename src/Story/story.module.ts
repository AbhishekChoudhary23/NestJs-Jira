import { Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoryEntity } from "src/entities/story.entity";
import { UserEntity } from "src/entities/user.entity";
import { UsersService } from "src/Users/users.service";
import { UsersModule } from "src/Users/user.module";
import { UserController } from "src/Users/user.controller";
import { AssigneeGuard } from "../Guards/assignee.guard";
import { AssigneeHistory } from "src/entities/assignee.entity";


@Module({
    imports:[TypeOrmModule.forFeature([StoryEntity, UserEntity, AssigneeHistory]), UsersModule],
    controllers: [StoryController, UserController],
    providers: [StoryService,AssigneeGuard, UsersService]
})

export class StoryModule{}