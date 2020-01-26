import { forwardRef, Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionDetailResolvers } from './transaction-detail.resolvers';
import { TransactionDetailService } from './transaction-detail.service';

@Module({
  imports: [forwardRef(() => TransactionModule)],
  providers: [TransactionDetailService, TransactionDetailResolvers, TransactionService]
})
export class TransactionDetailModule {}
