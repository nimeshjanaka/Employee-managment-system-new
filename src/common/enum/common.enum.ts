import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  GRANTED = 'GRANTED',
  REJECTED = 'REJECTED',
}

export function IsValidEnum(
  enumType: any,
  validationOptions?: ValidationOptions,
) {
  const defaultValidationOptions: ValidationOptions = {
    message: `status must be one of ${Object.values(enumType).join(', ')}`,
  };

  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEnum',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ? validationOptions : defaultValidationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(enumType).includes(value);
        },
      },
    });
  };
}
