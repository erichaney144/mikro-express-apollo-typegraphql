import { FindOptions } from "@mikro-orm/core";
import { PersonUnion } from "contracts/person.union";
import { GraphQLResolveInfo } from "graphql";
import resolveInfoToOrmFindOptions from "strategies/resolveInfoToOrmFindOptions";
import { MyContext } from 'utils/interfaces/context.interface'
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { Person } from "entities/person.entity";

@Resolver()
export class SearchResolver {
	@Query(() => [PersonUnion])
	public async searchPeople(
    @Arg('keyword') keyword: string,
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Person[]> {
    console.log('keyword: ', keyword)
    		const findOptions = resolveInfoToOrmFindOptions(info)
				return ctx.em
					.getRepository(Person)
					.findAll(findOptions as FindOptions<Person>)
  }
}