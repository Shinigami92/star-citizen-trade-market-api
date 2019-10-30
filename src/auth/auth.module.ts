import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '@/account/account.module';
import { AccountService } from '@/account/account.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [PassportModule.register({ defaultStrategy: 'jwt' }), AccountModule],
	providers: [AuthService, JwtStrategy, AccountService]
})
export class AuthModule {}
