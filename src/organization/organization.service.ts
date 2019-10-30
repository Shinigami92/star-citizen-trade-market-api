import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from '../database.service';
import { Organization } from '../graphql.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

export const TABLENAME: string = 'organization';

@Injectable()
export class OrganizationService {
	private readonly logger: Logger = new Logger(OrganizationService.name);

	public async create({ name, spectrumId }: CreateOrganizationDto): Promise<Organization> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(name, spectrum_id) VALUES ($1::text, $2::text) RETURNING *`,
			[name, spectrumId]
		);
		const created: Organization = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async update(id: string, { name, spectrumId }: UpdateOrganizationDto): Promise<Organization> {
		const updates: any[] = [];
		const values: any[] = [];
		let updateIndex: number = 2;
		if (name !== undefined) {
			updates.push(` name = $${updateIndex}::text`);
			values.push(name);
			updateIndex++;
		}
		if (spectrumId !== undefined) {
			updates.push(` spectrum_id = $${updateIndex}::text`);
			values.push(spectrumId);
			updateIndex++;
		}
		if (updates.length === 0) {
			return (await this.findOneById(id))!;
		}
		const result: QueryResult = await client.query(
			`UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
			[id, ...values]
		);
		const updated: Organization = result.rows[0];
		this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
		return updated;
	}

	public async findAll(): Promise<Organization[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Organization | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
