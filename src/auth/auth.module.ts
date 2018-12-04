import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';

@Module({
	imports: [PassportModule.register({ defaultStrategy: 'bearer' }), AccountModule],
	providers: [AuthService, HttpStrategy, AccountService]
})
export class AuthModule {}
