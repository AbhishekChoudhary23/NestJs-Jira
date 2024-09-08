import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";


@Controller('user')
export class UserController{
    constructor(private userService: UsersService){}

    @Get()
    async getAll(){
        return this.userService.getAll();
    }
}