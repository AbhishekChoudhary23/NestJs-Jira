import { ForbiddenException } from "@nestjs/common";
import { UserRole } from "src/entities/user.entity";

export function checkRole(role: UserRole, requiredRole: UserRole): void {
    if (role !== requiredRole) {
      throw new ForbiddenException(`You do not have permission to perform this action.`);
    }
  }