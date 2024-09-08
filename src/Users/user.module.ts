import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { UserController } from "./user.controller";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers:[UserController],
    providers:[UsersService],
    exports:[UsersService]
})

export class UsersModule{}