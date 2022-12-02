import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class PersonValidator {
	@Field()
	@IsString()
	public name: string;

	@Field()
	@IsEmail()
	public email: string;
}

export default PersonValidator;
