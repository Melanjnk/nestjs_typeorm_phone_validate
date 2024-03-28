import { Test, TestingModule } from "@nestjs/testing";
import { PhoneValidatorController } from "./phone-validator.controller";
import { PhoneValidatorService } from "./phone-validator.service";
import { CreatePhoneValidatorDto } from "./dto/create-phone-validator.dto";
import { PhoneValidator } from "./entities/phone-validator.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("PhoneValidatorController", () => {
  let controller: PhoneValidatorController;
  let service: PhoneValidatorService;
  let mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneValidatorController],
      providers: [PhoneValidatorService, { provide: getRepositoryToken(PhoneValidator), useValue: mockRepository }]
    }).compile();

    controller = module.get<PhoneValidatorController>(PhoneValidatorController);
    service = module.get<PhoneValidatorService>(PhoneValidatorService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("validate", () => {
    it("should return the result of phone validation from the service", async () => {
      const phone = "+372536789"; // sample phone number
      const expectedResult = true; // sample result
      jest.spyOn(service, "validate").mockResolvedValueOnce(expectedResult);

      const result = await controller.validate(phone);

      expect(result).toBe(expectedResult);
      expect(service.validate).toHaveBeenCalledWith(phone);
    });
  });

  describe("create", () => {
    it("should create a phone validator rule using the service", async () => {
      const createPhoneValidatorDto: CreatePhoneValidatorDto = {
        countryName: "TestCountry",
        code: "+372",
        requiredDigits: [5], // sample required digits
        min: 6,
        max: 8
      };
      const mockPhoneValidator: PhoneValidator = {
        id: "1",
        created: new Date(),
        updated: new Date(),
        ...createPhoneValidatorDto
      };
      jest.spyOn(service, "create").mockResolvedValueOnce(mockPhoneValidator);

      const result = await controller.create(createPhoneValidatorDto);

      expect(result).toEqual(mockPhoneValidator);
      expect(service.create).toHaveBeenCalledWith(createPhoneValidatorDto);
    });
  });
});
