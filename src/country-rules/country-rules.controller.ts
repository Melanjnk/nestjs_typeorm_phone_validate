import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountryRulesService } from './country-rules.service';
import { CreateCountryRuleDto } from './dto/create-country-rule.dto';

@Controller('country-rules')
export class CountryRulesController {
  constructor(private readonly countryRulesService: CountryRulesService) {}
  @Get()
  findAll() {
    return this.countryRulesService.getCountryByCode('+372');
  }

  @Post()
  async create(@Body() createCountryRuleDto: CreateCountryRuleDto) {
    return await this.countryRulesService.create(createCountryRuleDto);
  }
}
