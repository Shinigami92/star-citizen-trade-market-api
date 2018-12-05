import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { OrganizationMember } from 'src/graphql.schema';
import { JoinOrganizationDto } from './dto/join-organization.dto';

@Injectable()
export class OrganizationMemberService {
	public async join({ organizationId, accountId, since = null }: JoinOrganizationDto): Promise<OrganizationMember> {
		const result: QueryResult = await client.query(
			'INSERT INTO organization_member(organization_id, account_id, since)' +
				' VALUES ($1::uuid, $2::uuid, $3::timestamptz) RETURNING *',
			[organizationId, accountId, since]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<OrganizationMember[]> {
		const result: QueryResult = await client.query('SELECT * FROM organization_member');
		return result.rows;
	}

	public async findAllByOrganizationId(id: string): Promise<OrganizationMember[]> {
		const result: QueryResult = await client.query(
			'SELECT * FROM organization_member WHERE organization_id = $1::uuid',
			[id]
		);
		return result.rows;
	}

	public async findOneByOrganizationIdAndAccountId(
		organizationId: string,
		accountId: string
	): Promise<OrganizationMember | undefined> {
		const result: QueryResult = await client.query(
			'SELECT * FROM organization_member WHERE organization_id = $1::uuid AND account_id = $2::uuid',
			[organizationId, accountId]
		);
		return result.rows[0];
	}
}
