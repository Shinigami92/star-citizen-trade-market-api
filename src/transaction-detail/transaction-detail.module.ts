import { Module } from '@nestjs/common';
import { TransactionDetailResolvers } from './transaction-detail.resolvers';
import { TransactionDetailService } from './transaction-detail.service';

@Module({
	providers: [TransactionDetailService, TransactionDetailResolvers]
})
export class TransactionDetailModule {}
