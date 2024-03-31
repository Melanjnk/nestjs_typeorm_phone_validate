import { AbstractHandler } from "./AbstractHandler";
import { PhoneValidator } from "../entities/phone-validator.entity";

export class LengthInRangeHandler extends AbstractHandler {
  constructor(private readonly phoneValidators: PhoneValidator[]) {
    super();
    this.phoneValidators = phoneValidators;
  }

  public handle(phone: string, code?: string): boolean {
    const significantDigits = phone.substring(code.length);
    const phoneValidator = this.phoneValidators.find(validator => validator.code === code);
    if (significantDigits.length < phoneValidator.min
      || significantDigits.length > phoneValidator.max) {
      console.error("\x1b[41m LengthInRangeHandler check failed \x1b[0m");
      return false;
    }
    console.log("\x1b[42m LengthInRangeHandler check success \x1b[40m");
    return true;
  }
}