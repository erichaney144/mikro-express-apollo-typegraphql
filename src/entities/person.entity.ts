import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, Int, InterfaceType, ObjectType } from 'type-graphql'
import { Base } from 'utils/entities/base.entity'

@InterfaceType()
@Entity({
	discriminatorColumn: 'type',
	abstract: true,
})
export abstract class Person extends Base<Person> {
	@Field(() => Int)
	@PrimaryKey()
	id!: number

	@Field()
	@Enum()
	type!: 'author' | 'reader'

	@Field()
	@Property()
	public name: string

	@Field()
	@Property()
	@Unique()
	public email: string
}
