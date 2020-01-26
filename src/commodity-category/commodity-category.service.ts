import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../database.service';
import { CommodityCategory } from '../graphql.schema';
import { CreateCommodityCategoryDto } from './dto/create-commodity-category.dto';
import { UpdateCommodityCategoryDto } from './dto/update-commodity-category.dto';

export const TABLENAME: string = 'commodity_category';

@Injectable()
export class CommodityCategoryService {
  private readonly logger: Logger = new Logger(CommodityCategoryService.name);

  public async create({ name }: CreateCommodityCategoryDto): Promise<CommodityCategory> {
    const result: QueryResult = await client.query(`INSERT INTO ${TABLENAME}(name) VALUES ($1::text) RETURNING *`, [
      name
    ]);
    const created: CommodityCategory = result.rows[0];
    this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
    return created;
  }

  public async update(id: string, { name }: UpdateCommodityCategoryDto): Promise<CommodityCategory> {
    const updates: any[] = [];
    const values: any[] = [];
    let updateIndex: number = 2;
    if (name !== undefined) {
      updates.push(` name = $${updateIndex}::text`);
      values.push(name);
      updateIndex++;
    }
    if (updates.length === 0) {
      return (await this.findOneById(id))!;
    }
    const result: QueryResult = await client.query(
      `UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
      [id, ...values]
    );
    const updated: CommodityCategory = result.rows[0];
    this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
    return updated;
  }

  public async findAll(): Promise<CommodityCategory[]> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
    return result.rows;
  }

  public async findOneById(id: string): Promise<CommodityCategory | undefined> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
    return result.rows[0];
  }
}
