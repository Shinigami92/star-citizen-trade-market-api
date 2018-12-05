import { forwardRef, Module } from '@nestjs/common';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionDetailResolvers } from './transaction-detail.resolvers';
import { TransactionDetailService } from './transaction-detail.service';

@Module({
	imports: [forwardRef(() => TransactionModule)],
	providers: [TransactionDetailService, TransactionDetailResolvers, TransactionService]
})
export class TransactionDetailModule {}
