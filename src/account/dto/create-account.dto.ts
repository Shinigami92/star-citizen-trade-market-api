import { CreateAccountInput } from '@/graphql.schema';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateAccountDto implements CreateAccountInput {
	@Length(3)
	public username!: string;
	@IsNotEmpty()
	public handle!: string;
	@IsEmail()
	public email!: string;
}
