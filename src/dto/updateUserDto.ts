import { UserRole } from "src/entities/user.entity";

export class UpdateUserDto {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_no?: number;
    role?: UserRole
  }