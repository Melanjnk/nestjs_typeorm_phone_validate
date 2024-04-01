import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryRuleDto } from './create-country-rule.dto';

export class UpdateCountryRuleDto extends PartialType(CreateCountryRuleDto) {}
