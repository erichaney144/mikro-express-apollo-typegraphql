// npm install @apollo/server express graphql cors body-parser
require('dotenv').config();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { GraphQLSchema } from 'graphql';
import { buildSchema, registerEnumType } from 'type-graphql';
import { AuthorResolver } from 'resolvers/author.resolvers';
import { BookResolver } from 'resolvers/book.resolvers';
import { PublisherType } from 'contracts/enums/publisherType.enum';
import { MikroORM } from '@mikro-orm/postgresql';
import config from './mikro-orm.config';

const server = async () => {
  // Create a database connection and initialize the ORM
  const orm = await MikroORM.init(config);

  // Build the graphql schema with type-graphql
	const schema: GraphQLSchema = await buildSchema({
		resolvers: [AuthorResolver, BookResolver],
	});

	// Required logic for integrating with Express
	const app = express();
	// Our httpServer handles incoming requests to our Express app.
	// Below, we tell Apollo Server to "drain" this httpServer,
	// enabling our servers to shut down gracefully.
	const httpServer = http.createServer(app);

	// Same ApolloServer initialization as before, plus the drain plugin
	// for our httpServer.
	const server = new ApolloServer<MyContext>({
		schema,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
	// Ensure we wait for our server to start
	await server.start();

	// Set up our Express middleware to handle CORS, body parsing,
	// and our expressMiddleware function.
	app.use(
		'/',
		cors<cors.CorsRequest>(),
		bodyParser.json(),
		// expressMiddleware accepts the same arguments:
		// an Apollo Server instance and optional configuration options
		expressMiddleware(server, {
			context: async ({ req }) => ({ token: req.headers.token }),
		})
	);

	// Modified server startup
	await new Promise<void>((resolve) =>
		httpServer.listen({ port: 4000 }, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:4000/`);
};

/**
 *  Catch and handle any top level server errors
 * */
server().catch((err) => {
	console.error('Express server', 'Top level Error', err);
});
