import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { PhoneNumberValidatorService } from './phone-number-validator.service';
import { ValidatePhoneNumberPipe } from './pipes/validate-phone-number.pipe';

@Controller('phone-number-validator')
export class PhoneNumberValidatorController {
  constructor(private readonly exampleService: PhoneNumberValidatorService) {}

  @Get('validate/:phoneNumber')
  @UsePipes(ValidatePhoneNumberPipe)
  findOne(@Param('phoneNumber') phoneNumber: string) {
    // This method will only be called if the phone number passes through the pipe successfully
    return `This is the phone number: ${phoneNumber}`;
  }
}
