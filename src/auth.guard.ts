import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';
import { QueryResult } from 'pg';
import { Account, Role } from 'src/graphql.schema';
import { client } from './database.service';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger: Logger = new Logger(AuthGuard.name);

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx: GqlArgumentsHost = GqlExecutionContext.create(context);
		const token: string | undefined = ctx.getContext().token;
		// TODO: remove logging token
		this.logger.log(`token: ${token}`);
		if (token === undefined) {
			return false;
		}

		// TODO: get user with information from the token
		const result: QueryResult = await client.query(
			'SELECT id, username, email, roles FROM account WHERE id = $1::uuid',
			['76456e77-96bd-4e1f-9027-dc6c2c5db0bf']
		);

		const currentUser: Account | undefined = result.rows[0];
		if (currentUser === undefined) {
			return false;
		}
		const rolesString: string = result.rows[0].roles;
		currentUser.roles = rolesString.substring(1, rolesString.length - 1).split(',') as Role[];
		// TODO: do not log email later
		this.logger.log(`user: ${JSON.stringify(currentUser)}`);
		ctx.getContext().user = currentUser;

		this.logger.log(ctx.getContext(), 'context');
		// this.logger.log(ctx.getArgs(), 'getArgs');
		// this.logger.log(ctx.getInfo(), 'getInfo');
		// this.logger.log(ctx.getRoot(), 'getRoot');
		return true;
	}
}
