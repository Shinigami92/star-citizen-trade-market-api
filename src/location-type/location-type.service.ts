import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../database.service';
import { LocationType } from '../graphql.schema';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location.dto';

export const TABLENAME: string = 'location_type';

@Injectable()
export class LocationTypeService {
  private readonly logger: Logger = new Logger(LocationTypeService.name);

  public async create({ name }: CreateLocationTypeDto): Promise<LocationType> {
    const result: QueryResult = await client.query(`INSERT INTO ${TABLENAME}(name) VALUES ($1::text) RETURNING *`, [
      name
    ]);
    const created: LocationType = result.rows[0];
    this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
    return created;
  }

  public async update(id: string, { name }: UpdateLocationTypeDto): Promise<LocationType> {
    const updates: any[] = [];
    const values: any[] = [];
    let updateIndex: number = 2;
    if (name !== undefined) {
      updates.push(` name = $${updateIndex}::text`);
      values.push(name);
      updateIndex++;
    }
    if (updates.length === 0) {
      const locationType: LocationType | undefined = await this.findOneById(id);
      if (!locationType) {
        throw new NotFoundException(`LocationType with id ${id} not found`);
      }
      return locationType;
    }
    const result: QueryResult = await client.query(
      `UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
      [id, ...values]
    );
    const updated: LocationType = result.rows[0];
    this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
    return updated;
  }

  public async findAll(): Promise<LocationType[]> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
    return result.rows;
  }

  public async findOneById(id: string): Promise<LocationType | undefined> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
    return result.rows[0];
  }
}
