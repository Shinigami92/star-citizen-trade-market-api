import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { CreateAccountInput } from 'src/graphql.schema';

export class CreateAccountDto implements CreateAccountInput {
	@Length(3)
	public username!: string;
	@IsNotEmpty()
	public handle!: string;
	@IsEmail()
	public email!: string;
}
