import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'CustomRatingValidation', async: false })
export class CustomRatingValidation implements ValidatorConstraintInterface {
  validate(value: number | string, args: ValidationArguments) {
    let id = JSON.parse(JSON.stringify(args.object)).id;
    let result = false;
    switch (id) {
      case 1:
      case 3:
      case 4:
        if (value in [1, 2, 3, 4, 5]) {
          result = true;
        }
        break;
      case 5:
        if (typeof value === 'string') {
          result = true;
        }
        break;
      default:
        break;
    }
    return result;
  }
  defaultMessage(args?: ValidationArguments): string {
    console.log('args', args);
    let id = JSON.parse(JSON.stringify(args.object)).id;
    let value = JSON.parse(JSON.stringify(args.object)).value;
    let message = '';
    switch (id) {
      case 1:
      case 3:
      case 4:
        if (!(value in [1, 2, 3, 4, 5])) {
          message = 'Value must be between [1,2,3,4,5]';
        }
        break;
      case 5:
        if (typeof value !== 'string') {
          message = 'Value must be string!';
        }
        break;
      default:
        break;
    }
    return message;
  }
}
