import { Logger, Module } from "@nestjs/common";
import { PhoneValidatorService } from './phone-validator.service';
import { PhoneValidatorController } from './phone-validator.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneValidator } from "./entities/phone-validator.entity";
import { Repository } from "typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PhoneValidator])],
  controllers: [PhoneValidatorController],
  providers: [PhoneValidatorService, Repository<PhoneValidator>, Logger],
})
export class PhoneValidatorModule {}
