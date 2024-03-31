import { PhoneValidatorService } from './phone-validator.service';
import { PhoneValidator } from './entities/phone-validator.entity';

const date = new Date('2024-03-28 00:03:20.120286');
describe('PhoneValidatorService', () => {
  let phoneValidatorService: PhoneValidatorService;
  let mockPhoneValidatorRepository;

  beforeEach(() => {
    mockPhoneValidatorRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };

    phoneValidatorService = new PhoneValidatorService(mockPhoneValidatorRepository);
  });

  describe('create', () => {
    it('should save phone validator rule', async () => {
      const createPhoneValidatorDto = {
        countryName: 'TestCountry',
        code: '+372',
        requiredDigits: [5],
        min: 6,
        max: 8,
      };

      mockPhoneValidatorRepository.save.mockResolvedValueOnce(createPhoneValidatorDto);

      const result = await phoneValidatorService.create(createPhoneValidatorDto);

      expect(mockPhoneValidatorRepository.save).toHaveBeenCalledWith(createPhoneValidatorDto);
      expect(result).toEqual(createPhoneValidatorDto);
    });
  });

  describe('validate', () => {
    it('should return false if phone number is not in valid format: missed sign "+"', async () => {
      const result = await phoneValidatorService.validate('123456789'); // Not starting with '+'
      expect(result).toBe(false);
    });

    it('should return false if phone number is not in valid format: consist not only + and digits: letters', async () => {
      const result = await phoneValidatorService.validate('123456789d'); // Not starting with '+'
      expect(result).toBe(false);
    });

    it('should return false if no rules found for country code', async () => {
      const mockRules: PhoneValidator[] = [];
      mockPhoneValidatorRepository.find.mockResolvedValueOnce(mockRules);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await phoneValidatorService.validate('+123456789');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith("\x1b[41m CountryCodeHandler check failed \x1b[0m");
      consoleErrorSpy.mockRestore();
    });

    it('should return false if digit prefix is not valid', async () => {
      const mockRules: PhoneValidator[] = [{ id: '1', countryName:"be", code: '+32', requiredDigits: [46, 56], min: 8, max: 12, created: date, updated: date }];
      mockPhoneValidatorRepository.find.mockResolvedValueOnce(mockRules);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await phoneValidatorService.validate('+32789123');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith("\x1b[41m RequiredPrefixHandler check failed \x1b[0m");
      consoleErrorSpy.mockRestore();
    });

    it('should return false if phone length is out of range: Length < min', async () => {
      const mockRules: PhoneValidator[] = [{ id: '1', countryName:"be", code: '+32', requiredDigits: [46, 56], min: 8, max: 12, created: date, updated: date  }];
      mockPhoneValidatorRepository.find.mockResolvedValueOnce(mockRules);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await phoneValidatorService.validate('+324678'); // Length < min
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith("\x1b[41m LengthInRangeHandler check failed \x1b[0m");
      consoleErrorSpy.mockRestore();
    });

    it('should return false if phone length is out of range: Length > max', async () => {
      const mockRules: PhoneValidator[] = [{ id: '1', countryName:"be", code: '+32', requiredDigits: [46, 56], min: 8, max: 12, created: date, updated: date  }];
      mockPhoneValidatorRepository.find.mockResolvedValueOnce(mockRules);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await phoneValidatorService.validate('+3246789123456789'); // Length > max
      expect(consoleErrorSpy).toHaveBeenCalledWith("\x1b[41m LengthInRangeHandler check failed \x1b[0m");
      expect(result).toBe(false);
      consoleErrorSpy.mockRestore();
    });

    it('should return true if phone number is valid', async () => {
      const mockRules: PhoneValidator[] = [{ id: '1', countryName:"be", code: '+32', requiredDigits: [46,56], min: 8, max: 12, created: date, updated: date  }];
      mockPhoneValidatorRepository.find.mockResolvedValueOnce(mockRules);

      const result = await phoneValidatorService.validate('+3246578119');
      expect(result).toBe(true);
    });
  });
});
