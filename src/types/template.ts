export interface Attribute {
	traitType: string;
	value: string;
}

export interface Parameter {
	name: string;
	type: string;
	description: string;
	required: boolean;
}

export interface Template {
	pubKeyTemplate: string;
	name: string;
	description: string;
	image: string;
	attributes: Attribute[];
	parameters: Parameter[];
	creator: string;
	price: string;
}

export interface dataTemplate {
	publicKey: string;
	account: {
		name: string;
		uri: string;
		creator: string;
		price: string;
	}
}

export interface uriResult {
	name: string;
	description: string;
	image: string;
	attributes: Attribute[];
	parameters: Parameter[];
}
