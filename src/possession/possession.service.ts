import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../database.service';
import { Possession } from '../graphql.schema';
import { CreatePossessionDto } from './dto/create-possession.dto';

export const TABLENAME: string = 'possession';

@Injectable()
export class PossessionService {
  private readonly logger: Logger = new Logger(PossessionService.name);

  public async create({
    accountId,
    itemId,
    purchasePrice,
    purchaseCurrency,
    purchaseDate
  }: CreatePossessionDto): Promise<Possession> {
    const result: QueryResult = await client.query(
      `INSERT INTO ${TABLENAME}(account_id, item_id, purchase_price, purchase_currency, purchase_date)` +
        ' VALUES ($1::uuid, $2::uuid, $3::numeric, $4::purchase_currency, $5::date) RETURNING *',
      [accountId, itemId, purchasePrice, purchaseCurrency, purchaseDate]
    );
    const created: Possession = result.rows[0];
    this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
    return created;
  }

  public async findAll(): Promise<Possession[]> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
    return result.rows;
  }

  public async findOneById(id: string): Promise<Possession | undefined> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
    return result.rows[0];
  }
}
