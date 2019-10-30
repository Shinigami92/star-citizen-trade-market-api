import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { OrganizationMember } from 'src/graphql.schema';
import { JoinOrganizationDto } from './dto/join-organization.dto';

export const TABLENAME: string = 'organization_member';

@Injectable()
export class OrganizationMemberService {
	private readonly logger: Logger = new Logger(OrganizationMemberService.name);

	public async join({ organizationId, accountId, since }: JoinOrganizationDto): Promise<OrganizationMember> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(organization_id, account_id, since)` +
				' VALUES ($1::uuid, $2::uuid, $3::timestamptz) RETURNING *',
			[organizationId, accountId, since || null]
		);
		const created: OrganizationMember = result.rows[0];
		this.logger.log(
			`Created ${TABLENAME} with accountId ${created.accountId} and organizationId ${created.organizationId}`
		);
		return created;
	}

	public async findAll(): Promise<OrganizationMember[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows;
	}

	public async findAllByOrganizationId(id: string): Promise<OrganizationMember[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE organization_id = $1::uuid`, [
			id
		]);
		return result.rows;
	}

	public async findOneByOrganizationIdAndAccountId(
		organizationId: string,
		accountId: string
	): Promise<OrganizationMember | undefined> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} WHERE organization_id = $1::uuid AND account_id = $2::uuid`,
			[organizationId, accountId]
		);
		return result.rows[0];
	}
}
