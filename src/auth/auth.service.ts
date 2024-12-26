import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}
    async validateUser(username: string, pass: string): Promise<any> {

        //username và pass là 2 tham số thư viện passport ném về
        const user = await this.usersService.findOneByUsername(username);
        if(user){
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if(isValid){
                return user;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        const refresh_token = this.createRefreshToken(payload);
        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          user: 
            {
                email: user.email,
                _id: user._id
            }
        };
    }
    createRefreshToken(payload: any){
        const refresh_token =  this.jwtService.sign(payload,{
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        })
        return refresh_token;
    }
}
