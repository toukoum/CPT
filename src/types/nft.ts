import { Attribute, Parameter } from "@/types/template";

export type NFTAsset = {
	name: string;
	owner: string;
	publicKey: string;
	uri: string;
	uriResult: uriNFT;
};

export type uriNFT = {
	name: string;
	description: string;
	image: string;
	attributes: Attribute[];
	parameters: Parameter[];
}