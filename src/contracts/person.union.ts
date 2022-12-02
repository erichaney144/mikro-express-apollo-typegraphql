import { Author } from "entities/author.entity"
import { Person } from "entities/person.entity"
import { Reader } from "entities/reader.entity"
import { createUnionType } from "type-graphql"

export const personClasses = [
	Author,
	Reader,
]

export const PersonUnion = createUnionType({
	name: 'People',
	types: () => personClasses,
})
