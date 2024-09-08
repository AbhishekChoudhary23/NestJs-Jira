import { StoryStatus } from "src/entities/story.entity";
import { UserRole } from "src/entities/user.entity";
import { isValidStatusTransition } from "./isValidateStatusTransition";
import { ForbiddenException } from "@nestjs/common";

export function checkStatusTransition(role: UserRole, currentStatus: StoryStatus, updateStatus: StoryStatus): void {
    if (!isValidStatusTransition(role, currentStatus, updateStatus)) {
      throw new ForbiddenException(`Invalid status transition for ${role}.`);
    }
  }