import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/entities/user.entity';

export const ROLES_KEY = 'unique_roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
