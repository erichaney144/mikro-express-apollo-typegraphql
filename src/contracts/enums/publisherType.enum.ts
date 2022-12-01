import { registerEnumType } from "type-graphql";

export enum PublisherType {
	LOCAL = 'local',
	GLOBAL = 'global',
}

registerEnumType(PublisherType, {name: "PublisherType"});
