import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Organization } from 'src/graphql.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';

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

	public async findAll(): Promise<Organization[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Organization | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
