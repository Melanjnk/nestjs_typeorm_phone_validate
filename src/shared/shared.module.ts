import { Module } from '@nestjs/common';
import { PhoneNumberValidatorModule } from '../phone-number-validator/phone-number-validator.module';
import { CountryRulesModule } from '../country-rules/country-rules.module';

@Module({
  imports: [PhoneNumberValidatorModule, CountryRulesModule],
  providers: [],
  exports: [],
})
export class SharedModule {}
