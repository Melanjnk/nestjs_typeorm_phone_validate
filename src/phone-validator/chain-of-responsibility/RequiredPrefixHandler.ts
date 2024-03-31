import { AbstractHandler } from "./AbstractHandler";
import { PhoneValidator } from "../entities/phone-validator.entity";

export class RequiredPrefixHandler extends AbstractHandler {
  constructor(private readonly phoneValidators: PhoneValidator[]) {
    super();
    this.phoneValidators = phoneValidators;
  }
  public handle(phone: string, code?: string): boolean {
    const phoneValidator = this.phoneValidators.find(validator=>validator.code === code)
    const significantDigits = phone.substring(code.length)
    for (const requiredPrefix of phoneValidator.requiredDigits) {
      if (significantDigits.startsWith(requiredPrefix.toString())) {
        console.log("\x1b[42m RequiredPrefixHandler check success \x1b[40m");
        return super.handle(phone, code);
      }
    }
    console.error("\x1b[41m RequiredPrefixHandler check failed \x1b[0m");
    return false;
  }
}