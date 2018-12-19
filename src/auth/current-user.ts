import { Account, Role } from 'src/graphql.schema';

export class CurrentAuthUser implements Partial<Account> {
	public readonly id: string;
	public readonly username: string;
	public readonly email: string;
	public readonly roles: Role[];

	constructor({ id, username, email, roles }: { id: string; username: string; email: string; roles: Role[] }) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.roles = roles;
	}

	public hasRole(role: Role): boolean {
		return this.roles.find((r: Role) => r === role) !== undefined;
	}

	public hasAnyRole(roles: Role[]): boolean {
		for (const role of roles) {
			if (this.roles.find((r: Role) => r === role) !== undefined) {
				return true;
			}
		}
		return false;
	}
}
