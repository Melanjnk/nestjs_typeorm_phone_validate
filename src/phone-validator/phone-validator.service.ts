import { Injectable } from "@nestjs/common";
import { CreatePhoneValidatorDto } from "./dto/create-phone-validator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PhoneValidator } from "./entities/phone-validator.entity";
import { Repository } from "typeorm";

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

    const rules = await this.phoneValidatorRepository.find();
    const phoneCode = this.getValidCountryCode(phone, rules);
    if (phoneCode === false) {
      return false;
    }

    const rule = rules.find(rule => rule.code === phoneCode);
    if (!this.isDigitPrefixValid(phone, rule)) {
      return false;
    }

    if (!this.isLengthInRange(phone, rule)) {
      return false;
    }

    return true;
  }

  private getValidCountryCode(phone: string, rules: PhoneValidator[]) {
    let whiteListCodes: string[] = [];
    rules.forEach(validationRule => {
      whiteListCodes.push(validationRule.code);
    });

    let phoneCode = "";
    for (const whiteCode of whiteListCodes) {
      if (phone.startsWith(whiteCode)) {
        phoneCode = whiteCode;
      }
    }
    if (phoneCode === "") {
      return false;
    }
    return phoneCode;
  }

  private isDigitPrefixValid(phone: string, rule: PhoneValidator) {
    if (typeof phone === "string") {
      const significantDigits = phone.substring(phone.length);
      for (const linePrefix of rule.requiredDigits) {
        if (significantDigits.startsWith(linePrefix.toString())) {
          return true;
        }
      }
    }
    return false;
  }

  private isLengthInRange(phone: string, rule: PhoneValidator) {
    const length = phone.length - rule.code.length;
    return length >= rule.min && length <= rule.max;
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
