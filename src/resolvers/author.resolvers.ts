import { FindOneOptions, FindOptions } from '@mikro-orm/core';
import { GraphQLResolveInfo } from 'graphql';
import ormFindOptions from 'strategies/resolveInfoToOrmFindOptions';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from 'utils/interfaces/context.interface';
import { Author } from 'entities/author.entity';
import AuthorValidator from 'contracts/validators/author.validator';

@Resolver(() => Author)
export class AuthorResolver {
	@Query(() => [Author])
	public async getAuthors(
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Author[]> {
		const findOptions = ormFindOptions(info);
		return ctx.em.getRepository(Author).findAll(findOptions as FindOptions<Author>);
	}

	@Query(() => Author, { nullable: true })
	public async getAuthor(
		@Arg('id') id: number,
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Author | null> {
		const findOptions = ormFindOptions(info);

		return ctx.em.getRepository(Author).findOne({ id }, findOptions as FindOneOptions<Author>);
	}

	@Mutation(() => Author)
	public async addAuthor(
		@Arg('input') input: AuthorValidator,
		@Ctx() ctx: MyContext
	): Promise<Author> {
		const author = new Author(input);
		await ctx.em.persist(author).flush();
		return author;
	}

	@Mutation(() => Author)
	public async updateAuthor(
		@Arg('input') input: AuthorValidator,
		@Arg('id') id: number,
		@Ctx() ctx: MyContext,
		@Info() info: GraphQLResolveInfo
	): Promise<Author> {
		const findOptions = ormFindOptions(info);
		const author = await ctx.em
			.getRepository(Author)
			.findOneOrFail({ id }, findOptions as FindOneOptions<Author>);
		author.assign(input);
		await ctx.em.persist(author).flush();
		return author;
	}

	@Mutation(() => Boolean)
	public async deleteAuthor(
		@Arg('id') id: number,
		@Ctx() ctx: MyContext
	): Promise<boolean> {
		const author = await ctx.em.getRepository(Author).findOneOrFail({ id });
		await ctx.em.getRepository(Author).remove(author).flush();
		return true;
	}
}
