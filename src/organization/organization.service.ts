import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Organization } from 'src/graphql.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
	public async create(organization: CreateOrganizationDto): Promise<Organization> {
		const result: QueryResult = await client.query(
			'INSERT INTO organization(name, spectrum_id) VALUES ($1::text, $2::text) RETURNING *',
			[organization.name, organization.spectrumId]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Organization[]> {
		const result: QueryResult = await client.query('SELECT * FROM organization');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Organization | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM organization WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
