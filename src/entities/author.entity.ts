import {
	Cascade,
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Unique,
} from '@mikro-orm/core';
import PersonValidator from 'contracts/validators/person.validator';
import { Field, ObjectType } from 'type-graphql';
import { Base } from 'utils/entities/base.entity';
import { Book } from 'entities/book.entity';
import { Person } from './person.entity';

@ObjectType({implements: Person})
@Entity({ discriminatorValue: 'author' })
export class Author extends Person {
	@Field(() => [Book])
	@OneToMany(() => Book, (b: Book) => b.author, { cascade: [Cascade.ALL] })
	public books = new Collection<Book>(this)
}
