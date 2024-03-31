interface Handler {
  setNext(handler: Handler): Handler;

  handle(phone: string, code?: string): boolean;
}