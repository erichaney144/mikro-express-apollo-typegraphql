require('dotenv').config()
import { Options } from '@mikro-orm/core'
import { TSMigrationGenerator } from '@mikro-orm/migrations'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Author } from 'entities/author.entity'
import { Book } from 'entities/book.entity'
import { Publisher } from 'entities/publisher.entity'
import { Tag } from 'entities/tag.entity'

const config: Options = {
	metadataProvider: TsMorphMetadataProvider,
	type: 'postgresql' as any,
	user: process.env.POSTGRES_USER || 'root',
	password: process.env.POSTGRES_PASSWORD || 'root',
	dbName: process.env.POSTGRES_DB || 'mikrotest',
	host: process.env.POSTGRES_HOST || 'localhost',
	port: 5432,
	entities: [Author, Book, Publisher, Tag],
	//entitiesTs: [User],
	//entitiesTs: ['./src/entities'],
	migrations: {
		tableName: 'migrations', // name of database table with log of executed transactions
		path: './dist/migrations', // path to the folder with migrations
		pathTs: './src/migrations', // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
		glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
		transactional: true, // wrap each migration in a transaction
		disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
		allOrNothing: true, // wrap all migrations in master transaction
		dropTables: true, // allow to disable table dropping
		safe: false, // allow to disable table and column dropping
		snapshot: true, // save snapshot when creating new migrations
		generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
	},
}

export default config
