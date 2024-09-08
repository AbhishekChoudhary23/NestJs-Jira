import { StoryStatus } from "src/entities/story.entity";
import { UserEntity } from "src/entities/user.entity";

export class ManagerUpdateDto{
    heading?: string;
    body?: string;
    assignee?: UserEntity | null;
    status?: StoryStatus;
}

export class DeveloperUpdateDto{
status: StoryStatus.IN_TESTING | StoryStatus.IN_PROGRESS;
assignee?: UserEntity;
}

export class TesterUpdateDto{
    status: StoryStatus.ACCEPTED | StoryStatus.IN_PROGRESS;
    assignee?: UserEntity;
}