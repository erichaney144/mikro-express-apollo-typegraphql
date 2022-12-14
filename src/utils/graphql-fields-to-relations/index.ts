// https://github.com/bnussman/graphql-fields-to-relations
import { GraphQLResolveInfo } from 'graphql';
import { graphqlFields } from 'utils/graphql-fields-to-relations/fields';

export const fieldsToRelations = (
	info: GraphQLResolveInfo,
	options: { depth?: number; root?: string; excludeFields?: string[] } = {
		depth: undefined,
		root: '',
		excludeFields: [],
	}
): string[] => {
	const paths: string[][] = [];

	const nested = (
		field: any,
		key: string = undefined as any,
		deep = 0,
		parent: string[] = []
	) => {
		if (!field || Object.values(field).length === 0) {
			return;
		}

		if (deep > 0 || !!options.root) {
			parent.push(key);
			if (
				parent.slice(!options.root ? 0 : options.root?.split('.').length)
					.length > 0 &&
				parent
					.slice(0, !options.root ? 0 : options.root?.split('.').length)
					.toString() ===
					(!options.root ? '' : options.root?.split('.').toString())
			) {
				const path = parent.slice(
					!options.root ? 0 : options.root?.split('.').length
				);
				paths.push(path);
			}
		}

		Object.keys(field).forEach((key: any) => {
			if (
				Object.values(field[key]).length > 0 && !!options.depth
					? deep < options.depth
					: true
			) {
				nested(field[key], key, deep + 1, [...parent]);
			}
		});
	};

	const value = !options.root
		? graphqlFields(info, {}, { excludedFields: options.excludeFields })
		: options.root.split('.').reduce(function (p:any, prop) {
				return p[prop];
		  }, graphqlFields(info, {}, { excludedFields: options.excludeFields }));

	nested(value, !!options.root ? options.root.split('.').pop() : undefined);

	return paths.map((list: string[]) => list.join('.'));
};
