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
    console.log("validate start");

    function isPhoneNumber(value: string): boolean {
      if (value[0] !== "+") {
        return false;
      }
      console.log(`Input + ${value}`);
      for (let i = value.length - 1; i >= 1; i--) {
        const charCode = value.charCodeAt(i);
        if (charCode < 48 || charCode > 57) {
          return false; // If any character after the first one is not a digit, return false
        }
      }
      console.log(`Input digits ${value}`);
      return true;
    }

    if (!isPhoneNumber(phone)) {
      console.log("Phone number format: start from +, consist only digits");
      return false;
    }

    console.log(`phone ${phone}`);
    let rules = await this.phoneValidatorRepository.find();

    function inWhiteListCountriesCode(rules) {

      let whiteListCodes: string[] = [];
      rules.forEach(validationRule => {
        whiteListCodes.push(validationRule.code);
      });

      let phoneCode = "";
      console.log(`allowedCodes : ${whiteListCodes}`);
      for (const whiteCode of whiteListCodes) {
        if (phone.startsWith(whiteCode)) {
          phoneCode = whiteCode;
        }
      }
      if (phoneCode === "") {
        console.log("Not supported Country code");
        return false;
      }
      console.log(`Right code is ${phoneCode}`);
      return phoneCode;
    }

    let phoneCode = inWhiteListCountriesCode(rules);
    if (phoneCode === false) {
      console.log("Out of whiteListCountriesCode");
      return false;
    }


    console.log("Success inWhiteListCountriesCode");
    const rule = rules.find(rule => rule.code === phoneCode);
    console.log(`Success rule ${rule.requiredDigits}`);

    function isDigitPrefixValid(phoneNumber: string): boolean {
      if (typeof phoneCode === "string") {
        const significantDigits = phoneNumber.substring(phoneCode.length);
        for (const linePrefix of rule.requiredDigits) {
          if (significantDigits.startsWith(linePrefix.toString())) {
            return true;
          }
        }
      }
      return false;
    }

    if (!isDigitPrefixValid(phone)) {
      console.log(`Required DigitPrefix not found ${phone}`);
      return false;
    }
    console.log(`Success Required DigitPrefix ${phone}`);

    function isLengthInRange(phoneNumber: string): boolean {
      console.log(`Range[${rule.min}.${rule.max}]: min ${rule.min} max ${rule.max} `);
      const length = phoneNumber.length - rule.code.length;
      console.log(`Count Significant Digits of phone without CountryCode: ${length} `);
      return length >= rule.min && length <= rule.max;
    }

    if (!isLengthInRange(phone)) {
      console.log(`Length out of Range, Please input the phone number with a length within the specified range [${rule.min},${rule.max}]`);
      return false;
    }
    console.log(`All validation successfully passed, phone number ${phone} is valid`);
    return true;
    console.log("validate end");
  }
}
