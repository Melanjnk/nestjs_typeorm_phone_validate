import { AbstractHandler } from "./AbstractHandler";

export class RequiredPrefixHandler extends AbstractHandler {
  public handle(phone: string, code?: string): boolean {
    const phoneValidator = this.phoneValidators.find(validator => validator.code === code);
    const significantDigits = phone.substring(code.length);
    for (const requiredPrefix of phoneValidator.requiredDigits) {
      if (significantDigits.startsWith(requiredPrefix.toString())) {
        this.logger.log("RequiredPrefixHandler check success");
        return super.handle(phone, code);
      }
    }
    this.logger.error("RequiredPrefixHandler check failed");
    return false;
  }
}