import { Module } from "@nestjs/common";
import { UsersModule } from "src/Users/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports:[UsersModule,
        JwtModule.register({
            global:true,
            secret: "My_spcial_secret_token",
            signOptions:{expiresIn: '1h'},
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule{}