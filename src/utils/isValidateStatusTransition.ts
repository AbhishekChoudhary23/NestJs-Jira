import { StoryStatus } from "src/entities/story.entity";
import { UserRole } from "src/entities/user.entity";

export function isValidStatusTransition(role: UserRole, currentStatus: StoryStatus, updateStoryStatus: StoryStatus): boolean {
    switch (role) {
      case UserRole.DEVELOPER:
        return (
          (currentStatus === StoryStatus.TODO && updateStoryStatus === StoryStatus.IN_PROGRESS) ||
          (currentStatus === StoryStatus.IN_PROGRESS && updateStoryStatus === StoryStatus.IN_TESTING)
        );
      case UserRole.TESTER:
        return (
          (currentStatus === StoryStatus.IN_TESTING && updateStoryStatus === StoryStatus.IN_PROGRESS) ||
          (currentStatus === StoryStatus.IN_TESTING && updateStoryStatus === StoryStatus.ACCEPTED)
        );
      case UserRole.MANAGER:
        return currentStatus === StoryStatus.ACCEPTED && updateStoryStatus === StoryStatus.DONE;
      default:
        return false;
    }
  }