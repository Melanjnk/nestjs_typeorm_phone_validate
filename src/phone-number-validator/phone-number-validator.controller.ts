import { Controller, Get, HttpStatus, Param, UsePipes } from '@nestjs/common';
import { ValidatePhoneNumberPipe } from './pipes/validate-phone-number.pipe';

@Controller('phone-number-validator')
export class PhoneNumberValidatorController {
  @Get('validate/:phoneNumber')
  @UsePipes(ValidatePhoneNumberPipe)
  findOne(@Param('phoneNumber') phoneNumber: string) {
    // This method will only be called if the phone number passes through the pipe successfully
    return {
      statusCode: HttpStatus.OK,
      message: `This is the valid phone number: ${phoneNumber}`,
    };
  }
}
