import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import * as moment from 'moment';

export function IsFormattedDate(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFormattedDate',
            target: object.constructor,
            propertyName: propertyName,
            /*constraints: [property],*/
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    /*const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];*/
                    const FORMAT_ISO = 'YYYY-MM-DD';
                    const FORMAT_CUSTOM = 'DD/MM/YYYY';
                    const REGEX_ISO = /^[0-9]{4}\-[0-2][0-9]\-[0-3][0-9]$/;
                    const REGEX_CUSTOM = /^[0-3][0-9]\/[0-2][0-9]\/[0-9]{4}$/;

                    if (value instanceof Date) { return value.toString() !== 'Invalid Date'; }
                    if (typeof value === 'string' && value.length === 0)  { return false; }

                    if (value.match(REGEX_ISO)) {
                      return moment(value, FORMAT_ISO).isValid();
                    } else if (value.match(REGEX_CUSTOM)) {
                      return moment(value, FORMAT_CUSTOM).isValid();
                    } else {
                      return false;
                    }
                }
            }
        });
   };
}