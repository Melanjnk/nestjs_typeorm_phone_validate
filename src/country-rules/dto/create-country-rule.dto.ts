import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCountryRuleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  countryName: string;

  @IsNotEmpty()
  @IsArray()
  requiredDigits: number[];

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;
}
