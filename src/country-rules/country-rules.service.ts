import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryRule } from './entities/country-rule.entity';
import { CreateCountryRuleDto } from './dto/create-country-rule.dto';

@Injectable()
export class CountryRulesService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(CountryRule)
    private countryRepository: Repository<CountryRule>,
  ) {
    this.logger = new Logger(CountryRulesService.name);
  }

  async getAllCountryRules() {
    try {
      const countryRules = await this.countryRepository.find();
      this.logger.log(`getAllCountryRules ${JSON.stringify(countryRules)}`);
      return countryRules;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async getCountryByCode(code: string) {
    return await this.countryRepository.findOne({
      where: { countryCode: code },
    });
  }

  async create(createCountryRuleDto: CreateCountryRuleDto) {
    this.logger.log(createCountryRuleDto);
    try {
      const { id } = await this.countryRepository.save({
        countryTitle: createCountryRuleDto.countryName,
        countryCode: createCountryRuleDto.code,
        requiredDigits: createCountryRuleDto.requiredDigits,
        min: createCountryRuleDto.min,
        max: createCountryRuleDto.max,
      });
      this.logger.log(id);
      return id;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
