import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../../database.service';
import { Ship } from '../../graphql.schema';
import { TABLENAME } from '../item.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@Injectable()
export class ShipService {
  private readonly logger: Logger = new Logger(ShipService.name);

  public async create({
    name,
    inGameSinceVersionId,
    inGameSince,
    scu,
    manufacturerId,
    focus,
    size
  }: CreateShipDto): Promise<Ship> {
    const result: QueryResult = await client.query(
      `INSERT INTO ${TABLENAME}(name, in_game_since_version_id, in_game_since, type, manufacturer_id, details)` +
        " VALUES ($1::text, $2::uuid, $3::timestamptz, 'SHIP', $4::uuid, $5::jsonb) RETURNING *",
      [
        name,
        inGameSinceVersionId,
        inGameSince,
        manufacturerId,
        {
          scu,
          focus,
          size
        }
      ]
    );
    const created: Ship = result.rows[0];
    this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
    return this.mapDetails(created);
  }

  public async update(
    id: string,
    { name, focus, inGameSince, inGameSinceVersionId, manufacturerId, scu, size }: UpdateShipDto
  ): Promise<Ship> {
    const updates: any[] = [];
    const values: any[] = [];
    let updateIndex: number = 2;
    if (name !== undefined) {
      updates.push(` name = $${updateIndex}::text`);
      values.push(name);
      updateIndex++;
    }
    if (inGameSinceVersionId !== undefined) {
      updates.push(` in_game_since_version_id = $${updateIndex}::uuid`);
      values.push(inGameSinceVersionId);
      updateIndex++;
    }
    if (inGameSince !== undefined) {
      updates.push(` in_game_since = $${updateIndex}::timestamptz`);
      values.push(inGameSince);
      updateIndex++;
    }
    if (manufacturerId !== undefined) {
      updates.push(` manufacturer_id = $${updateIndex}::uuid`);
      values.push(manufacturerId);
      updateIndex++;
    }
    if (scu !== undefined || focus !== undefined || size !== undefined) {
      updates.push(` details = details || $${updateIndex}::jsonb`);
      values.push({ scu, focus, size });
      updateIndex++;
    }
    if (updates.length === 0) {
      const ship: Ship | undefined = await this.findOneById(id);
      if (!ship) {
        throw new NotFoundException(`Ship with id ${id} not found`);
      }
      return ship;
    }
    const result: QueryResult = await client.query(
      `UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
      [id, ...values]
    );
    const updated: Ship = result.rows[0];
    this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
    return this.mapDetails(updated);
  }

  public async findAll(): Promise<Ship[]> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE type = 'SHIP' ORDER BY name`);
    return result.rows.map(this.mapDetails);
  }

  public async findOneById(id: string): Promise<Ship | undefined> {
    const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid AND type = 'SHIP'`, [
      id
    ]);
    return this.mapDetails(result.rows[0]);
  }

  private mapDetails(ship: Ship): Ship {
    for (const key of ['focus', 'scu', 'size']) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      ship[key] = ship.details[key];
    }
    return ship;
  }
}
