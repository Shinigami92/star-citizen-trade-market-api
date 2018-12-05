import { Module } from '@nestjs/common';
import { TransactionDetailModule } from 'src/transaction-detail/transaction-detail.module';
import { TransactionDetailService } from 'src/transaction-detail/transaction-detail.service';
import { TransactionResolvers } from './transaction.resolvers';
import { TransactionService } from './transaction.service';

@Module({
	imports: [TransactionDetailModule],
	providers: [TransactionService, TransactionResolvers, TransactionDetailService]
})
export class TransactionModule {}
