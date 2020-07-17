import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

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

  // @ts-expect-error: Force number instead of Date
  public parseLiteral(valueNode: ValueNode): Maybe<number> {
    console.log(valueNode);
    if (valueNode.kind === Kind.INT) {
      // valueNode is always in string format
      return parseInt(valueNode.value, 10);
    }
    return null;
  }
}
