import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../database.service';
import { Manufacturer } from '../graphql.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

export const TABLENAME: string = 'manufacturer';

@Injectable()
export class ManufacturerService {
  private readonly logger: Logger = new Logger(ManufacturerService.name);

  public async create({ name }: CreateManufacturerDto): Promise<Manufacturer> {
    const result: QueryResult = await client.query(`INSERT INTO ${TABLENAME}(name) VALUES ($1::text) RETURNING *`, [
      name
    ]);
    const created: Manufacturer = result.rows[0];
    this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
    return created;
  }

  public async update(id: string, { name }: UpdateManufacturerDto): Promise<Manufacturer> {
    const updates: any[] = [];
    const values: any[] = [];
    let updateIndex: number = 2;
    if (name !== undefined) {
      updates.push(` name = $${updateIndex}::text`);
      values.push(name);
      updateIndex++;
    }
    if (updates.length === 0) {
      const manufacturer: Manufacturer | undefined = await this.findOneById(id);
      if (!manufacturer) {
        throw new NotFoundException(`Manufacturer with id ${id} not found`);
      }
      return manufacturer;
    }
    const result: QueryResult = await client.query(
      `UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
      [id, ...values]
    );
    const updated: Manufacturer = result.rows[0];
    this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
    return updated;
  }

  public async findAll(): Promise<Manufacturer[]> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
    return result.rows;
  }

  public async findOneById(id: string): Promise<Manufacturer | undefined> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
    return result.rows[0];
  }
}
