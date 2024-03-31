import { AbstractHandler } from "./AbstractHandler";

export class LengthInRangeHandler extends AbstractHandler {
  public handle(phone: string, code?: string): boolean {
    const significantDigits = phone.substring(code.length);
    const phoneValidator = this.phoneValidators.find(validator => validator.code === code);
    if (significantDigits.length < phoneValidator.min
      || significantDigits.length > phoneValidator.max) {
      this.logger.error("LengthInRangeHandler check failed");
      return false;
    }
    this.logger.log("LengthInRangeHandler check success");
    return true;
  }
}