import {
	Cascade,
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Unique,
} from '@mikro-orm/core'
import PersonValidator from 'contracts/validators/person.validator'
import { Field, ObjectType } from 'type-graphql'
import { Base } from 'utils/entities/base.entity'
import { Book } from 'entities/book.entity'
import { Person } from './person.entity'

@ObjectType({ implements: Person })
@Entity({ discriminatorValue: 'reader' })
export class Reader extends Person {
	@Field(() => Book, { nullable: true })
	@ManyToOne(() => Book, { nullable: true })
	public favoriteBook?: Book

	constructor(body: PersonValidator) {
		super(body)
	}
}
