import { StoryStatus } from "src/entities/story.entity";
import { UserEntity } from "src/entities/user.entity";

export class CreateStoryDto {
    heading: string;
    body: string;
    assignee: UserEntity;
    reporter: UserEntity;
    status: StoryStatus;
  }