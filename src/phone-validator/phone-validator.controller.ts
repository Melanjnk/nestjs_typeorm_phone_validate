import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PhoneValidatorService } from "./phone-validator.service";
import { CreatePhoneValidatorDto } from "./dto/create-phone-validator.dto";

@Controller()
export class PhoneValidatorController {
  constructor(private readonly phoneValidatorService: PhoneValidatorService) {
  }

  @Get('phone-is-valid/:phone')
  async validate(@Param('phone') phone: string) {
    return this.phoneValidatorService.validate(phone);
  }

  @Post("phone-validator")
  async create(@Body() createPhoneValidatorDto: CreatePhoneValidatorDto) {
    return this.phoneValidatorService.create(createPhoneValidatorDto);
  }
}
