import { AbstractHandler } from "./AbstractHandler";
import { PhoneValidator } from "../entities/phone-validator.entity";

export class CountryCodeHandler extends AbstractHandler {
  constructor(private readonly phoneValidators: PhoneValidator[]) {
    super();
    this.phoneValidators = phoneValidators;
  }

  public handle(phone: string): boolean {
    const whiteListCodes: string[] = this.phoneValidators.map(validationRule => validationRule.code);

    for (const whiteCode of whiteListCodes) {
      if (phone.startsWith(whiteCode)) {
        console.log("\x1b[42m CountryCodeHandler check success \x1b[40m");
        return super.handle(phone, whiteCode);
      }
    }
    console.error("\x1b[41m CountryCodeHandler check failed \x1b[0m");
    return false;
  }
}