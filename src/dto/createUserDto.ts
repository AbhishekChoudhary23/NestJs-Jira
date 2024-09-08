import { UserRole } from "src/entities/user.entity";

export class CreateUserDto {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: number;
    role: UserRole;
    password: string;
  }