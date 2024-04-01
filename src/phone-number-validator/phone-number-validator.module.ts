import { Module } from '@nestjs/common';
import { PhoneNumberValidatorService } from './phone-number-validator.service';
import { CountryRulesModule } from '../country-rules/country-rules.module';
import { PhoneNumberValidatorController } from './phone-number-validator.controller';

@Module({
  imports: [CountryRulesModule],
  controllers: [PhoneNumberValidatorController],
  providers: [PhoneNumberValidatorService],
})
export class PhoneNumberValidatorModule {}
