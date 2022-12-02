import { IsDate, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { Book } from 'entities/book.entity';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
class ReaderValidator {
	@Field()
	@IsString()
	public name: string;

	@Field()
	@IsEmail()
	public email: string;

	@Field(()=>Int, {nullable:true})
	@IsInt()
	public favoriteBookId?: number;
}

export default ReaderValidator;
