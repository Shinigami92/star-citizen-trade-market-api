import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { Account } from 'src/graphql.schema';
import { AuthService } from './auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super();
	}

	public async validate(token: string): Promise<Account> {
		const user: Account | undefined = await this.authService.validateUser(token);
		if (user === undefined) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
