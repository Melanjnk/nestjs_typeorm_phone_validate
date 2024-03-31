import { Injectable } from "@nestjs/common";
import { CreatePhoneValidatorDto } from "./dto/create-phone-validator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PhoneValidator } from "./entities/phone-validator.entity";
import { Repository } from "typeorm";
import { CountryCodeHandler } from "./chain-of-responsibility/CountryCodeHandler";
import { RequiredPrefixHandler } from "./chain-of-responsibility/RequiredPrefixHandler";
import { LengthInRangeHandler } from "./chain-of-responsibility/LengthInRangeHandler";

@Injectable()
export class PhoneValidatorService {

  constructor(
    @InjectRepository(PhoneValidator)
    private readonly phoneValidatorRepository: Repository<PhoneValidator>
  ) {
  }

  async create(createPhoneValidatorDto: CreatePhoneValidatorDto) {
    return await this.phoneValidatorRepository.save({
      countryName: createPhoneValidatorDto.countryName,
      code: createPhoneValidatorDto.code,
      requiredDigits: createPhoneValidatorDto.requiredDigits,
      min: createPhoneValidatorDto.min,
      max: createPhoneValidatorDto.max
    });
  }

  async validate(phone: string) {
    // Skip any db queries, if it not a +Numeric
    if (!this.isPhoneNumberValid(phone)) {
      return false;
    }

    function check(handler: Handler) {
      const result = handler.handle(phone);
      if (result) {
        return true;
      }
      return false;
    }
    const phoneValidators = await this.phoneValidatorRepository.find();

    const CountryCode = new CountryCodeHandler(phoneValidators);
    const RequiredPrefix = new RequiredPrefixHandler(phoneValidators);
    const LengthInRange = new LengthInRangeHandler(phoneValidators);

    CountryCode
      .setNext(RequiredPrefix)
      .setNext(LengthInRange);

    return check(CountryCode);
  }

  private isPhoneNumberValid(value: string) {
    if (value[0] !== "+") {
      return false;
    }
    for (let i = value.length - 1; i >= 1; i--) {
      const charCode = value.charCodeAt(i);
      if (charCode < 48 || charCode > 57) {
        return false; // If any character after the first one is not a digit, return false
      }
    }
    return true;
  }
}
