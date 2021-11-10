declare global {

declare namespace UtilityTypes {
	declare interface TimesUtilityFunction {
		<T>(n: number, fn: (i: number) => T): T[];
	}
}

}
