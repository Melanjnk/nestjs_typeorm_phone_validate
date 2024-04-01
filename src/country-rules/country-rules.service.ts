import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryRule } from './entities/country-rule.entity';
import { CreateCountryRuleDto } from './dto/create-country-rule.dto';

@Injectable()
export class CountryRulesService {
  constructor(
    @InjectRepository(CountryRule)
    private countryRepository: Repository<CountryRule>,
  ) {}

  async getAllCountryCodes() {
    return await this.countryRepository.find();
  }
  async getCountryByCode(code: string) {
    return await this.countryRepository.findOne({
      where: { countryCode: code },
    });
  }

  async create(createCountryRuleDto: CreateCountryRuleDto) {
    const logger = new Logger();
    logger.log(createCountryRuleDto);
    try {
      this.countryRepository.save({
        countryTitle: createCountryRuleDto.countryName,
        countryCode: createCountryRuleDto.code,
        requiredDigits: createCountryRuleDto.requiredDigits,
        min: createCountryRuleDto.min,
        max: createCountryRuleDto.max,
      });
    } catch (error) {
      logger.fatal(error);
    }
  }
}
