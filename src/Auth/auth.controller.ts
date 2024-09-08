import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/createUserDto";


@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('login')
    async logIn(@Body() body: { username: string, password: string }) {
        return this.authService.logIn(body.username, body.password);
    }

    @Post('signup')
    async signUp(@Body() body: CreateUserDto) {
        return this.authService.signUp(body);
    }
}