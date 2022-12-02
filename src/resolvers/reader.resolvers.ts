import { FindOneOptions, FindOptions } from '@mikro-orm/core'
import { GraphQLResolveInfo } from 'graphql'
import ormFindOptions from 'strategies/resolveInfoToOrmFindOptions'
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from 'utils/interfaces/context.interface'
import { Reader } from 'entities/reader.entity'
import PersonValidator from 'contracts/validators/person.validator'
import ReaderValidator from 'contracts/validators/reader.validator'
import { Book } from 'entities/book.entity'

@Resolver(() => Reader)
export class ReaderResolver {
	@Query(() => [Reader])
	public async getReaders(
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Reader[]> {
		const findOptions = ormFindOptions(info)
		return ctx.em
			.getRepository(Reader)
			.findAll(findOptions as FindOptions<Reader>)
	}

	@Query(() => Reader, { nullable: true })
	public async getReader(
		@Arg('id') id: number,
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Reader | null> {
		const findOptions = ormFindOptions(info)

		return ctx.em
			.getRepository(Reader)
			.findOne({ id }, findOptions as FindOneOptions<Reader>)
	}

	@Mutation(() => Reader)
	public async addReader(
		@Arg('input') input: PersonValidator,
		@Ctx() ctx: MyContext
	): Promise<Reader> {
		const reader = new Reader(input)
		await ctx.em.persist(reader).flush()
		return reader
	}

	@Mutation(() => Reader)
	public async updateReader(
		@Arg('input') input: ReaderValidator,
		@Arg('id') id: number,
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Reader> {
		const findOptions = ormFindOptions(info)
		const reader = await ctx.em
			.getRepository(Reader)
			.findOneOrFail({ id }, findOptions as FindOneOptions<Reader>)
		reader.assign(input)

		const bookOptions = ormFindOptions(info, {
			root: 'favoriteBook',
		}) as FindOneOptions<Book>

		if (input.favoriteBookId) {
			reader.favoriteBook =
				(await ctx.em
					.getRepository(Book)
					.findOne(input.favoriteBookId, bookOptions)) || undefined
		} else {
			reader.favoriteBook = undefined
		}

		await ctx.em.persist(reader).flush()

		return reader
	}

	@Mutation(() => Boolean)
	public async deleteReader(
		@Arg('id') id: number,
		@Ctx() ctx: MyContext
	): Promise<boolean> {
		const reader = await ctx.em.getRepository(Reader).findOneOrFail({ id })
		await ctx.em.getRepository(Reader).remove(reader).flush()
		return true
	}
}
