
declare module "*.png" {
	declare const val: string
	export default val
}

declare module "*.jpg" {
	declare const val: string
	export default val
}

declare module "*.svg" {
	declare const content: string;
	export default content;
}
