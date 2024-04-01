import { Module } from '@nestjs/common';
import { CountryRulesService } from './country-rules.service';
import { CountryRulesController } from './country-rules.controller';
import { Repository } from 'typeorm';
import { CountryRule } from './entities/country-rule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CountryRule])],
  controllers: [CountryRulesController],
  providers: [CountryRulesService, Repository<CountryRule>],
  exports: [CountryRulesService, Repository<CountryRule>],
})
export class CountryRulesModule {}
