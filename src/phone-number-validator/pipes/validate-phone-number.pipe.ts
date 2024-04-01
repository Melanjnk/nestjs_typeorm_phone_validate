import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CountryRulesService } from '../../country-rules/country-rules.service';

@Injectable()
export class ValidatePhoneNumberPipe implements PipeTransform {
  constructor(private readonly countryService: CountryRulesService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      throw new BadRequestException(
        'ValidatePhoneNumberPipe is only applicable to route parameters.',
      );
    }

    const phoneNumber = value.trim();

    // Fetch countryRule from database using the countryRule code
    const countryRules = await this.countryService.getAllCountryCodes();
    const countryRule = countryRules.find((countryRule) =>
      phoneNumber.startsWith(countryRule.countryCode),
    );

    if (!countryRule) {
      throw new BadRequestException('Country code not supported.');
    }
    const { countryCode, requiredDigits, min, max, countryTitle } = countryRule;

    // Check if the length of the phone number is within the specified range
    const significantDigits = phoneNumber.substring(countryCode.length);

    if (!this.hasRequiredDigits(significantDigits, requiredDigits)) {
      throw new BadRequestException(
        `Phone in ${countryTitle} should consist one of [${requiredDigits}]`,
      );
    }
    if (significantDigits.length < min || significantDigits.length > max) {
      throw new BadRequestException(
        `Phone number length should be between ${min} and ${max} digits.`,
      );
    }

    return phoneNumber;
  }
  private hasRequiredDigits(
    significantDigits: string,
    requiredDigits: number[],
  ) {
    for (const linePrefix of requiredDigits) {
      if (significantDigits.startsWith(linePrefix.toString())) {
        return true;
      }
    }
    return false;
  }
}
