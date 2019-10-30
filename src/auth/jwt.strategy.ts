import { Account } from '@/graphql.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthService } from './auth.service';
import { CurrentAuthUser } from './current-user';
import { JwtPayload } from './jwt-payload';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET_KEY
		} as StrategyOptions);
	}

	public async validate(payload: JwtPayload): Promise<CurrentAuthUser> {
		const user: Account | undefined = await this.authService.validateUser(payload);
		if (user === undefined) {
			throw new UnauthorizedException();
		}
		return new CurrentAuthUser({
			id: user.id,
			username: user.username,
			email: user.email!,
			roles: user.roles
		});
	}
}
