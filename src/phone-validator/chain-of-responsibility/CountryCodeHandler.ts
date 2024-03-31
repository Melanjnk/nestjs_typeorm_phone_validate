import { AbstractHandler } from "./AbstractHandler";

export class CountryCodeHandler extends AbstractHandler {

  public handle(phone: string): boolean {
    const whiteListCodes: string[] = this.phoneValidators.map(validationRule => validationRule.code);

    for (const whiteCode of whiteListCodes) {
      if (phone.startsWith(whiteCode)) {
        this.logger.log("CountryCodeHandler check success");
        return super.handle(phone, whiteCode);
      }
    }
    this.logger.error("CountryCodeHandler check failed");
    return false;
  }
}