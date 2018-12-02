import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('Date')
export class DateScalar {
	public description: string = 'Date  scalar type';

	/** value from the client */
	public parseValue(value: string): Date {
		return new Date(value);
	}

	/** value sent to the client */
	public serialize(value: Date): string {
		return value.toISOString();
	}

	public parseLiteral(ast: any): number | null {
		console.log(ast);
		if (ast.kind === Kind.INT) {
			// ast value is always in string format
			return parseInt(ast.value, 10);
		}
		return null;
	}
}
