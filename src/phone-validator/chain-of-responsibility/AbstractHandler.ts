/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export abstract class AbstractHandler implements Handler {

  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // CountryCode.setNext(RequiredPrefix).setNext(LengthInRange);
    return handler;
  }

  public handle(phone: string, code?: string): boolean {
    // public handle(phone: string): boolean {
    if (this.nextHandler) {
      if (code) {
        return this.nextHandler.handle(phone, code);
      }
      return this.nextHandler.handle(phone);
    }

    return null;
  }
}