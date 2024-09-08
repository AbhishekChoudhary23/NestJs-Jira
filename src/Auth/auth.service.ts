import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/Users/users.service";
import { CreateUserDto } from "src/dto/createUserDto";
import { comparePassword, hashPassword } from "src/utils/password.util";


@Injectable()
export class AuthService{
    constructor(private userService: UsersService,
                private jwtService:JwtService
    ){}

    async logIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.find(username);
        if (!user || !(await comparePassword(pass, user.password))) {
            throw new UnauthorizedException();
        }
        const { password, deleted_at, is_archived, ...result } = user;
        const payload = { id: user.id, username: user.username, role:user.role, email: user.email, firstname: user.first_name };
        return {
            user: result,
            token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(userData: CreateUserDto): Promise<any> {
        const existingUser = await this.userService.find(userData.username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await this.userService.createUser({ ...userData, password: hashedPassword });
        const { password, deleted_at, is_archived, ...result } = newUser;
        const payload = { id: newUser.id, username: newUser.username,  role:newUser.role, email: newUser.email, firstname: newUser.first_name };
        return {
            user: result,
            token: await this.jwtService.signAsync(payload),
        };
    }
}