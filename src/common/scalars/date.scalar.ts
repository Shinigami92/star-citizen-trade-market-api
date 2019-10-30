import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
	public description: string = 'Date custom scalar type';

	/** value from the client */
	public parseValue(value: string): Date {
		return new Date(value);
	}

	/** value sent to the client */
	public serialize(value: Date): string {
		return value.toISOString();
	}

	// tslint:disable-next-line:ban-ts-ignore
	// @ts-ignore
	public parseLiteral(ast: ValueNode): number | null {
		console.log(ast);
		if (ast.kind === Kind.INT) {
			// ast value is always in string format
			return parseInt(ast.value, 10);
		}
		return null;
	}
}
