import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.count(entity, { [args.property]: value })
			.then((count) => count < 1);
	}
}

export function Unique(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class UniqueIdConstraint implements ValidatorConstraintInterface {
	constructor() { }
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.findOne(entity, value)
			.then((res) => res !== undefined);
	}
}

export function UniqueId(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueIdConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class UniqueOrderConstraint implements ValidatorConstraintInterface {
	constructor() { }
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.findOne(entity, { order: value })
			.then((res) => res === undefined);
	}
}

export function UniqueOrder(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueOrderConstraint,
		});
	};
}