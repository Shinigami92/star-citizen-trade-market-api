import { TransactionDetailModule } from '@/transaction-detail/transaction-detail.module';
import { TransactionDetailService } from '@/transaction-detail/transaction-detail.service';
import { forwardRef, Module } from '@nestjs/common';
import { TransactionResolvers } from './transaction.resolvers';
import { TransactionService } from './transaction.service';

@Module({
	imports: [forwardRef(() => TransactionDetailModule)],
	providers: [TransactionService, TransactionResolvers, TransactionDetailService]
})
export class TransactionModule {}
